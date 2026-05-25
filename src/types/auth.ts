// ============================================
// AUTH TYPES
// ============================================

export interface Users {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatar?: string;
  role?: string;
  isEmailConfirmed?: boolean;
  createdAt?: string;
}

// ---------- LOGIN ----------
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: Users;
}

// ---------- GOOGLE LOGIN ----------
export interface LoginGGResponse {
  accessToken: string;
  refreshToken?: string;
  user: Users;
}

// ---------- REGISTER ----------
export interface RegisterRequestDto {
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
  fullName?: string;
}

export interface RegisterResponseDto {
  message: string;
  email: string;
}

// ---------- FORGOT PASSWORD ----------
export interface sendEmailForgotPassword {
  email: string;
}

// ---------- RESET PASSWORD ----------
export interface resetPasswordInformation {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ---------- LOGOUT ----------
export interface Logout {
  message: string;
}
