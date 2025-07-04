import axios from "axios";

interface Actor {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
}

interface FollowedPageMetadata {
  pageName: string;
  pageSlug: string;
  followerId: string;
}

interface ReactionMetadata {
  postId: string;
  reactionType: 'like' | 'dislike' | string; // Assuming there might be other reaction types
}

interface CommentMetadata {
  commentId: string;
  publicationId: string;
  publicationType: 'post' | string; // Assuming there might be other publication types
}

type NotificationMetadata =
  | FollowedPageMetadata
  | ReactionMetadata
  | CommentMetadata;

interface BaseNotification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata: NotificationMetadata;
  type: 'followed_page' | 'reaction' | 'comment' | string; // Assuming there might be other types
  actor: Actor;
}

// You might want to create discriminated unions for specific notification types
type FollowedPageNotification = BaseNotification & {
  type: 'followed_page';
  metadata: FollowedPageMetadata;
};

type ReactionNotification = BaseNotification & {
  type: 'reaction';
  metadata: ReactionMetadata;
};

type CommentNotification = BaseNotification & {
  type: 'comment';
  metadata: CommentMetadata;
};

export type NotificationItem =
  | FollowedPageNotification
  | ReactionNotification
  | CommentNotification;

// For the array of notifications

// export interface NotificationItem {
//     id: string;
//     message: string;
//     isRead: boolean;
//     createdAt: string;
//     metadata: Metadata;
//     type: 'followed_user' | 'reaction' | string;
//     actor: Actor;
// }

// export async function getNotificationItems(): Promise<NotificationItem[]> {
export function getNotificationItems() {
  const data = axios.get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/notifications?page=1&limit=10`).then((res) => res.data);

  return data;
}
