'use client';
import { groups } from '@/Utils/backendEndpoints/backend-endpoints';
import { getRequest } from '@/Utils/backendEndpoints/backend-requests';

// export type GroupItem = {
//   cover?: string;
//   name: string;
//   description: string;
//   members: number;
// };

// Define Privacy type as an enum of possible values
export type Privacy = 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';

// Define the Group interface
export interface Group {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  cover: string | null;
  topicId: number;
  privacy: Privacy;
  createdAt: string;
  updatedAt: string;
}

// Define a type for group creation request payload
export interface CreateGroupRequest {
  name: string;
  description: string;
  cover?: string | null;
  topicId: number;
  privacy: Privacy;
}

// Define a type for updating a group
export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  cover?: string | null;
  topicId?: number;
  privacy?: Privacy;
}

// Define a type for group response arrays
export type GroupsResponse = Group[];

// Define a type for a single group response
export type GroupResponse = Group;

// Topic interface representing the topic of a community group
interface Topic {
  topicId: number;
  topicName: string;
}

// Main Community Group interface
export type CommunityGroup = {
  id: string;
  name: string;
  description: string;
  banner: string | null;
  topic: Topic;
  memberCount: number;
  isUserMember: boolean;
};

// Optional: Type for an array of community groups
export type CommunityGroups = CommunityGroup[];

export function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

export function getGroupItems(locale: string): Promise<GroupsResponse> {
  const data = getRequest(groups.allGroups, locale).then((res) => res.data);

  return data;
}
