/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Products } from "../types/productsTypes.data";
import { postRequest } from "@/Utils/backendEndpoints/backend-requests";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

interface FetchProductsParams {
  page: number;
  limit: number;
  topicId?: number | undefined;
  countryId?: number | undefined;
  cityId?: number | undefined;
  accessToken?: string | null;
  marketType?: string | undefined;
  verified?: string | undefined;
}

export const fetchProducts = async ({
  page,
  limit,
  topicId,
  countryId,
  cityId,
  accessToken,
  marketType,
  verified,
}: FetchProductsParams): Promise<Products[]> => {
  try {
    const topicIdParam = topicId ? `&topicId=${topicId}` : '';
    const countryIdParam = countryId ? `&countryId=${countryId}` : '';
    const cityIdParam = cityId ? `&cityId=${cityId}` : '';
    const marketTypeParam = marketType ? `&marketType=${marketType}` : '';
    // Add verified param if needed
    const verifiedParam = verified !=="all" ? `&verified=true` : '';

    const url = `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/community/products?page=${page}&limit=${limit}${topicIdParam}${countryIdParam}${cityIdParam}${marketTypeParam}${verifiedParam}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        'Access-Control-Allow-Origin': '*',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const postPageProduct = async (
  data: FormData,
  slug: string | string[] | undefined
) => {
  try {
    const response = await postRequest(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${slug}/products/create-product`,
      data
    );
    return await response.data;
  } catch (error : any) {
    ToastNot(error.response.data.message);
    console.error("Error fetching events:", error);
    throw error;
  }
};
