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

export type { Creator, Post, Posts };
