import { createSlice } from "@reduxjs/toolkit";
import { Users } from "@/types";
import webStorageClient from "@/utils/webStorageClient";
import { authApi } from "../queries/auth";

interface AuthSlickInterface {
  isAuthenticatedAccount: boolean;
  user?: Users;
  isHydrated: boolean;
}

const initialState: AuthSlickInterface = {
  isAuthenticatedAccount: false,
  user: undefined,
  isHydrated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginFromToken: (state, action) => {
      state.user = action.payload;
      state.isAuthenticatedAccount = true;
    },
    clearLoginToken: (state) => {
      state.user = undefined;
      state.isAuthenticatedAccount = false;
      webStorageClient.logout();
    },
    setHydrated: (state, action) => {
      state.isHydrated = action.payload ?? true;
    },
  },
  extraReducers: (builder) => {
    // ─── Login ────────────────────────────────────────────
    // Response shape: { response: { token, refreshToken, user } }
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { token, refreshToken, user } = action.payload.response;

        if (token) {
          webStorageClient.setToken(token);
          // refreshToken được server set vào HttpOnly cookie tự động.
          // Nếu server cũng trả về trong body (fallback) thì lưu thêm vào storage:
          if (refreshToken) webStorageClient.setRefreshToken(refreshToken);
          webStorageClient.setUser(user);
          state.user = user;
          state.isAuthenticatedAccount = true;
        }
      },
    );

    // ─── Logout ───────────────────────────────────────────
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = undefined;
        state.isAuthenticatedAccount = false;
        webStorageClient.logout();
      },
    );

    // ─── Extend Token (Refresh) ────────────────────────────
    // Response shape: { accessToken: string }
    builder.addMatcher(
      authApi.endpoints.extendToken.matchFulfilled,
      (_state, action) => {
        const { accessToken } = action.payload;
        if (accessToken) {
          webStorageClient.setToken(accessToken);
        }
      },
    );

    // ─── Get Me ───────────────────────────────────────────
    // GET /auth/me → AuthUser (flat). Tự set cờ auth + user khi token còn hợp lệ.
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        state.isAuthenticatedAccount = true;
        webStorageClient.setUser(action.payload);
      },
    );

    // Nếu /auth/me trả về lỗi (token hết hạn / không hợp lệ) → clear state
    builder.addMatcher(
      authApi.endpoints.getMe.matchRejected,
      (state) => {
        state.user = undefined;
        state.isAuthenticatedAccount = false;
        webStorageClient.logout();
      },
    );
  },
});

export const { loginFromToken, clearLoginToken, setHydrated } = authSlice.actions;

export default authSlice.reducer;
