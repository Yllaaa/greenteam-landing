'use client';

import { groups } from '@/Utils/backendEndpoints/backend-endpoints';
import {
  deleteRequest,
  getRequest,
  postRequest,
} from '@/Utils/backendEndpoints/backend-requests';

// Topic interface
interface Topic {
  topicId: number;
  topicName: string;
}

// Member interface
interface Member {
  id: string;
  fullName: string;
  avatar: string | null;
}

// Group interface
export type GroupItem = {
  id: string;
  name: string;
  description: string;
  banner: string | null;
  topic: Topic;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  isUserMember: boolean;
  recentMembers: Member[];
  isAdmin: boolean;
};

export function getSingleGroupItems(id: string): Promise<GroupItem> {
  const data = getRequest(groups.singleGroup(id), 'en').then((res) => res.data);

  return data;
}
export function joinGroup(id: string): Promise<{
  message: string;
}> {
  const data = postRequest(groups.joinGroup(id), {}).then((res) => res.data);

  return data;
}
export function leaveGroup(id: string): Promise<{
  message: string;
}> {
  const data = deleteRequest(groups.leaveGroup(id)).then((res) => res.data);

  return data;
}
