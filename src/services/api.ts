/* eslint-disable @typescript-eslint/no-explicit-any */

// services/api.ts
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {getStoredLocale} from '../Utils/locale';
import type {
	Post,
	PaginatedResponse,
	Comment as CommentType,
	ForumPaginatedResponse,
	Forum,
} from '../types/index';

// Define query parameters interface
interface GetPostsParams {
	page?: number;
	limit?: number;
	mainTopicId?: number;
	subTopicId?: number | 'all';
}
interface GetGroupPostsParams {
	groupId: string;
	page?: number;
	limit?: number;
}

interface TopicScore {
	topicId: number;
	topicName: string;
	totalPoints: string;
}
interface ReactionData {
	type: string;
	id: string;
	reactionType: string;
}
interface ReactionResponse {
	message: string;
	reaction?: {
		id: string;
		reactionType: string;
		userId: string;
	};
	counts?: {
		like: number;
		dislike: number;
		do: number;
	};
}

interface PublishPostBody {
	content: string;
	mainTopicId: number;
	creatorType: 'user' | 'page';
	subtopicIds: string[];
	images?: File[];
	document?: File;
}

// Tag helper functions for consistent tag generation
const tagHelpers = {
	post: {
		list: () => ({type: 'Post' as const, id: 'LIST'}),
		detail: (id: string) => ({type: 'Post' as const, id}),
		byTopic: (
			mainTopicId: number | string,
			subTopicId: number | string = 'all'
		) => ({
			type: 'Post' as const,
			id: `TOPIC-${mainTopicId}-${subTopicId}`,
		}),
		all: () => 'Post' as const,
	},
	forum: {
		list: () => ({type: 'Forum' as const, id: 'LIST'}),
		detail: (id: string) => ({type: 'Forum' as const, id}),
		bySection: (section: string) => ({
			type: 'Forum' as const,
			id: `SECTION-${section}`,
		}),
		all: () => 'Forum' as const,
	},
	comment: {
		byPost: (postId: string) => ({type: 'Comment' as const, id: postId}),
		byComment: (commentId: string) => ({
			type: 'Comment' as const,
			id: commentId,
		}),
		all: () => 'Comment' as const,
	},
	topicScores: {
		main: () => 'TopicScores' as const,
		sub: (topicId: number) => ({type: 'TopicScores' as const, id: topicId}),
	},
	product: {
		list: () => ({type: 'Product' as const, id: 'LIST'}),
		detail: (id: string) => ({type: 'Product' as const, id}),
	},
	page: {
		list: () => ({type: 'Page' as const, id: 'LIST'}),
		detail: (id: string) => ({type: 'Page' as const, id}),
	},
	group: {
		list: () => ({type: 'Group' as const, id: 'LIST'}),
		detail: (id: string) => ({type: 'Group' as const, id}),
		posts: (groupId: string) => ({type: 'GroupPost' as const, id: groupId}),
	},
	groupPost: {
		byGroup: (groupId: string) => ({
			type: 'GroupPost' as const,
			id: `GROUP-${groupId}`,
		}),
		detail: (postId: string) => ({type: 'GroupPost' as const, id: postId}),
		all: () => 'GroupPost' as const,
	},
};

const createPostFormData = (data: PublishPostBody): FormData => {
	const formData = new FormData();

	// Validate: can't have both images and document
	if (data.images && data.images.length > 0 && data.document) {
		throw new Error(
			'Cannot upload both images and document. Please choose one.'
		);
	}

	// Add basic fields
	formData.append('content', data.content);
	formData.append('mainTopicId', data.mainTopicId.toString());
	formData.append('creatorType', data.creatorType);

	// Add subtopicIds - send each ID as a separate field
	data.subtopicIds.forEach((id) => {
		formData.append('subtopicIds[]', id);
	});

	// Handle images
	if (data.images && data.images.length > 0) {
		// Validate image count
		if (data.images.length > 4) {
			throw new Error('Maximum 4 images allowed');
		}

		// Validate each image
		data.images.forEach((image) => {
			// Check file size (2MB = 2 * 1024 * 1024 bytes)
			if (image.size > 2 * 1024 * 1024) {
				throw new Error(`Image "${image.name}" exceeds 2MB limit`);
			}
			// Check file type
			if (!image.type.startsWith('image/')) {
				throw new Error(`File "${image.name}" is not an image`);
			}

			formData.append('images', image);
		});
	}

	// Handle document
	if (data.document) {
		// Check if it's a PDF
		if (data.document.type !== 'application/pdf') {
			throw new Error('Document must be a PDF file');
		}

		// Check size limit (10MB)
		if (data.document.size > 10 * 1024 * 1024) {
			throw new Error('Document exceeds 10MB limit');
		}

		formData.append('document', data.document);
	}

	return formData;
};

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_BACKENDAPI || '',
	prepareHeaders: (headers, {endpoint}) => {
		const token = localStorage.getItem('user');

		if (token) {
			try {
				const parsedToken = JSON.parse(token);
				if (parsedToken && parsedToken.accessToken) {
					headers.set('Authorization', `Bearer ${parsedToken.accessToken}`);
				}
			} catch (error) {
				console.error('Failed to parse token:', error);
			}
		}

		const currentLocale = getStoredLocale() || 'en';
		headers.set('Accept-Language', currentLocale);

		// Don't set Content-Type for FormData - let the browser set it with boundary
		if (endpoint !== 'publishPost') {
			headers.set('Content-Type', 'application/json');
		}

		headers.set('Accept', 'application/json');

		return headers;
	},
});

