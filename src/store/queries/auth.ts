import { authEndpoint } from "@/constants/endpoints";
import {
  AuthUser,
  ExtendTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateMeRequest,
  UpdateMeResponse,
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

    // ─── GET /auth/me ──────────────────────────────────────
    // Header: Authorization: Bearer <token>
    // Response: AuthUser (flat object)
    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: authEndpoint.GET_ME,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // ─── PATCH /users/me ───────────────────────────────────
    // Request: multipart/form-data
    // Response: AuthUser
    updateMe: builder.mutation<UpdateMeResponse, UpdateMeRequest>({
      query: (params) => {
        const formData = new FormData();
        if (params.username) formData.append("username", params.username);
        if (params.email) formData.append("email", params.email);
        if (params.password) formData.append("password", params.password);
        if (params.major) formData.append("major", params.major);
        if (params.role) formData.append("role", params.role);
        if (params.images) {
          formData.append("images", params.images);
        }
        return {
          url: authEndpoint.UPDATE_ME,
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["User"],
    }),

    // ─── GET /users ────────────────────────────────────────
    // Response: AuthUser[]
    getAllUsers: builder.query<AuthUser[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // ─── POST /users ───────────────────────────────────────
    // Response: AuthUser
    adminCreateUser: builder.mutation<AuthUser, any>({
      query: (params) => {
        const formData = new FormData();
        formData.append("username", params.username);
        formData.append("email", params.email);
        formData.append("password", params.password);
        formData.append("major", params.major);
        formData.append("role", params.role);
        if (params.images) {
          formData.append("images", params.images);
        }
        return {
          url: "/users",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["User"],
    }),

    // ─── PATCH /users/:id ──────────────────────────────────
    // Response: AuthUser
    adminUpdateUser: builder.mutation<AuthUser, { id: string; body: any }>({
      query: ({ id, body }) => {
        const formData = new FormData();
        if (body.username) formData.append("username", body.username);
        if (body.major) formData.append("major", body.major);
        if (body.password) formData.append("password", body.password);
        if (body.images) {
          formData.append("images", body.images);
        }
        return {
          url: `/users/${id}`,
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["User"],
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
  useGetMeQuery,
  useUpdateMeMutation,
  useGetAllUsersQuery,
  useAdminCreateUserMutation,
  useAdminUpdateUserMutation,
} = authApi;
