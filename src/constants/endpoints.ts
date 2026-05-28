// ============================================
// AUTH ENDPOINTS - theo Swagger API docs
// ============================================
export const authEndpoint = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgotPass",
  RESET_PASSWORD: "/auth/reset-pass",
  LOGOUT: "/auth/logout",
  EXTEND_TOKEN: "/auth/extend-token",
  GOOGLE_LOGIN: "/auth/google-login",
  CONFIRM_EMAIL: "/auth/confirm-email",
  CONFIRM_PASSWORD_CHANGE: "/auth/confirm-password-change",
  CHANGE_PASSWORD: "/auth/change-password",
  GET_ME: "/auth/me",
  UPDATE_ME: "/users/me",
} as const;

// ============================================
// PROFILE ENDPOINTS
// ============================================
export const profileEndpoint = {
  // Portfolio
  GET_PROFILE:          (id: string)     => `/profile/${id}`,
  UPDATE_MY_PORTFOLIO:                      "/profile/me/portfolio",

  // Theme
  CHANGE_MY_THEME:                          "/profile/me/theme",
  ADMIN_CHANGE_THEME:   (userId: string) => `/profile/admin/theme/${userId}`,

  // Skills
  GET_SKILLS:           (userId: string) => `/profile/skill/${userId}`,
  CREATE_MY_SKILL:                          "/profile/me/skills",
  UPDATE_MY_SKILL:      (id: string)     => `/profile/me/skills/${id}`,
  ADMIN_UPSERT_SKILL:                       "/profile/manage/skills",   // ?id=&userId=
  DELETE_SKILL:         (id: string)     => `/profile/skill/${id}`,

  // Certificates
  GET_CERTIFICATES:     (userId: string) => `/profile/certificate/${userId}`,
  GET_CERT_DETAIL:      (id: string)     => `/profile/certificate/detail/${id}`,
  CREATE_CERT:                              "/profile/certificate",
  UPDATE_CERT:                              "/profile/certificate",
  DELETE_CERT:          (id: string)     => `/profile/certificate/${id}`,
  ADMIN_CREATE_CERT:    (userId: string) => `/profile/manage/certificate/${userId}`,
  ADMIN_UPDATE_CERT:    (userId: string) => `/profile/manage/certificate/${userId}`,
  ADMIN_DELETE_CERT:    (id: string)     => `/profile/manage/certificate/${id}`,

  // Experience
  GET_EXPERIENCES:      (userId: string) => `/profile/experience/${userId}`,
  GET_EXP_DETAIL:       (id: string)     => `/profile/experience/detail/${id}`,
  CREATE_EXP:                               "/profile/experience",
  UPDATE_EXP:                               "/profile/experience",
  DELETE_EXP:           (id: string)     => `/profile/experience/${id}`,
  ADMIN_CREATE_EXP:     (userId: string) => `/profile/manage/experience/${userId}`,
  ADMIN_UPDATE_EXP:     (userId: string) => `/profile/experience/${userId}`,
  ADMIN_DELETE_EXP:     (id: string)     => `/profile/manager/experience/${id}`,
} as const;

// ============================================
// TEMPLATES (themes) ENDPOINTS
// ============================================
export const templatesEndpoint = {
  GET_ALL: "/templates",
  GET_ONE: (id: string) => `/templates/${id}`,
} as const;
