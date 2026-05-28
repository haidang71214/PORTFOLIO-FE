import { templatesEndpoint } from "@/constants/endpoints";
import { GetAllTemplatesResponse, ThemeTemplate } from "@/types";
import { baseApi } from "../base";

export const templatesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // ─── GET /templates ───────────────────────────────────────────────────
    // Public — lấy danh sách tất cả mẫu portfolio (theme templates)
    getAllTemplates: builder.query<GetAllTemplatesResponse, void>({
      query: () => ({
        url: templatesEndpoint.GET_ALL,
        method: "GET",
      }),
      providesTags: ["Templates"],
    }),

    // ─── GET /templates/:id ───────────────────────────────────────────────
    // Lấy chi tiết 1 template
    getTemplate: builder.query<ThemeTemplate, string>({
      query: (id) => ({
        url: templatesEndpoint.GET_ONE(id),
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Templates", id }],
    }),

    // ─── POST /templates ──────────────────────────────────────────────────
    // Admin — tạo template mới (multipart/form-data)
    adminCreateTemplate: builder.mutation<ThemeTemplate, any>({
      query: (params) => {
        const formData = new FormData();
        formData.append("name", params.name);
        formData.append("slug", params.slug);
        if (params.description) formData.append("description", params.description);
        formData.append("targetMajor", params.targetMajor);
        if (params.price !== undefined) formData.append("price", String(params.price));
        if (params.stockLimit !== undefined && params.stockLimit !== null) {
          formData.append("stockLimit", String(params.stockLimit));
        }
        if (params.defaultConfig) formData.append("defaultConfig", params.defaultConfig);
        if (params.isActive !== undefined) formData.append("isActive", String(params.isActive));
        
        if (params.images && params.images.length > 0) {
          for (let i = 0; i < params.images.length; i++) {
            formData.append("images", params.images[i]);
          }
        }
        return {
          url: templatesEndpoint.GET_ALL,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Templates"],
    }),

    // ─── PATCH /templates/:id ─────────────────────────────────────────────
    // Admin — cập nhật thông tin template (multipart/form-data)
    adminUpdateTemplate: builder.mutation<ThemeTemplate, { id: string; body: any }>({
      query: ({ id, body }) => {
        const formData = new FormData();
        if (body.name !== undefined) formData.append("name", body.name);
        if (body.slug !== undefined) formData.append("slug", body.slug);
        if (body.description !== undefined) formData.append("description", body.description || "");
        if (body.targetMajor !== undefined) formData.append("targetMajor", body.targetMajor);
        if (body.price !== undefined) formData.append("price", String(body.price));
        if (body.stockLimit !== undefined) {
          formData.append("stockLimit", body.stockLimit !== null ? String(body.stockLimit) : "");
        }
        if (body.defaultConfig !== undefined) formData.append("defaultConfig", body.defaultConfig || "");
        if (body.isActive !== undefined) formData.append("isActive", String(body.isActive));
        
        if (body.images && body.images.length > 0) {
          for (let i = 0; i < body.images.length; i++) {
            formData.append("images", body.images[i]);
          }
        }
        return {
          url: templatesEndpoint.GET_ONE(id),
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (_result, _error, { id }) => ["Templates", { type: "Templates", id }],
    }),

    // ─── DELETE /templates/:id ────────────────────────────────────────────
    // Admin — xóa template
    adminDeleteTemplate: builder.mutation<any, string>({
      query: (id) => ({
        url: templatesEndpoint.GET_ONE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Templates"],
    }),

    // ─── POST /templates/admin/grant ──────────────────────────────────────
    // Admin — cấp template cho user mà không cần mua
    adminGrantTemplate: builder.mutation<any, { email: string; themeId: string; expiresAt?: string | null }>({
      query: (body) => ({
        url: templatesEndpoint.ADMIN_GRANT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Templates"],
    }),

    // ─── GET /templates/me/owned ──────────────────────────────────────────
    // User — lấy danh sách template đang sở hữu
    getOwnedTemplates: builder.query<(ThemeTemplate & { purchased_at: string; expires_at: string | null })[], void>({
      query: () => ({
        url: templatesEndpoint.GET_OWNED,
        method: "GET",
      }),
      providesTags: ["Templates"],
    }),

  }),
});

export const {
  useGetAllTemplatesQuery,
  useGetTemplateQuery,
  useAdminCreateTemplateMutation,
  useAdminUpdateTemplateMutation,
  useAdminDeleteTemplateMutation,
  useAdminGrantTemplateMutation,
  useGetOwnedTemplatesQuery,
} = templatesApi;

