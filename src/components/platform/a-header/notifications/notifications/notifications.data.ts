import axios from "axios";

// notifications.data.ts
export interface Actor {
    id: string;
    fullName: string;
    username: string;
    avatar: string | null;
}

export interface Metadata {
    followerId?: string;
    postId?: string;
}

export interface NotificationItem {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    metadata: Metadata;
    type: 'followed_user' | 'reaction' | string;
    actor: Actor;
}

// export async function getNotificationItems(): Promise<NotificationItem[]> {
export function getNotificationItems() {
  const data = axios.get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/notifications?page=1&limit=10`).then((res) => res.data);

  return data;
}
