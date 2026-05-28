import { profileEndpoint } from "@/constants/endpoints";
import {
  GetProfileResponse,
  UpdatePortfolioRequest,
  UpdatePortfolioResponse,
  ChangeThemeRequest,
  ChangeThemeResponse,
  AdminChangeThemeRequest,
  GetSkillsResponse,
  UpsertSkillRequest,
  UpsertSkillResponse,
  AdminUpsertSkillRequest,
  GetCertificatesResponse,
  GetCertDetailResponse,
  UpsertCertRequest,
  AdminUpsertCertRequest,
  UpsertCertResponse,
  GetExperiencesResponse,
  GetExpDetailResponse,
  UpsertExpRequest,
  AdminUpsertExpRequest,
  UpsertExpResponse,
} from "@/types";
import { baseApi } from "../base";

export const profileApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // ────────────────────────────────────────────────────────────────────
    // PROFILE
    // ────────────────────────────────────────────────────────────────────

    // GET /profile/:id — Public
    getProfile: builder.query<GetProfileResponse, string>({
      query: (id) => ({ url: profileEndpoint.GET_PROFILE(id), method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Profile", id }],
    }),

    // PATCH /profile/me/portfolio — User
    updateMyPortfolio: builder.mutation<UpdatePortfolioResponse, UpdatePortfolioRequest>({
      query: (body) => ({ url: profileEndpoint.UPDATE_MY_PORTFOLIO, method: "PATCH", body }),
      invalidatesTags: [{ type: "Profile" }],
    }),

    // ────────────────────────────────────────────────────────────────────
    // THEME
    // ────────────────────────────────────────────────────────────────────

    // PATCH /profile/me/theme — User
    changeMyTheme: builder.mutation<ChangeThemeResponse, ChangeThemeRequest>({
      query: (body) => ({ url: profileEndpoint.CHANGE_MY_THEME, method: "PATCH", body }),
      invalidatesTags: [{ type: "Profile" }],
    }),



    // ────────────────────────────────────────────────────────────────────
    // SKILLS
    // ────────────────────────────────────────────────────────────────────

    // GET /profile/skill/:userId — Public
    getSkills: builder.query<GetSkillsResponse, string>({
      query: (userId) => ({ url: profileEndpoint.GET_SKILLS(userId), method: "GET" }),
      providesTags: (_r, _e, userId) => [{ type: "Skills", id: userId }],
    }),

    // POST /profile/me/skills — User (tạo mới, không cần id)
    createMySkill: builder.mutation<UpsertSkillResponse, UpsertSkillRequest>({
      query: (body) => ({ url: profileEndpoint.CREATE_MY_SKILL, method: "POST", body }),
      invalidatesTags: [{ type: "Skills" }],
    }),

    // PATCH /profile/me/skills/:id — User (cập nhật, phải có skillId thật)
    updateMySkill: builder.mutation<UpsertSkillResponse, { skillId: string; body: UpsertSkillRequest }>({
      query: ({ skillId, body }) => ({
        url: profileEndpoint.UPDATE_MY_SKILL(skillId),
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Skills" }],
    }),

    // DELETE /profile/skill/:id — User
    deleteSkill: builder.mutation<UpsertSkillResponse, string>({
      query: (id) => ({ url: profileEndpoint.DELETE_SKILL(id), method: "DELETE" }),
      invalidatesTags: [{ type: "Skills" }],
    }),

    // ────────────────────────────────────────────────────────────────────
    // CERTIFICATES
    // ────────────────────────────────────────────────────────────────────

    // GET /profile/certificate/:userId — Public
    getCertificates: builder.query<GetCertificatesResponse, string>({
      query: (userId) => ({ url: profileEndpoint.GET_CERTIFICATES(userId), method: "GET" }),
      providesTags: (_r, _e, userId) => [{ type: "Certificates", id: userId }],
    }),

    // GET /profile/certificate/detail/:id — Public
    getCertDetail: builder.query<GetCertDetailResponse, string>({
      query: (id) => ({ url: profileEndpoint.GET_CERT_DETAIL(id), method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Certificates", id }],
    }),

    // POST /profile/certificate — User (multipart/form-data)
    createCert: builder.mutation<UpsertCertResponse, UpsertCertRequest>({
      query: (params) => {
        const fd = new FormData();
        fd.append("name", params.name);
        if (params.organization)    fd.append("organization", params.organization);
        if (params.issue_date)      fd.append("issue_date", params.issue_date);
        if (params.expiration_date) fd.append("expiration_date", params.expiration_date);
        if (params.credential_id)   fd.append("credential_id", params.credential_id);
        if (params.credential_url)  fd.append("credential_url", params.credential_url);
        if (params.image)           fd.append("image", params.image);
        return { url: profileEndpoint.CREATE_CERT, method: "POST", body: fd, formData: true };
      },
      invalidatesTags: [{ type: "Certificates" }],
    }),

    // PATCH /profile/certificate — User (multipart/form-data, có id để update)
    updateCert: builder.mutation<UpsertCertResponse, UpsertCertRequest>({
      query: (params) => {
        const fd = new FormData();
        if (params.id)              fd.append("id", params.id);
        fd.append("name", params.name);
        if (params.organization)    fd.append("organization", params.organization);
        if (params.issue_date)      fd.append("issue_date", params.issue_date);
        if (params.expiration_date) fd.append("expiration_date", params.expiration_date);
        if (params.credential_id)   fd.append("credential_id", params.credential_id);
        if (params.credential_url)  fd.append("credential_url", params.credential_url);
        if (params.image)           fd.append("image", params.image);
        return { url: profileEndpoint.UPDATE_CERT, method: "PATCH", body: fd, formData: true };
      },
      invalidatesTags: [{ type: "Certificates" }],
    }),

    // DELETE /profile/certificate/:id — User
    deleteCert: builder.mutation<UpsertCertResponse, string>({
      query: (id) => ({ url: profileEndpoint.DELETE_CERT(id), method: "DELETE" }),
      invalidatesTags: [{ type: "Certificates" }],
    }),

    // ────────────────────────────────────────────────────────────────────
    // EXPERIENCE
    // ────────────────────────────────────────────────────────────────────

    // GET /profile/experience/:userId — Public
    getExperiences: builder.query<GetExperiencesResponse, string>({
      query: (userId) => ({ url: profileEndpoint.GET_EXPERIENCES(userId), method: "GET" }),
      providesTags: (_r, _e, userId) => [{ type: "Experiences", id: userId }],
    }),

    // GET /profile/experience/detail/:id — Public
    getExpDetail: builder.query<GetExpDetailResponse, string>({
      query: (id) => ({ url: profileEndpoint.GET_EXP_DETAIL(id), method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Experiences", id }],
    }),

    // POST /profile/experience — User
    createExp: builder.mutation<UpsertExpResponse, UpsertExpRequest>({
      query: (body) => ({ url: profileEndpoint.CREATE_EXP, method: "POST", body }),
      invalidatesTags: [{ type: "Experiences" }],
    }),

    // PATCH /profile/experience — User (update — body chứa id)
    updateExp: builder.mutation<UpsertExpResponse, UpsertExpRequest>({
      query: (body) => ({ url: profileEndpoint.UPDATE_EXP, method: "PATCH", body }),
      invalidatesTags: [{ type: "Experiences" }],
    }),

    // DELETE /profile/experience/:id — User
    deleteExp: builder.mutation<UpsertExpResponse, string>({
      query: (id) => ({ url: profileEndpoint.DELETE_EXP(id), method: "DELETE" }),
      invalidatesTags: [{ type: "Experiences" }],
    }),

    // GET /profile — Admin (lấy tất cả danh sách portfolio)
    getAllPortfolios: builder.query<any[], void>({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

  }),
});

// ── Admin APIs — export riêng, không mix với user ──────────────────────────
export const profileAdminApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // PATCH /profile/admin/theme/:userId — Admin
    adminChangeTheme: builder.mutation<ChangeThemeResponse, AdminChangeThemeRequest>({
      query: ({ userId, theme_id }) => ({
        url: profileEndpoint.ADMIN_CHANGE_THEME(userId),
        method: "PATCH",
        body: { theme_id },
      }),
      invalidatesTags: (_r, _e, { userId }) => [{ type: "Profile", id: userId }],
    }),

    // PATCH /profile/manage/skills?id=&userId= — Admin
    adminUpsertSkill: builder.mutation<UpsertSkillResponse, AdminUpsertSkillRequest>({
      query: ({ id, userId, ...body }) => ({
        url: `${profileEndpoint.ADMIN_UPSERT_SKILL}?id=${id}&userId=${userId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { userId }) => [{ type: "Skills", id: userId }],
    }),

    // POST /profile/manage/certificate/:userId — Admin
    adminCreateCert: builder.mutation<UpsertCertResponse, AdminUpsertCertRequest>({
      query: ({ userId, ...params }) => {
        const fd = new FormData();
        fd.append("name", params.name);
        if (params.organization)    fd.append("organization", params.organization);
        if (params.issue_date)      fd.append("issue_date", params.issue_date);
        if (params.expiration_date) fd.append("expiration_date", params.expiration_date);
        if (params.credential_id)   fd.append("credential_id", params.credential_id);
        if (params.credential_url)  fd.append("credential_url", params.credential_url);
        if (params.image)           fd.append("image", params.image);
        return { url: profileEndpoint.ADMIN_CREATE_CERT(userId), method: "POST", body: fd, formData: true };
      },
      invalidatesTags: [{ type: "Certificates" }],
    }),

    // PATCH /profile/manage/certificate/:userId — Admin
    adminUpdateCert: builder.mutation<UpsertCertResponse, AdminUpsertCertRequest>({
      query: ({ userId, ...params }) => {
        const fd = new FormData();
        if (params.id)              fd.append("id", params.id);
        fd.append("name", params.name);
        if (params.organization)    fd.append("organization", params.organization);
        if (params.issue_date)      fd.append("issue_date", params.issue_date);
        if (params.expiration_date) fd.append("expiration_date", params.expiration_date);
        if (params.credential_id)   fd.append("credential_id", params.credential_id);
        if (params.credential_url)  fd.append("credential_url", params.credential_url);
        if (params.image)           fd.append("image", params.image);
        return { url: profileEndpoint.ADMIN_UPDATE_CERT(userId), method: "PATCH", body: fd, formData: true };
      },
      invalidatesTags: [{ type: "Certificates" }],
    }),

    // DELETE /profile/manage/certificate/:id — Admin
    adminDeleteCert: builder.mutation<UpsertCertResponse, string>({
      query: (id) => ({ url: profileEndpoint.ADMIN_DELETE_CERT(id), method: "DELETE" }),
      invalidatesTags: [{ type: "Certificates" }],
    }),

    // POST /profile/manage/experience/:userId — Admin
    adminCreateExp: builder.mutation<UpsertExpResponse, AdminUpsertExpRequest>({
      query: ({ userId, ...body }) => ({
        url: profileEndpoint.ADMIN_CREATE_EXP(userId),
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Experiences" }],
    }),

    // PATCH /profile/experience/:userId — Admin
    adminUpdateExp: builder.mutation<UpsertExpResponse, AdminUpsertExpRequest>({
      query: ({ userId, ...body }) => ({
        url: profileEndpoint.ADMIN_UPDATE_EXP(userId),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { userId }) => [{ type: "Experiences", id: userId }],
    }),

    // DELETE /profile/manager/experience/:id — Admin
    adminDeleteExp: builder.mutation<UpsertExpResponse, string>({
      query: (id) => ({ url: profileEndpoint.ADMIN_DELETE_EXP(id), method: "DELETE" }),
      invalidatesTags: [{ type: "Experiences" }],
    }),

  }),
});

// ── User hooks ──────────────────────────────────────────────────────────────
// ── User hooks ──────────────────────────────────────────────────────────────
export const {
  // Profile
  useGetProfileQuery,
  useUpdateMyPortfolioMutation,
  useGetAllPortfoliosQuery,
  // Theme (user)
  useChangeMyThemeMutation,
  // Skills (user)
  useGetSkillsQuery,
  useCreateMySkillMutation,
  useUpdateMySkillMutation,
  useDeleteSkillMutation,
  // Certificates (user)
  useGetCertificatesQuery,
  useGetCertDetailQuery,
  useCreateCertMutation,
  useUpdateCertMutation,
  useDeleteCertMutation,
  // Experience (user)
  useGetExperiencesQuery,
  useGetExpDetailQuery,
  useCreateExpMutation,
  useUpdateExpMutation,
  useDeleteExpMutation,
} = profileApi;

// ── Admin hooks — riêng biệt ────────────────────────────────────────────────
export const {
  useAdminChangeThemeMutation,
  useAdminUpsertSkillMutation,
  useAdminCreateCertMutation,
  useAdminUpdateCertMutation,
  useAdminDeleteCertMutation,
  useAdminCreateExpMutation,
  useAdminUpdateExpMutation,
  useAdminDeleteExpMutation,
} = profileAdminApi;

