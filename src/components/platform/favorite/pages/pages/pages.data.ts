import { pages } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest } from "@/Utils/backendEndpoints/backend-requests";

// Topic interface
interface Topic {
  id: number;
  name: string;
}

// Page interface
export type PageItem = {
  id: string;
  name: string;
  slug: string;
  why: string;
  what: string;
  how: string;
  avatar: string | null;
  cover: string | null;
  category: string;
  followersCount: number;
  topic: Topic;
};

export async function getPageItems(): Promise<PageItem[]> {
  const { data } = await getRequest(pages.allPages);
  return data;
}
