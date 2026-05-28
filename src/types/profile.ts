// ============================================
// PROFILE TYPES — sync với GET /profile/:id
// ============================================

export interface ProfileData {
  id: string;
  user_id: string;
  title: string | null;
  bio: string | null;
  github: string | null;
  linkedin: string | null;
  website: string | null;
  location: string | null;
  avatar_url: string | null;
  theme_id: string | null;
  created_at: string;
  updated_at: string;
}

// Response: GET /profile/:id
export interface GetProfileResponse {
  data: ProfileData;
}

// ============================================
// PORTFOLIO UPDATE TYPES — PATCH /profile/me/portfolio
// ============================================

export interface UpdatePortfolioRequest {
  title?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  location?: string;
}

// Response: PATCH /profile/me/portfolio
export interface UpdatePortfolioResponse {
  data?: ProfileData;
  message?: string;
}

// ============================================
// THEME TYPES
// ============================================

export interface ThemeTemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  preview_url: string | null;            // compatibility
  previewImageUrls?: string[];            // new multiple preview images
  preview_images?: any;                  // compatibility with backend database
  major: string | null;                  // compatibility
  targetMajor: string;                   // target profession major
  target_major?: string;                 // compatibility with backend snake_case
  price?: number;
  stockLimit?: number | null;
  defaultConfig?: string | null;
  isActive?: boolean;                    // new boolean isActive
  is_active: boolean;                    // compatibility
  created_at: string;
}

export type GetAllTemplatesResponse = ThemeTemplate[];


// Request: PATCH /profile/me/theme
export interface ChangeThemeRequest {
  theme_id: string;
}

// Response: PATCH /profile/me/theme | /profile/admin/theme/:userId
export interface ChangeThemeResponse {
  data?: ProfileData;
  message?: string;
}

// Request: PATCH /profile/admin/theme/:userId
export interface AdminChangeThemeRequest {
  userId: string;
  theme_id: string;
}

// ============================================
// SKILL TYPES
// ============================================

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  level: number | null;
  category: string | null;
  created_at?: string;
  updated_at?: string;
}

// Response: GET /profile/skill/:userId
export type GetSkillsResponse = Skill[];

// Request: PATCH /profile/me/skills/:id  (id là skill ID, để "" nếu tạo mới)
export interface UpsertSkillRequest {
  name: string;
  level?: number;
  category?: string;
}

// Request: PATCH /profile/manage/skills?id=&userId=  (Admin)
export interface AdminUpsertSkillRequest extends UpsertSkillRequest {
  id: string;      // query param — skill ID
  userId: string;  // query param — user ID
}

export type UpsertSkillResponse = Skill;

// ============================================
// CERTIFICATE TYPES
// ============================================

export interface Certificate {
  id: string;
  user_id: string;
  name: string;
  organization: string | null;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

// Response: GET /profile/certificate/:userId
export type GetCertificatesResponse = Certificate[];

// Response: GET /profile/certificate/detail/:id
export type GetCertDetailResponse = Certificate;

// Request: POST|PATCH /profile/certificate  (multipart/form-data)
export interface UpsertCertRequest {
  id?: string;              // chỉ dùng khi update
  name: string;
  organization?: string;
  issue_date?: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  image?: File;             // file upload (optional)
}

// Admin create/update — path param: userId
export interface AdminUpsertCertRequest extends UpsertCertRequest {
  userId: string;
}

export type UpsertCertResponse = Certificate;

// ============================================
// EXPERIENCE TYPES
// ============================================

export interface Experience {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

// Response: GET /profile/experience/:userId
export type GetExperiencesResponse = Experience[];

// Response: GET /profile/experience/detail/:id
export type GetExpDetailResponse = Experience;

// Request: POST|PATCH /profile/experience
export interface UpsertExpRequest {
  id?: string;          // chỉ dùng khi update
  company_name: string;
  position: string;
  start_date: string;   // ISO date string, VD: "2023-01-15"
  end_date?: string;
  description?: string;
}

// Admin — path param: userId
export interface AdminUpsertExpRequest extends UpsertExpRequest {
  userId: string;
}

export type UpsertExpResponse = Experience;
