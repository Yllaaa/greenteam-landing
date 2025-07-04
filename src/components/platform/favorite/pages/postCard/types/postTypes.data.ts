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
  subTopic?: {
    [key: number]: string;
  };
  rerender: boolean;
  setPostId?: (value: string) => void;
  setPostMedia: (
    value: {
      id: string;
      mediaUrl: string;
      mediaType: string;
    }[]
  ) => void;
};

// Media interface for post attachments
interface Media {
  id: string;
  mediaUrl: string;
  mediaType: string;
}

// Author interface for post creators
interface Author {
  id: string;
  name: string;
  avatar: string | null;
  username: string;
}

// Post details interface
interface PostDetails {
  id: string;
  content: string;
  createdAt: string;
}

// Complete post item interface including all related data
interface PostItem {
  post: PostDetails;
  author: Author;
  media: Media[];
  commentCount: string;
  likeCount: string;
  dislikeCount: string;
  userReactionType: string | null;
  hasDoReaction: boolean;
}

type PostsData = PostItem[];

export type {
  Props,
  PostDetails,
  Author,
  PostItem,
  PostsData,
  Comment,
  CommentsAuthor,
};
