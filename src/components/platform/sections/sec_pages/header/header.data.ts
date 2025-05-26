"use client";

import { pages } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest, postRequest } from "@/Utils/backendEndpoints/backend-requests";

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
  isFollowing: boolean;
   country: {
      id: number;
      name: string;
    };
    city: {
      id: number;
      nameEn: string;
    };
};

export function getSinglePageItems(id: string): Promise<PageItem> {
  const data = getRequest(pages.singlePage(id)).then((res) => res.data);

  return data;
}
export function postFllow(slug: string) {
  const data = postRequest(pages.follow(slug), {}).then((res) => res.data);

  return data;
}
