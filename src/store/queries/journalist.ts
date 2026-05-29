import { journalistEndpoint } from "@/constants/endpoints";
import {
  GetArticlesResponse,
  GetArticleDetailResponse,
  MutationArticleResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
  AdminCreateArticleRequest,
  AdminUpdateArticleRequest,
} from "@/types";
import { baseApi } from "../base";

// ── Helper: build FormData từ article request fields ──────────────────────────
function buildArticleFormData(params: Record<string, any>): FormData {
  const fd = new FormData();
  if (params.title)         fd.append("title", params.title);
  if (params.summary)       fd.append("summary", params.summary);
  if (params.contentUrl)    fd.append("contentUrl", params.contentUrl);
  if (params.publisherName) fd.append("publisherName", params.publisherName);
  if (params.category)      fd.append("category", params.category);
  if (params.publishedAt)   fd.append("publishedAt", params.publishedAt);
  if (params.image)         fd.append("image", params.image);
  if (params.tags) {
    // Backend expects tags as JSON array in form-data
    params.tags.forEach((tag: string) => fd.append("tags", tag));
  }
  return fd;
}

// ── User APIs ─────────────────────────────────────────────────────────────────
export const journalistApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // ────────────────────────────────────────────────────────────────────
    // QUERIES (Public)
    // ────────────────────────────────────────────────────────────────────

    // GET /journalist/articles/user/:userId — Public
    getArticles: builder.query<GetArticlesResponse, string>({
      query: (userId) => ({ url: journalistEndpoint.GET_ARTICLES(userId), method: "GET" }),
      providesTags: (_r, _e, userId) => [{ type: "Articles", id: userId }],
    }),

    // GET /journalist/articles/:id — Public
    getArticleDetail: builder.query<GetArticleDetailResponse, string>({
      query: (id) => ({ url: journalistEndpoint.GET_ARTICLE_DETAIL(id), method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Articles", id }],
    }),

    // ────────────────────────────────────────────────────────────────────
    // MUTATIONS (User — JWT)
    // ────────────────────────────────────────────────────────────────────

    // POST /journalist/articles — User (multipart/form-data)
    createArticle: builder.mutation<MutationArticleResponse, CreateArticleRequest>({
      query: (params) => {
        const fd = buildArticleFormData(params);
        return { url: journalistEndpoint.CREATE_ARTICLE, method: "POST", body: fd, formData: true };
      },
      invalidatesTags: [{ type: "Articles" }],
    }),

    // PATCH /journalist/articles/:id — User (multipart/form-data)
    updateArticle: builder.mutation<MutationArticleResponse, UpdateArticleRequest>({
      query: ({ id, ...rest }) => {
        const fd = buildArticleFormData(rest);
        return { url: journalistEndpoint.UPDATE_ARTICLE(id), method: "PATCH", body: fd, formData: true };
      },
      invalidatesTags: [{ type: "Articles" }],
    }),

    // DELETE /journalist/articles/:id — User
    deleteArticle: builder.mutation<MutationArticleResponse, string>({
      query: (id) => ({ url: journalistEndpoint.DELETE_ARTICLE(id), method: "DELETE" }),
      invalidatesTags: [{ type: "Articles" }],
    }),
  }),
});

// ── Admin APIs — export riêng, không mix với user ─────────────────────────────
export const journalistAdminApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // POST /journalist/manage/articles/:userId — Admin
    adminCreateArticle: builder.mutation<MutationArticleResponse, AdminCreateArticleRequest>({
      query: ({ userId, ...rest }) => {
        const fd = buildArticleFormData(rest);
        return { url: journalistEndpoint.ADMIN_CREATE_ARTICLE(userId), method: "POST", body: fd, formData: true };
      },
      invalidatesTags: [{ type: "Articles" }],
    }),

    // PATCH /journalist/manage/articles/:id — Admin
    adminUpdateArticle: builder.mutation<MutationArticleResponse, AdminUpdateArticleRequest>({
      query: ({ id, ...rest }) => {
        const fd = buildArticleFormData(rest);
        return { url: journalistEndpoint.ADMIN_UPDATE_ARTICLE(id), method: "PATCH", body: fd, formData: true };
      },
      invalidatesTags: [{ type: "Articles" }],
    }),

    // DELETE /journalist/manage/articles/:id — Admin
    adminDeleteArticle: builder.mutation<MutationArticleResponse, string>({
      query: (id) => ({ url: journalistEndpoint.ADMIN_DELETE_ARTICLE(id), method: "DELETE" }),
      invalidatesTags: [{ type: "Articles" }],
    }),
  }),
});

// ── User hooks ──────────────────────────────────────────────────────────────
export const {
  useGetArticlesQuery,
  useGetArticleDetailQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = journalistApi;

// ── Admin hooks — riêng biệt ────────────────────────────────────────────────
export const {
  useAdminCreateArticleMutation,
  useAdminUpdateArticleMutation,
  useAdminDeleteArticleMutation,
} = journalistAdminApi;
