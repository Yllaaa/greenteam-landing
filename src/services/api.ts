// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getStoredLocale } from '../Utils/locale';
import type { Post, PaginatedResponse } from '../types/index';
// Define query parameters interface
interface GetPostsParams {
  page?: number;
  limit?: number;
  mainTopicId?: number;
  subTopicId?: number | 'all';
}

interface TopicScore {
  topicId: number;
  topicName: string;
  totalPoints: string;
}

// interface CreatePostBody {
//   content: string
//   mainTopicId?: number
//   images?: string[]
//   type?: "standard" | "poll" | "media" | "article"
// }
// interface PublishPostBody {
//   content: string
//   mainTopicId: number
//   creatorType: "user" | "page"
//   subtopicIds: string[]
//   images?: File[]
//   document?: File
// }
// interface ReactionData {
//   type: string
//   id: string
//   reactionType: string
// }
// interface ReactionResponse {
//   message: string
//   reaction?: {
//     id: string
//     reactionType: string
//     userId: string
//   }
//   counts?: {
//     like: number
//     dislike: number
//     do: number
//   }
// }
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKENDAPI || '',
  prepareHeaders: (headers, { endpoint }) => {
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
  tagTypes: ['User', 'Post', 'Product', 'TopicScores'],
  endpoints: (builder) => ({
    getPosts: builder.query<PaginatedResponse<Post>, GetPostsParams>({
      query: ({ page = 1, limit = 10, mainTopicId, subTopicId }) => {
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
      serializeQueryArgs: ({ queryArgs }) => {
        const { mainTopicId, subTopicId, page = 1, limit = 10 } = queryArgs;
        return `getPosts-${mainTopicId || 'all'}-${
          subTopicId || 'all'
        }-${page}-${limit}`;
      },

      // Provide tags for cache invalidation
      providesTags: (result, error, arg) => [
        {
          type: 'Post',
          id: `TOPIC-${arg.mainTopicId || 'all'}-${arg.subTopicId || 'all'}`,
        },
        'Post',
      ],
    }),
    getTopicScores: builder.query<TopicScore[], string>({
      query: (locale) => ({
        url: '/api/v1/users/score/main-topics',
        headers: {
          'Accept-Language': locale,
        },
      }),
      providesTags: ['TopicScores'],
    }),
    getSubTopicScores: builder.query<TopicScore[], number>({
      query: (topicId) => ({
        url: `/api/v1/users/score/sub-topics/${topicId}`,
      }),
      providesTags: (result, error, topicId) => [
        { type: 'TopicScores', id: topicId },
      ],
    }),
  }),
});

export const { useGetTopicScoresQuery, useGetSubTopicScoresQuery } = api;
