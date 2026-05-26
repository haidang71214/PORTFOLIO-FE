import { authEndpoint } from "@/constants/endpoints";
import {
  ExtendTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types";
import { baseApi } from "../base";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // ─── POST /auth/login ───────────────────────────────
    // Request: { email, password }
    // Response: { response: { token, refreshToken, user } }
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (params) => ({
        url: authEndpoint.LOGIN,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["User"],
    }),

    // ─── POST /auth/register ────────────────────────────
    // Request: multipart/form-data (có thể upload ảnh)
    // Response: { result: { data: AuthUser } }
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (params) => {
        const formData = new FormData();
        formData.append("username", params.username);
        formData.append("email", params.email);
        formData.append("pass", params.pass);
        formData.append("major", params.major);
        formData.append("role", params.role);
        if (params.images) {
          formData.append("images", params.images);
        }
        return {
          url: authEndpoint.REGISTER,
          method: "POST",
          body: formData,
          // Không set Content-Type — browser tự gán multipart/form-data với boundary
          formData: true,
        };
      },
    }),

    // ─── POST /auth/forgotPass ──────────────────────────
    // Request: { email }
    // Response: { message: "Gửi mail thành công rồi nha!" }
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (params) => ({
        url: authEndpoint.FORGOT_PASSWORD,
        method: "POST",
        body: params,
      }),
    }),

    // ─── POST /auth/reset-pass ──────────────────────────
    // Request: { email, resetToken, newPassWord }  ← chú ý chữ W hoa
    // Response: { data: AuthUser & { refresh_token: null, resetToken: null } }
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (params) => ({
        url: authEndpoint.RESET_PASSWORD,
        method: "POST",
        body: params,
      }),
    }),

    // ─── POST /auth/logout ──────────────────────────────
    // Header: Authorization: Bearer <token>
    // Response: { result: { message: "logout success" } }
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: authEndpoint.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // ─── POST /auth/extend-token ────────────────────────
    // Không cần body — browser tự gửi HttpOnly cookie refreshToken
    // Phải dùng credentials: "include" (đã cấu hình ở rawBaseQuery)
    // Response: { accessToken: string }
    extendToken: builder.mutation<ExtendTokenResponse, void>({
      query: () => ({
        url: authEndpoint.EXTEND_TOKEN,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useExtendTokenMutation,
} = authApi;
