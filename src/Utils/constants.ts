// Localization
export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];

// API Configuration
export const API_ENDPOINTS = {
  POSTS: '/api/v1/posts',
  USERS: '/api/v1/users',
  TOPICS: '/api/v1/topics',
  COMMENTS: '/api/v1/comments',
  AUTH: '/api/v1/auth',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  POSTS_PER_PAGE: 20,
  COMMENTS_PER_PAGE: 10,
} as const;

// Time
export const TIME_FORMATS = {
  RELATIVE: 'relative', // "2 hours ago"
  SHORT: 'MMM d', // "Jan 1"
  FULL: 'MMM d, yyyy', // "Jan 1, 2024"
  WITH_TIME: 'MMM d, yyyy HH:mm', // "Jan 1, 2024 14:30"
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LOCALE: 'locale',
} as const;

// Theme
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Post Configuration
export const POST_CONFIG = {
  MAX_CONTENT_LENGTH: 500,
  MAX_IMAGES: 4,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// Topics
export const DEFAULT_TOPIC_ID = 1;
export const TOPIC_FILTERS = {
  ALL: undefined,
  TRENDING: 'trending',
  FOLLOWING: 'following',
  RECENT: 'recent',
} as const;

// Breakpoints (matching MUI)
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

// Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  POST_DETAIL: '/posts/:id',
  USER_PROFILE: '/profile/:id',
  TOPIC: '/topics/:id',
} as const;

// Social Actions
export const SOCIAL_ACTIONS = {
  LIKE: 'like',
  UNLIKE: 'unlike',
  COMMENT: 'comment',
  SHARE: 'share',
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  POST_NOT_FOUND: 'Post not found.',
  USER_NOT_FOUND: 'User not found.',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  HASHTAG: /#[\w]+/g,
  MENTION: /@[\w]+/g,
} as const;

// Animation Durations (in ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Debounce Delays (in ms)
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  SCROLL: 100,
} as const;

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  STORIES: false,
  VIDEO_POSTS: false,
  LIVE_STREAMING: false,
  PRIVATE_MESSAGING: true,
} as const;

// Default Values
export const DEFAULTS = {
  AVATAR: '/images/default-avatar.png',
  COVER: '/images/default-cover.png',
  POST_IMAGE: '/images/default-post.png',
} as const;

// Locale Configuration
export const LOCALE_CONFIG = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    dateLocale: 'en-US',
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    dateLocale: 'es-ES',
  },
} as const;

// Export types
export type ThemeOption = typeof THEME_OPTIONS[keyof typeof THEME_OPTIONS];
export type TopicFilter = typeof TOPIC_FILTERS[keyof typeof TOPIC_FILTERS];
export type SocialAction = typeof SOCIAL_ACTIONS[keyof typeof SOCIAL_ACTIONS];