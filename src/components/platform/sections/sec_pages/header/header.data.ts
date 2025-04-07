"use client";

import { pages } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest } from "@/Utils/backendEndpoints/backend-requests";

interface Topic {
  id: number;
  name: string;
}

export type PageItem = {
  id: string;
  name: string;
  description: string;
  slug: string;
  websiteUrl: string;
  why: string;
  what: string;
  how: string;
  avatar: string | null;
  cover: string | null;
  category: string;
  createdAt: string;
  followersCount: number;
  topic: Topic;
  isAdmin: boolean;
};

export function getSinglePageItems(id: string): Promise<PageItem> {
  const data = getRequest(pages.singlePage(id)).then((res) => res.data);

  return data;
}
