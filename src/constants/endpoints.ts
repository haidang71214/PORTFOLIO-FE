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
} as const;
