// ============================================
// JOURNALIST ENUMS — sync với backend journalist.enum.ts
// ============================================

export enum JournalistCategory {
  POLITICS = "politics",
  ECONOMICS = "economics",
  SOCIETY = "society",
  CULTURE = "culture",
  TECHNOLOGY = "technology",
  EDUCATION = "education",
  HEALTH = "health",
  SPORTS = "sports",
  ENTERTAINMENT = "entertainment",
  ENVIRONMENT = "environment",
  SCIENCE = "science",
  INVESTIGATION = "investigation",
}

export enum JournalistTag {
  INVESTIGATION = "investigation",
  INTERVIEW = "interview",
  BREAKING_NEWS = "breakingNews",
  COMMENTARY = "commentary",
  REPORTAGE = "reportage",
  FEATURE = "feature",
  EDITORIAL = "editorial",
  PHOTOJOURNALISM = "photojournalism",
  COLUMN = "column",
  PROFILE = "profile",
  OPINION = "opinion",
  FACT_CHECK = "factCheck",
  ANALYSIS = "analysis",
  EXCLUSIVES = "exclusives",
  PODCAST = "podcast",
  VIDEO_REPORT = "videoReport",
}

// ============================================
// JOURNALIST ARTICLE ENTITY — map từ Prisma model journalist_articles
// ============================================

export interface JournalistArticle {
  id: string;
  user_id: string;
  title: string;
  summary: string | null;
  content_url: string;
  publisher_name: string;
  category: string | null;
  published_at: string | null;
  thumbnail_url: string | null;
  tags: string[] | null;
}

// ============================================
// RESPONSE TYPES
// ============================================

// Response: GET /journalist/articles/user/:userId
export type GetArticlesResponse = JournalistArticle[];

// Response: GET /journalist/articles/:id
export type GetArticleDetailResponse = JournalistArticle;

// Response chung cho các mutation (POST/PATCH/DELETE)
export type MutationArticleResponse = JournalistArticle;

// ============================================
// REQUEST TYPES — User
// ============================================

// Request: POST /journalist/articles (multipart/form-data)
export interface CreateArticleRequest {
  title: string;
  summary?: string;
  contentUrl: string;
  publisherName: string;
  category?: JournalistCategory;
  publishedAt?: string;       // ISO date string, VD: "2026-05-21"
  image?: File;               // file upload (optional)
  tags?: JournalistTag[];
}

// Request: PATCH /journalist/articles/:id (multipart/form-data)
export interface UpdateArticleRequest {
  id: string;                 // article ID — path param
  title?: string;
  summary?: string;
  contentUrl?: string;
  publisherName?: string;
  category?: JournalistCategory;
  publishedAt?: string;
  image?: File;
  tags?: JournalistTag[];
}

// ============================================
// REQUEST TYPES — Admin
// ============================================

// Request: POST /journalist/manage/articles/:userId
export interface AdminCreateArticleRequest extends CreateArticleRequest {
  userId: string;             // path param — target user
}

// Request: PATCH /journalist/manage/articles/:id
export interface AdminUpdateArticleRequest {
  id: string;                 // article ID — path param
  title?: string;
  summary?: string;
  contentUrl?: string;
  publisherName?: string;
  category?: JournalistCategory;
  publishedAt?: string;
  image?: File;
  tags?: JournalistTag[];
}
