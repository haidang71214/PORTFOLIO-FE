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

  }),
});

export const {
  useGetAllTemplatesQuery,
  useGetTemplateQuery,
} = templatesApi;
