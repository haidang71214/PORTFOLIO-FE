// ============================================
// AUTH TYPES — sync với API docs lawoh.click
// ============================================

// ---------- USER ----------
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  images_url: string | null;
  role: "user" | "admin";
  major: "it" | "journalist" | "designer" | "economics" | "other";
  created_at: string;
}

// Alias ngắn để tương thích với code cũ (webStorageClient dùng Users)
export type Users = AuthUser;

// ---------- LOGIN ----------
// Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Response: POST /auth/login => { response: { token, refreshToken, user } }
export interface LoginResponse {
  response: {
    token: string;         // Access Token (hết hạn 1h) — lưu vào localStorage/cookie
    refreshToken: string;  // Server tự set vào HttpOnly cookie, FE nhận để lưu local nếu cần
    user: AuthUser;
  };
}

// ---------- REGISTER ----------
// Request: multipart/form-data
export interface RegisterRequest {
  username: string;
  email: string;
  pass: string;            // Lưu ý: field là "pass" chứ không phải "password"
  major: "it" | "journalist" | "designer" | "economics" | "other";
  role: "admin" | "user";
  images?: File;           // Optional file upload
}

// Response: POST /auth/register => { result: { data: AuthUser } }
export interface RegisterResponse {
  result: {
    data: AuthUser;
  };
}

// ---------- FORGOT PASSWORD ----------
// Request: POST /auth/forgotPass
export interface ForgotPasswordRequest {
  email: string;
}

// Response
export interface ForgotPasswordResponse {
  message: string; // "Gửi mail thành công rồi nha!"
}

// ---------- RESET PASSWORD ----------
// Request: POST /auth/reset-pass
// Lưu ý: field là "newPassWord" — chữ W VIẾT HOA
export interface ResetPasswordRequest {
  email: string;
  resetToken: string;      // Mã 7 ký tự nhận qua email
  newPassWord: string;     // Chú ý chữ W hoa theo API docs
}

// Response: POST /auth/reset-pass => { data: AuthUser & extras }
export interface ResetPasswordResponse {
  data: AuthUser & {
    refresh_token: null;
    resetToken: null;
  };
}

// ---------- LOGOUT ----------
// Response: POST /auth/logout => { result: { message: string } }
export interface LogoutResponse {
  result: {
    message: string; // "logout success"
  };
}

// ---------- EXTEND TOKEN (Refresh Access Token) ----------
// Response: POST /auth/extend-token => { accessToken: string }
export interface ExtendTokenResponse {
  accessToken: string;
}

// ── Legacy aliases (giữ để tương thích với code cũ chưa refactor) ──
/** @deprecated Dùng LoginRequest thay thế */
export type { LoginRequest as LoginDto };
/** @deprecated Dùng ForgotPasswordRequest thay thế */
export interface sendEmailForgotPassword {
  email: string;
}
/** @deprecated Dùng ResetPasswordRequest thay thế */
export interface resetPasswordInformation {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}
/** @deprecated */
export interface RegisterRequestDto {
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
  fullName?: string;
}
/** @deprecated */
export interface RegisterResponseDto {
  message: string;
  email: string;
}
/** @deprecated */
export interface Logout {
  message: string;
}
/** @deprecated */
export interface LoginResponse_Legacy {
  accessToken: string;
  refreshToken?: string;
  user: Users;
}
/** @deprecated */
export type LoginGGResponse = LoginResponse_Legacy;

// ---------- ERROR RESPONSE ----------
export interface ApiError {
  status: number;
  data: {
    message: string;
    error: string;
    statusCode: number;
  };
}

export type ErrorForm = ApiError;

