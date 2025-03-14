/* eslint-disable @typescript-eslint/no-explicit-any */
type CommentsAuthor = {
  id: string;
  fullName: string;
  username: string;
  avatar?: string | null;
};

type Comment = {
  id: string;
  publicationId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  author: CommentsAuthor;
};

type Props = {
  setDoItModal?: (value: boolean) => void;
  setCommentModal?: (value: boolean) => void;
  setPostCommentReply?: (value: Comment[]) => void;
  setPostComments?: any;
  setCommentsPage: (value: number) => void;
  commentsPage: number;
  mainTopic?:
    | {
        id: number;
        name: string;
        subtopics: {
          id: number;
          name: string;
        }[];
      }
    | any;
  subTopic: {
    [key: number]: string;
  };
  rerender: boolean;
  setPostId?: (value: string) => void;
};

interface Post {
  id: string;
  content: string;
  createdAt: string;
  mediaUrl: string[] | null;
}

interface Author {
  id: string;
  fullName: string;
  avatar: string | null;
  username: string;
}

interface PostItem {
  post: Post;
  author: Author;
  commentCount: string;
  likeCount: string;
  dislikeCount: string;
  userReactionType: string | null;
  hasDoReaction: boolean;
}

type PostsData = PostItem[];

export type {
  Props,
  Post,
  Author,
  PostItem,
  PostsData,
  Comment,
  CommentsAuthor,
};
