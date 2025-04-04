import { apiSlice } from "../api/apiSlice";
import { IAddProduct,IReviewProductRes, ProductResponse } from "@/types/product-type";

interface IProductResponse {
  success: boolean;
  status: string;
  message: string;
  data: any;
}

interface IProductEditResponse {
  data: IAddProduct;
  message: string;
}

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // getUserOrders
    getAllProducts: builder.query<ProductResponse, void>({
      query: () => `/api/product/all`,
      providesTags: ["AllProducts"],
      keepUnusedDataFor: 600,
    }),
    // add product
    addProduct: builder.mutation<IProductResponse, IAddProduct>({
      query(data: IAddProduct) {
        return {
          url: `/api/product/add`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AllProducts"],
    }),
    // edit product
    editProduct: builder.mutation<
      IProductEditResponse,
      { id: string; data: Partial<IAddProduct> }
    >({
      query({ id, data }) {
        return {
          url: `/api/product/edit-product/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["AllProducts"],
    }),
    // get single product
    getProduct: builder.query<IAddProduct, string>({
      query: (id) => `/api/product/single-product/${id}`,
    }),
    // get single product
    getReviewProducts: builder.query<IReviewProductRes, void>({
      query: () => `/api/product/review-product`,
      providesTags: ["ReviewProducts"]
    }),
    // get single product
    getStockOutProducts: builder.query<IReviewProductRes, void>({
      query: () => `/api/product/stock-out`,
      providesTags: ["StockOutProducts"]
    }),
     // delete category
     deleteProduct: builder.mutation<{message:string}, string>({
      query(id: string) {
        return {
          url: `/api/product/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AllProducts"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useEditProductMutation,
  useGetProductQuery,
  useGetReviewProductsQuery,
  useGetStockOutProductsQuery,
  useDeleteProductMutation,
} = authApi;
