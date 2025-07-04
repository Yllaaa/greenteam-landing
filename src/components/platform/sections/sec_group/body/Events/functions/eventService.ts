import axios from "axios";
import { Event } from "../types/eventTypes.data";

interface FetchEventsParams {
  page: number;
  limit: number;
  groupId: string | string[] | undefined;
  accessToken?: string | null;
}

export const fetchEvents = async ({
  page,
  limit,
  groupId,
  accessToken,
}: FetchEventsParams): Promise<Event[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/groups/${groupId}/events?page=${page}&limit=${limit}`;

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
