//Topics types
type Subtopic = {
  id: number;
  name: string;
};

type Topic = {
  id: number;
  name: string;
  subtopics: Subtopic[];
};

type TopicsData = Topic[];
type SingleTopicsData = Topic;

interface Author {
  id: string;
  fullName: string;
  avatar: string | null;
  username: string;
}

//Comment types
type Comment = {
  id: string;
  publicationId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  author: Author;
};

export type { SingleTopicsData, TopicsData, Comment, Author, Topic, Subtopic };
