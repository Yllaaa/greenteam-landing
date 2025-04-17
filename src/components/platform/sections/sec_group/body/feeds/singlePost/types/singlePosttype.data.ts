// Types for the post data structure

// Enum for user reaction types
enum ReactionType {
  LIKE = "like",
  DISLIKE = "dislike",
}

// Interface for Post data
interface Post {
  id: string;
  content: string;
  createdAt: string;
  groupId: string | null;
  mediaUrl: string[];
}

// Interface for Author data
interface Author {
  id: string;
  fullName: string;
  avatar: string | null;
  username: string;
}

// Interface for the complete Post with Author and metrics
export type PostWithDetails = {
  post: Post;
  author: Author;
  media:{
    id: string;
    mediaUrl: string;
    mediaType: string;
  }[],
  commentCount: string;
  likeCount: string;
  dislikeCount: string;
  userReactionType: ReactionType | null;
  hasDoReaction: boolean;
};
