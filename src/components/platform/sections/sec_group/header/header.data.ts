"use client";

import { groups } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest } from "@/Utils/backendEndpoints/backend-requests";

export type GroupItem = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  cover: string;
  topicId: number;
  privacy: string;
  createdAt: string;
  updatedAt: string;
};

export function getSingleGroupItems(id: string): Promise<GroupItem> {
  const data = getRequest(groups.singleGroup(id)).then((res) => res.data);

  return data;
}


