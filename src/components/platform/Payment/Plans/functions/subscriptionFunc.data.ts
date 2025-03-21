"use client";
import axios from "axios";
import { SubscriptionTier } from "../types/subscriptionTypes.data";
import { getToken } from "@/Utils/userToken/LocalToken";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1`;
const token = getToken();
const accessToken = token ? token.accessToken : "";
// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});

// Subscription service
export const subscriptionService = {
  getSubscriptionTiers: async (): Promise<SubscriptionTier[]> => {
    try {
      const response = await apiClient.get<SubscriptionTier[]>(
        "/subscriptions/tiers"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription tiers:", error);
      throw error;
    }
  },
};
