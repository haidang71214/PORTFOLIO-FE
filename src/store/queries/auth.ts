import { authEndpoint } from "@/constants/endpoints";
import {
  LoginGGResponse,
  LoginRequest,
  LoginResponse,
  Logout,
  RegisterRequestDto,
  RegisterResponseDto,
  resetPasswordInformation,
  sendEmailForgotPassword,
} from "@/types";
import { baseApi } from "../base";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // POST /auth/login
    login: builder.mutation<{ data: LoginResponse }, LoginRequest>({
      query: (params) => ({
        url: authEndpoint.LOGIN,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["User"],
    }),

    // POST /auth/logout
    logout: builder.mutation<{ data: Logout }, void>({
      query: () => ({
        url: authEndpoint.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // POST /auth/google-login (Google OAuth)
    googleLogin: builder.mutation<{ data: LoginGGResponse }, { tokenId: string }>({
      query: (params) => ({
        url: authEndpoint.GOOGLE_LOGIN,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["User"],
    }),

    // POST /auth/register
    register: builder.mutation<{ result: RegisterResponseDto }, RegisterRequestDto>({
      query: (params) => ({
        url: authEndpoint.REGISTER,
        method: "POST",
        body: params,
      }),
    }),

    // POST /auth/forgotPass
    forgotpass: builder.mutation<{ result: void }, sendEmailForgotPassword>({
      query: (params) => ({
        url: authEndpoint.FORGOT_PASSWORD,
        method: "POST",
        body: params,
      }),
    }),

    // POST /auth/reset-pass
    resetPassword: builder.mutation<{ result: void }, resetPasswordInformation>({
      query: (params) => ({
        url: authEndpoint.RESET_PASSWORD,
        method: "POST",
        body: params,
      }),
    }),

    // POST /auth/confirm-email
    confirmEmail: builder.mutation<
      { data: LoginResponse },
      { email: string; token: string }
    >({
      query: (params) => ({
        url: authEndpoint.CONFIRM_EMAIL,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["User"],
    }),

    // POST /auth/confirm-password-change
    confirmPasswordChange: builder.mutation<
      { message: string },
      { email: string; token: string }
    >({
      query: (params) => ({
        url: authEndpoint.CONFIRM_PASSWORD_CHANGE,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["User"],
    }),

    // POST /auth/change-password
    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (params) => ({
        url: authEndpoint.CHANGE_PASSWORD,
        method: "POST",
        body: params,
      }),
    }),

    // POST /auth/extend-token
    extendToken: builder.mutation<{ data: { accessToken: string } }, void>({
      query: () => ({
        url: authEndpoint.EXTEND_TOKEN,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
  useForgotpassMutation,
  useResetPasswordMutation,
  useConfirmEmailMutation,
  useConfirmPasswordChangeMutation,
  useChangePasswordMutation,
  useExtendTokenMutation,
} = authApi;
