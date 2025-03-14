/* eslint-disable @typescript-eslint/no-explicit-any */
type ReactionType = "like" | "dislike" | "do" | null;

type Props = {
  media: string[] | null;
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
};

export type { ReactionType, Props };
