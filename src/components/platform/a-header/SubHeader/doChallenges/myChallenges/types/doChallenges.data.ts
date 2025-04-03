/* eslint-disable @typescript-eslint/no-explicit-any */
import { Comment } from "@/components/platform/posts/feeds/TYPES/FeedTypes";

// Interface for the creator object
interface Creator {
  id: string;
  name: string;
  avatar: string | null;
  username: string;
}

// Interface for the post object
interface Post {
  id: string;
  content: string;
  createdAt: string;
  mediaUrl: string | null;
  creator: Creator;
}

// Type definition for the entire array of posts
type Posts = Post[];

type DoMainProps = {
  setCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  postComments: Comment[];
  setPostComments: React.Dispatch<React.SetStateAction<any>>;
  postId: string;
  setCommentPage: React.Dispatch<React.SetStateAction<number>>;
  commentPage: number;
  setRepliesPage: React.Dispatch<React.SetStateAction<number>>;
  repliesPage: number;
  setRerender: React.Dispatch<React.SetStateAction<boolean>>;
  rerender: boolean;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
  commentModal: boolean;
};

export type { Creator, Post, Posts, DoMainProps };
