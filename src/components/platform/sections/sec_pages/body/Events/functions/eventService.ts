
import axios from "axios";
import { Event, EventCategory } from "../types/eventTypes.data";

interface FetchEventsParams {
  page: number;
  limit: number;
  category?: EventCategory;
  accessToken?: string | null;
  slug: string;
}

export const fetchEvents = async ({
  page,
  limit,
  category,
  accessToken,
  slug
}: FetchEventsParams): Promise<Event[]> => {
  try {
    const categoryParam = category ? `&category=${category}` : "";
    const url = `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${slug}/events?page=${page}&limit=${limit}${categoryParam}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Access-Control-Allow-Origin": "*",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
