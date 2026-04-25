#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MetaApiClient } from "./services/api.js";
import { registerPageTools } from "./tools/pages.js";
import { registerInstagramTools } from "./tools/instagram.js";
import { registerAdsTools } from "./tools/ads.js";
import { registerAudiencesTools } from "./tools/audiences.js";
import { registerInsightsTools } from "./tools/insights.js";
import { registerThreadsTools } from "./tools/threads.js";
import { registerAdLibraryTools } from "./tools/ad_library.js";
import { registerConversionTools } from "./tools/conversions.js";
import { registerPixelInsightsTools } from "./tools/pixel_insights.js";
import { registerUtilityTools } from "./tools/utility.js";
import { registerChartTools } from "./tools/charts.js";
import { registerCommerceTools } from "./tools/commerce.js";
import { resolveApiKey } from "./op-fallback.js";

resolveApiKey("META_ACCESS_TOKEN", "op://Development/Meta Access Token/credential");
resolveApiKey("THREADS_ACCESS_TOKEN", "op://Development/Threads Access Token/credential");

const token = process.env.META_ACCESS_TOKEN ?? "";
const threadsToken = process.env.THREADS_ACCESS_TOKEN;

const client = new MetaApiClient(token, threadsToken);

const server = new McpServer({
  name: "meta-mcp-server",
  version: "2.0.0",
});

const ALLOWED_TOOLS = new Set([
  "meta_list_campaigns",
  "meta_get_campaign",
  "meta_list_adsets",
  "meta_get_adset",
  "meta_list_ads",
  "meta_get_ad",
  "meta_get_account_insights",
  "meta_get_campaign_insights",
  "meta_get_adset_insights",
  "meta_get_ad_insights",
  "meta_list_pixels",
  "meta_get_pixel",
  "meta_get_pixel_stats",
  "meta_get_pixel_events",
  "meta_list_ad_accounts",
  "meta_get_ad_account",
  "meta_list_custom_audiences",
  "meta_get_custom_audience",
  "meta_get_ad_preview",
  "meta_search_ad_library",
  "meta_debug_token",
  "meta_health_check",
  "meta_generate_chart",
  "meta_generate_comparison_chart",
  "meta_get_dataset_quality",
  "meta_get_pixel_adsets",
  "meta_get_pixel_da_checks"
]);

const originalRegisterTool = server.registerTool.bind(server);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(server as any).registerTool = function (name: string, ...rest: unknown[]) {
  if (ALLOWED_TOOLS.has(name)) {
    return (originalRegisterTool as any)(name, ...rest);
  }
  return server;
};

registerPageTools(server, client);
registerInstagramTools(server, client);
registerAdsTools(server, client);
registerAudiencesTools(server, client);
registerInsightsTools(server, client);
registerThreadsTools(server, client);
registerAdLibraryTools(server, client);
registerConversionTools(server, client);
registerPixelInsightsTools(server, client);
registerUtilityTools(server, client);
registerChartTools(server);
registerCommerceTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
