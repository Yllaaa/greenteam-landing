/** @format */

export interface User {
	id: string;
	username: string;
	email: string;
	avatar?: string;
	bio?: string;
	followersCount: number;
	followingCount: number;
	createdAt: string;
}

type AuthorType = 'user' | 'page' | 'group_member';

interface Author {
	id: string | null;
	name: string | null;
	avatar: string | null;
	username: string | null;
	type: AuthorType;
}

// Location type
interface Location {
	countryName: string | null;
	countryIso: string | null;
	cityName: string | null;
}

// Media types
type MediaType = 'image' | 'video'; // Add more types if needed

interface Media {
	id: string;
	mediaUrl: string;
	mediaType: MediaType;
}

// Post type
interface PostItem {
	id: string;
	content: string;
	createdAt: string; // ISO 8601 date string
}

// Reaction type
type UserReactionType = 'like' | 'dislike' | null;

// Main feed item type
export interface Post {
	post: PostItem;
	author: Author;
	location: Location;
	media: Media[];
	commentCount: string; // Note: These are strings in your data
	likeCount: string;
	dislikeCount: string;
	userReactionType: UserReactionType;
	hasDoReaction: boolean;
	isAuthor: boolean;
}

export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	totalPages: number;
	hasMore: boolean;
}

export interface Subtopic {
	id: number;
	name: string;
}

export interface Topic {
	id: number;
	name: string;
	subtopics: Subtopic[];
}

export interface TopicWithCount extends Topic {
	postsCount?: number;
}

export interface SubtopicWithCount extends Subtopic {
	postsCount?: number;
	topicId: number;
}

// Helper type for topic/subtopic selection
export interface TopicSelection {
	topicId: number;
	subtopicId?: number;
}

// For API responses
export interface TopicsResponse {
	topics: Topic[];
	lastUpdated: string;
}

//comments

interface commentAuthor {
	id: string;
	fullName: string;
	username: string;
	avatar: string | null;
}

export interface Comment {
	id: string;
	publicationId: string;
	content: string;
	mediaUrl: string | null;
	createdAt: string;
	author: commentAuthor;
	likeCount: string;
	dislikeCount: string;
	replyCount: number;
	userReaction: UserReactionType | null;
}

export interface ForumData {
	id: number;
	name: string;
	subtopics: {
		id: number;
		name: string;
	}[];
}

export interface Forum {
	id: string;
	headline: string;
	content: string;
	createdAt: string;
	author: {
		id: string;
		fullName: string;
		avatar: string | null;
		username: string;
	};
	location: {
		countryName: string;
		countryIso: string;
		cityName: string;
	} | null;
	media: {
		id: string;
		mediaUrl: string;
		mediaType: 'image' | 'video';
	}[];
	commentCount: number;
	userReaction: 'like' | 'dislike' | 'sign' | null;
	dislikeCount: number;
	section: 'doubt' | 'need' | 'dream';
	likeCount?: number; // Optional as it's not always present
	signCount?: number; // Optional as it's not always present
	isAuthor: boolean;
}

export interface ForumPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}