export const api = createApi({
	reducerPath: 'api',
	baseQuery,
	tagTypes: [
		'User',
		'Post',
		'Product',
		'TopicScores',
		'Comment',
		'Forum',
		'Deleted',
		'Group',
		'Page',
		'GroupPost',
	],
	endpoints: (builder) => ({
		// get posts
		// feeds
		getPosts: builder.query<PaginatedResponse<Post>, GetPostsParams>({
			query: ({page = 1, limit = 10, mainTopicId, subTopicId}) => {
				const params = new URLSearchParams();
				params.append('page', page.toString());
				params.append('limit', limit.toString());

				// API logic: If subTopicId is provided (and not 'all'), use only that
				// Otherwise, if mainTopicId is provided, use that
				if (subTopicId && subTopicId !== 'all') {
					params.append('subTopicId', subTopicId.toString());
				} else if (mainTopicId) {
					params.append('mainTopicId', mainTopicId.toString());
				}

				return `/api/v1/posts?${params.toString()}`;
			},

			// Include page in cache key so each page is cached separately
			serializeQueryArgs: ({queryArgs}) => {
				const {mainTopicId, subTopicId, page = 1, limit = 10} = queryArgs;
				return `getPosts-${mainTopicId || 'all'}-${
					subTopicId || 'all'
				}-${page}-${limit}`;
			},

			// Provide tags for cache invalidation
			providesTags: (result, error, arg) => [
				tagHelpers.post.byTopic(
					arg.mainTopicId || 'all',
					arg.subTopicId || 'all'
				),
				tagHelpers.post.all(),
			],
		}),
		// groups posts
		getGroupPosts: builder.query<PaginatedResponse<Post>, GetGroupPostsParams>({
			query: ({groupId, page = 1, limit = 10}) => {
				const params = new URLSearchParams();
				params.append('page', page.toString());
				params.append('limit', limit.toString());

				return `/api/v1/groups/${groupId}/posts?${params.toString()}`;
			},

			// Include page in cache key
			serializeQueryArgs: ({queryArgs}) => {
				const {groupId, page = 1, limit = 10} = queryArgs;
				return `getGroupPosts-${groupId}-${page}-${limit}`;
			},

			// Provide tags for cache invalidation
			providesTags: (result, error, {groupId}) => [
				tagHelpers.groupPost.byGroup(groupId),
				tagHelpers.groupPost.all(),
			],
		}),
		//get forums
		getForums: builder.query<
			ForumPaginatedResponse<Forum>,
			{
				page?: number;
				limit?: number;
				section?: 'doubt' | 'need' | 'dream' | 'all';
			}
		>({
			query: ({page = 1, limit = 10, section = 'all'}) => {
				const params = new URLSearchParams();
				params.append('page', page.toString());
				params.append('limit', limit.toString());

				if (section !== 'all') {
					params.append('section', section);
				}

				return `/api/v1/forum?${params.toString()}`;
			},
			serializeQueryArgs: ({queryArgs}) => {
				const {section = 'all', page = 1, limit = 10} = queryArgs;
				return `getForums-${section}-${page}-${limit}`;
			},
			providesTags: (result, error, arg) => [
				tagHelpers.forum.bySection(arg.section || 'all'),
				tagHelpers.forum.all(),
			],
		}),

		// getTopicsScores
		getTopicScores: builder.query<TopicScore[], string>({
			query: (locale) => ({
				url: '/api/v1/users/score/main-topics',
				headers: {
					'Accept-Language': locale,
				},
			}),
			providesTags: [tagHelpers.topicScores.main()],
		}),
		// getSubTopicsScores
		getSubTopicScores: builder.query<TopicScore[], number>({
			query: (topicId) => ({
				url: `/api/v1/users/score/sub-topics/${topicId}`,
			}),
			providesTags: (result, error, topicId) => [
				tagHelpers.topicScores.sub(topicId),
			],
		}),
		// Like/Unlike Post
		reactionPost: builder.mutation<ReactionResponse, ReactionData>({
			query: ({type, id, reactionType}) => ({
				url: `/api/v1/posts/reactions/toggle-reaction`,
				method: 'POST',
				body: {
					reactionableType: type,
					reactionableId: id,
					reactionType: reactionType,
				},
			}),
			// Transform error response
			transformErrorResponse: (response: any) => {
				return {
					status: response.status,
					data: response.data || {message: 'Failed to update reaction'},
				};
			},
			// Invalidate tags
			invalidatesTags: (result, error, {id}) => {
				if (error) return [];

				return [tagHelpers.post.detail(id), tagHelpers.post.list()];
			},
		}),
		// Like/Unlike/sign Forum
		reactionForum: builder.mutation<ReactionResponse, ReactionData>({
			query: ({type, id, reactionType}) => ({
				url: `/api/v1/forum/reactions/toggle-reaction`,
				method: 'POST',
				body: {
					reactionableType: type,
					reactionableId: id,
					reactionType: reactionType,
				},
			}),
			// Transform error response
			transformErrorResponse: (response: {status: number; data: any}) => {
				return {
					status: response.status,
					data: response.data || {message: 'Failed to update reaction'},
				};
			},
			// Invalidate tags to refresh data
			invalidatesTags: (result, error, {id}) => {
				if (error) return [];

				return [
					tagHelpers.forum.detail(id),
					tagHelpers.forum.list(),
					tagHelpers.forum.all(),
				];
			},
		}),

		// Publish Post
		publishPost: builder.mutation<Post, PublishPostBody>({
			query: (data) => {
				const formData = createPostFormData(data);

				return {
					url: '/api/v1/posts/publish-post',
					method: 'POST',
					body: formData,
				};
			},
			// Handle errors properly
			transformErrorResponse: (response: any) => {
				return {
					status: response.status,
					data: response.data || {message: 'Failed to publish post'},
				};
			},
			invalidatesTags: (result, error, arg) => {
				if (error) return [];

				const tags = [
					tagHelpers.post.list(),
					tagHelpers.post.byTopic(arg.mainTopicId, 'all'),
				];

				// Add tags for each subtopic
				arg.subtopicIds.forEach((id) => {
					tags.push(tagHelpers.post.byTopic(arg.mainTopicId, id));
				});

				return tags;
			},
		}),
		// Publish post to group
		publishGroupPost: builder.mutation<
			Post,
			{
				groupId: string;
				content: string;
				images?: File[];
				document?: File;
			}
		>({
			query: ({groupId, content, images, document}) => {
				const formData = new FormData();
				formData.append('content', content);

				// Handle images
				if (images && images.length > 0) {
					if (images.length > 4) {
						throw new Error('Maximum 4 images allowed');
					}

					images.forEach((image) => {
						if (image.size > 2 * 1024 * 1024) {
							throw new Error(`Image "${image.name}" exceeds 2MB limit`);
						}
						if (!image.type.startsWith('image/')) {
							throw new Error(`File "${image.name}" is not an image`);
						}
						formData.append('images', image);
					});
				}

				// Handle document
				if (document) {
					if (document.type !== 'application/pdf') {
						throw new Error('Document must be a PDF file');
					}
					if (document.size > 10 * 1024 * 1024) {
						throw new Error('Document exceeds 10MB limit');
					}
					formData.append('document', document);
				}

				return {
					url: `/api/v1/groups/${groupId}/posts/publish-post`,
					method: 'POST',
					body: formData,
				};
			},

			invalidatesTags: (result, error, {groupId}) => {
				if (error) return [];

				return [
					tagHelpers.groupPost.byGroup(groupId),
					tagHelpers.group.detail(groupId),
				];
			},
		}),

		//delete and report
		deleteContent: builder.mutation<
			void,
			{
				contentType: 'posts' | 'forum' | 'product' | 'page' | 'group';
				contentId: string;
			}
		>({
			query: ({contentType, contentId}) => ({
				url: `/api/v1/${contentType}/${contentId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, {contentType, contentId}) => {
				if (error) return [];

				// Map content types to tag helpers
				const tagMap = {
					posts: [tagHelpers.post.detail(contentId), tagHelpers.post.list()],
					forum: [tagHelpers.forum.detail(contentId), tagHelpers.forum.list()],
					product: [
						tagHelpers.product.detail(contentId),
						tagHelpers.product.list(),
					],
					page: [tagHelpers.page.detail(contentId), tagHelpers.page.list()],
					group: [tagHelpers.group.detail(contentId), tagHelpers.group.list()],
				};

				return tagMap[contentType] || [];
			},
		}),

		reportContent: builder.mutation<
			{message: string},
			{
				contentType: 'post' | 'forum' | 'product' | 'page' | 'group';
				contentId: string;
				reason: string;
				details: string;
			}
		>({
			query: ({contentType, contentId, reason, details}) => ({
				url: '/api/v1/reports',
				method: 'POST',
				body: {
					reportedType:
						contentType === 'forum' ? 'forum_publication' : contentType,
					reportedId: contentId,
					reason,
					details,
				},
			}),
			// Reporting doesn't need to invalidate tags as content still exists
		}),
		// Get comments
		getComments: builder.query<
			CommentType[],
			{postId: string; page: number; limit: number}
		>({
			query: ({postId, page, limit}) => ({
				url: `/api/v1/posts/${postId}/comments?page=${page}&limit=${limit}`,
			}),
			providesTags: (result, error, {postId}) => [
				tagHelpers.comment.byPost(postId),
				tagHelpers.comment.all(),
			],
		}),

		getReplies: builder.query<
			CommentType[],
			{postId: string; commentId: string; page: number; limit: number}
		>({
			query: ({postId, commentId, page, limit}) => ({
				url: `/api/v1/posts/${postId}/comments/${commentId}/replies?page=${page}&limit=${limit}`,
			}),
			providesTags: (result, error, {commentId}) => [
				tagHelpers.comment.byComment(commentId),
			],
		}),

		postComment: builder.mutation<
			CommentType,
			{postId: string; content: string}
		>({
			query: ({postId, content}) => ({
				url: `/api/v1/posts/${postId}/comment`,
				method: 'POST',
				body: {content},
			}),
			invalidatesTags: (result, error, {postId}) => {
				if (error) return [];

				return [
					tagHelpers.comment.byPost(postId),
					tagHelpers.post.detail(postId), // Update post comment count
				];
			},
		}),

		postReply: builder.mutation<
			CommentType,
			{postId: string; commentId: string; content: string}
		>({
			query: ({postId, commentId, content}) => ({
				url: `/api/v1/posts/${postId}/comments/${commentId}/reply`,
				method: 'POST',
				body: {content},
			}),
			invalidatesTags: (result, error, {postId, commentId}) => {
				if (error) return [];

				return [
					tagHelpers.comment.byComment(commentId),
					tagHelpers.comment.byPost(postId), // Parent comment list might need update
				];
			},
		}),

		// Delete comment
		deleteComment: builder.mutation<void, {postId: string; commentId: string}>({
			query: ({postId, commentId}) => ({
				url: `/api/v1/posts/${postId}/comments/${commentId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, {postId}) => {
				if (error) return [];

				return [
					tagHelpers.comment.byPost(postId),
					tagHelpers.post.detail(postId), // Update post comment count
				];
			},
		}),

		// Delete reply
		deleteReply: builder.mutation<
			void,
			{postId: string; commentId: string; replyId: string}
		>({
			query: ({postId, commentId, replyId}) => ({
				url: `/api/v1/posts/${postId}/comments/${commentId}/replies/${replyId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, {postId, commentId}) => {
				if (error) return [];

				return [
					tagHelpers.comment.byComment(commentId),
					tagHelpers.comment.byPost(postId), // Might affect parent comment count
				];
			},
		}),

		// Reaction for comments/replies
		reactionComment: builder.mutation<
			ReactionResponse,
			{type: 'comment' | 'reply'; id: string; reactionType: 'like' | 'dislike'}
		>({
			query: ({type, id, reactionType}) => ({
				url: `/api/v1/posts/reactions/toggle-reaction`,
				method: 'POST',
				body: {
					reactionableType: type,
					reactionableId: id,
					reactionType: reactionType,
				},
			}),
			invalidatesTags: (result, error, {id}) => {
				if (error) return [];

				return [tagHelpers.comment.byComment(id)];
			},
		}),
	}),
});

export const {
	useGetPostsQuery,
	useGetGroupPostsQuery,
	usePublishGroupPostMutation,
	useGetForumsQuery,
	useDeleteContentMutation,
	useReportContentMutation,
	useGetTopicScoresQuery,
	useGetSubTopicScoresQuery,
	useReactionPostMutation,
	useReactionForumMutation,
	usePublishPostMutation,
	useGetCommentsQuery,
	useGetRepliesQuery,
	useLazyGetRepliesQuery,
	usePostCommentMutation,
	usePostReplyMutation,
	useDeleteCommentMutation,
	useDeleteReplyMutation,
	useReactionCommentMutation,
} = api;
