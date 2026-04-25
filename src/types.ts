export enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json",
}

export interface MetaPage {
  id: string;
  name: string;
  category?: string;
  fan_count?: number;
  followers_count?: number;
  link?: string;
  description?: string;
  about?: string;
  access_token?: string;
  instagram_business_account?: { id: string };
}

export interface MetaPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  full_picture?: string;
  permalink_url?: string;
  from?: { name: string; id: string };
}

export interface InstagramAccount {
  id: string;
  username?: string;
  name?: string;
  biography?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  profile_picture_url?: string;
  website?: string;
}

export interface InstagramMedia {
  id: string;
  media_type: string;
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  caption?: string;
  like_count?: number;
  comments_count?: number;
  timestamp?: string;
}

export interface InstagramComment {
  id: string;
  text: string;
  username?: string;
  timestamp?: string;
  from?: { id: string; username: string };
}

export interface Campaign {
  id: string;
  name: string;
  objective?: string;
  status: string;
  effective_status?: string;
  budget_remaining?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
  created_time?: string;
  updated_time?: string;
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: string;
  effective_status?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  billing_event?: string;
  optimization_goal?: string;
  start_time?: string;
  end_time?: string;
  targeting?: Record<string, unknown>;
  promoted_object?: {
    pixel_id?: string;
    custom_event_type?: string;
    offline_conversion_dataset_id?: string;
    product_set_id?: string;
  };
  created_time?: string;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  status: string;
  effective_status?: string;
  creative?: { id: string };
  created_time?: string;
  updated_time?: string;
  preview_shareable_link?: string;
}

export interface AdCreative {
  id: string;
  name?: string;
  title?: string;
  body?: string;
  image_url?: string;
  object_story_id?: string;
  object_type?: string;
  status?: string;
}

export interface AdAccount {
  id: string;
  name?: string;
  account_id?: string;
  account_status?: number;
  currency?: string;
  timezone_name?: string;
  spend_cap?: string;
  amount_spent?: string;
  balance?: string;
  business?: { id: string; name: string };
}

export interface CustomAudience {
  id: string;
  name: string;
  description?: string;
  subtype: string;
  approximate_count_lower_bound?: number;
  approximate_count_upper_bound?: number;
  time_created?: number;
  delivery_status?: { code: number; description: string };
  operation_status?: { code: number; description: string };
}

export interface MetaPaginatedResponse<T> {
  data: T[];
  paging?: {
    cursors?: { before: string; after: string };
    next?: string;
    previous?: string;
  };
}

export interface InsightData {
  date_start: string;
  date_stop: string;
  // Performance
  impressions?: string;
  reach?: string;
  clicks?: string;
  unique_clicks?: string;
  unique_impressions?: string;
  frequency?: string;
  // Cost
  spend?: string;
  cpm?: string;
  cpc?: string;
  cpp?: string;
  ctr?: string;
  social_spend?: string;
  // Engagement
  inline_link_clicks?: string;
  inline_link_click_ctr?: string;
  inline_post_engagement?: string;
  outbound_clicks?: string;
  outbound_clicks_ctr?: string;
  // Conversions
  conversions?: Array<{ action_type: string; value: string }>;
  conversion_values?: Array<{ action_type: string; value: string }>;
  cost_per_conversion?: Array<{ action_type: string; value: string }>;
  purchase_roas?: Array<{ action_type: string; value: string }>;
  // Video
  video_play_actions?: Array<{ action_type: string; value: string }>;
  video_avg_time_watched_actions?: Array<{ action_type: string; value: string }>;
  video_thruplay_watched_actions?: Array<{ action_type: string; value: string }>;
  video_p25_watched_actions?: Array<{ action_type: string; value: string }>;
  video_p50_watched_actions?: Array<{ action_type: string; value: string }>;
  video_p75_watched_actions?: Array<{ action_type: string; value: string }>;
  video_p95_watched_actions?: Array<{ action_type: string; value: string }>;
  video_p100_watched_actions?: Array<{ action_type: string; value: string }>;
  // Quality
  quality_ranking?: string;
  engagement_rate_ranking?: string;
  conversion_rate_ranking?: string;
  // Actions
  actions?: Array<{ action_type: string; value: string }>;
  cost_per_action_type?: Array<{ action_type: string; value: string }>;
  // Entity IDs
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  adset_name?: string;
  ad_id?: string;
  ad_name?: string;
  account_id?: string;
  account_name?: string;
}

export interface PageInsight {
  name: string;
  period: string;
  values: Array<{ value: number | Record<string, number>; end_time: string }>;
  title: string;
  description: string;
  id: string;
}

export interface ThreadsProfile {
  id: string;
  username?: string;
  name?: string;
  threads_profile_picture_url?: string;
  threads_biography?: string;
}

export interface ThreadsMedia {
  id: string;
  media_product_type?: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  username?: string;
  text?: string;
  timestamp?: string;
  shortcode?: string;
  thumbnail_url?: string;
  children?: { data: Array<{ id: string }> };
  is_quote_post?: boolean;
}

export interface ThreadsReply {
  id: string;
  text?: string;
  username?: string;
  timestamp?: string;
  media_type?: string;
  hide_status?: string;
}

export interface AdLibraryEntry {
  id: string;
  ad_creation_time?: string;
  ad_creative_bodies?: string[];
  ad_creative_link_captions?: string[];
  ad_creative_link_descriptions?: string[];
  ad_creative_link_titles?: string[];
  ad_delivery_start_time?: string;
  ad_delivery_stop_time?: string;
  ad_snapshot_url?: string;
  bylines?: string;
  currency?: string;
  delivery_by_region?: Array<{ region: string; percentage: number }>;
  demographic_distribution?: Array<{ age: string; gender: string; percentage: number }>;
  estimated_audience_size?: { lower_bound?: number; upper_bound?: number };
  impressions?: { lower_bound?: number; upper_bound?: number };
  languages?: string[];
  page_id?: string;
  page_name?: string;
  publisher_platforms?: string[];
  spend?: { lower_bound?: number; upper_bound?: number };
  target_ages?: string;
  target_gender?: string;
  target_locations?: Array<{ name: string; type: string }>;
}

export interface AdsPixel {
  id: string;
  name: string;
  code?: string;
  creation_time?: string;
  last_fired_time?: string;
  is_unavailable?: boolean;
  is_created_by_business?: boolean;
  first_party_cookie_status?: string;
  automatic_matching_fields?: string[];
  data_use_setting?: string;
  enable_automatic_matching?: boolean;
  description?: string;
  owner_business?: { id: string; name: string };
  matched_entries?: number;
  valid_entries?: number;
  duplicate_entries?: number;
  match_rate_approx?: number;
  event_stats?: string | Array<{
    event: string;
    raw_count: number;
    matched_count: number;
    match_rate: number;
    last_fired_time: string;
  }>;
  usage?: string;
}

export interface DatasetQuality {
  web?: Array<{
    event_name: string;
    event_match_quality?: {
      composite_score: number;
      match_key_feedback?: Array<{
        identifier: string;
        coverage?: {
          percentage: number;
        };
        potential_aly_acr_increase?: {
          percentage: number;
        };
      }>;
    };
    event_coverage?: string;
    event_deduplication?: string;
    data_freshness?: string;
    event_match_quality_diagnostics?: Array<{
      diagnostic_type: string;
      diagnostic_reason: string;
    }>;
  }>;
}
