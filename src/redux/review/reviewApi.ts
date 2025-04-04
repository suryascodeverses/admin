import { apiSlice } from "../api/apiSlice";
import { IDelReviewsRes } from "@/types/product-type";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // delete review product
    deleteReviews: builder.mutation<IDelReviewsRes, string>({
      query(id) {
        return {
          url: `/api/review/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ReviewProducts"],
    }),
  }),
});

export const {
  useDeleteReviewsMutation
} = authApi;
