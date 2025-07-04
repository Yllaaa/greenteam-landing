/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Post } from '@/types'
type ReactionType = "like" | "dislike" | "do" | "sign" | null;

type Props = {
  post:Post | any;
  media: {
    id: string;
    mediaUrl: string;
    mediaType: string;
  }[];
  content: string;
  setDoItModal?: (value: boolean) => void;
  setCommentModal?: ((value: boolean) => void) | any;
  setPostComments?: any;
  likes: string;
  comments: string;
  dislikes: string;
  postId: string;
  userReactionType: string | null;
  hasDoReaction: boolean;
  commentPage: number;
  setCommentPage: (value: number) => void;
  rerender: boolean;
  setPostId?: ((value: string) => void) | any;
  setPostMedia: (
    value: {
      id: string;
      mediaUrl: string;
      mediaType: string;
    }[]
  ) => void;
};

export type { ReactionType, Props };
