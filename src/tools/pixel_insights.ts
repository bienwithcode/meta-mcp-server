import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MetaApiClient } from "../services/api.js";
import { errorResult, formatDate, formatNumber, ResponseFormatSchema } from "../services/utils.js";
import { ADSET_FIELDS } from "../constants.js";
import { AdSet, DatasetQuality, MetaPaginatedResponse } from "../types.js";

/**
 * Renders EMQ score with a status indicator icon.
 */
function renderEMQScore(score: any): string {
  const numScore = Number(score);
  if (isNaN(numScore)) return "N/A (Invalid data)";
  
  if (numScore >= 8) return `🟢 ${numScore.toFixed(1)}/10 (Excellent)`;
  if (numScore >= 6) return `🟡 ${numScore.toFixed(1)}/10 (Good)`;
  if (numScore >= 4) return `🟠 ${numScore.toFixed(1)}/10 (Fair)`;
  return `🔴 ${numScore.toFixed(1)}/10 (Poor)`;
}

export function registerPixelInsightsTools(server: McpServer, client: MetaApiClient): void {
  // ─── Get Dataset Quality (EMQ) ──────────────────────────────────────────
  server.registerTool(
    "meta_get_dataset_quality",
    {
      title: "Get Dataset Quality (EMQ)",
      description: `Retrieve Event Match Quality scores and diagnostics from the Dataset Quality API.
Critical for evaluating Conversions API (CAPI) performance.`,
      inputSchema: z
        .object({
          pixel_id: z.string().describe("Meta Pixel / Dataset ID"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ pixel_id, response_format }) => {
      try {
        const data = await client.get<DatasetQuality>("/dataset_quality", {
          dataset_id: pixel_id,
          fields: "web{event_match_quality,event_name}",
        });

        if (response_format === "json") {
          return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }

        if (!data.web?.length) {
          return { content: [{ type: "text", text: "No quality data found for this dataset. Ensure CAPI is active." }] };
        }

        const lines = [`# Dataset Quality: \`${pixel_id}\``, "", "## Event Match Quality (EMQ)", ""];
        lines.push("| Event | EMQ Score |");
        lines.push("|-------|-----------|");

        for (const evt of data.web) {
          const score = evt.event_match_quality?.composite_score;
          const scoreDisplay = score !== undefined ? renderEMQScore(score) : "N/A (No data)";
          lines.push(`| ${evt.event_name} | ${scoreDisplay} |`);
        }

        return { content: [{ type: "text", text: lines.join("\n") }] };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // ─── Get Pixel Ad Sets ──────────────────────────────────────────────────
  server.registerTool(
    "meta_get_pixel_adsets",
    {
      title: "Get Ad Sets Using Pixel",
      description: `Find all Ad Sets using a specific Pixel for conversion optimization.
Note: This performs a scan of ad sets in the account to find matches.`,
      inputSchema: z
        .object({
          pixel_id: z.string().describe("Pixel ID to search for"),
          ad_account_id: z.string().describe("Ad account ID to search within"),
          status_filter: z.array(z.enum(["ACTIVE", "PAUSED", "ARCHIVED"])).optional()
            .describe("Filter ad sets by status"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ pixel_id, ad_account_id, status_filter, response_format }) => {
      try {
        const params: Record<string, string> = {
          fields: ADSET_FIELDS,
          limit: "100",
        };

        if (status_filter?.length) {
          params.filtering = JSON.stringify([{
            field: "effective_status",
            operator: "IN",
            value: status_filter
          }]);
        }

        const data = await client.get<MetaPaginatedResponse<AdSet>>(`/${ad_account_id}/adsets`, params);
        
        const matchedAdSets = (data.data ?? []).filter(as => 
          as.promoted_object?.pixel_id === pixel_id
        );

        if (response_format === "json") {
          return { content: [{ type: "text", text: JSON.stringify(matchedAdSets, null, 2) }] };
        }

        if (matchedAdSets.length === 0) {
          return { content: [{ type: "text", text: `No ad sets found using pixel \`${pixel_id}\` in account \`${ad_account_id}\`.` }] };
        }

        const lines = [`# Ad Sets Using Pixel \`${pixel_id}\` (${matchedAdSets.length} found)`, ""];
        for (const as of matchedAdSets) {
          lines.push(`## ${as.name} (\`${as.id}\`)`);
          lines.push(`- **Status**: ${as.effective_status}`);
          lines.push(`- **Optimization**: ${as.optimization_goal}`);
          if (as.promoted_object?.custom_event_type) {
            lines.push(`- **Event**: ${as.promoted_object.custom_event_type}`);
          }
          lines.push("");
        }

        return { content: [{ type: "text", text: lines.join("\n") }] };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // ─── Get Pixel DA Checks ────────────────────────────────────────────────
  server.registerTool(
    "meta_get_pixel_da_checks",
    {
      title: "Get Pixel Dynamic Ads Checks",
      description: `Run diagnostic checks for Dynamic Ads pixel setup.`,
      inputSchema: z
        .object({
          pixel_id: z.string(),
          checks: z.array(z.string()).optional()
            .describe("Specific DA checks to run; omit for all"),
          connection_method: z.enum(["ALL", "APP", "BROWSER", "SERVER"]).default("ALL"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ pixel_id, checks, connection_method, response_format }) => {
      try {
        const params: Record<string, string> = {
          connection_method,
        };
        if (checks?.length) {
          params.checks = JSON.stringify(checks);
        }

        const data = await client.get<{ data: Array<{ title: string; result: string; description: string; key: string }> }>(
          `/${pixel_id}/da_checks`,
          params
        );

        if (response_format === "json") {
          return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }

        const lines = [`# Dynamic Ads Checks: \`${pixel_id}\``, ""];
        lines.push("| Check | Status | Description |");
        lines.push("|-------|--------|-------------|");

        for (const check of data.data) {
          const statusIcon = check.result === "passed" ? "✅" : check.result === "warning" ? "⚠️" : "❌";
          lines.push(`| ${check.title} | ${statusIcon} ${check.result} | ${check.description} |`);
        }

        return { content: [{ type: "text", text: lines.join("\n") }] };
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
