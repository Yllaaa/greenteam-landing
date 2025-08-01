"use client";
/** @format */

// config/tours/homeTours.ts
import {tourRegistry, TourConfig} from './tourRegistry';

// Main home page tour
const homePageTour: TourConfig = {
	id: 'header-tour',
	name: 'Complete Home Page Tour',
	autoStart: true,
	startDelay: 2000,
	showProgress: true,
	showSkipButton: true,
	continuous: true,
	steps: [
		// Header steps
		{
			target: '[data-tour="header-logo"]',
			content:
				'Welcome to our platform! Click the logo to return to your feeds anytime.',
			title: 'Navigation Logo',
			placement: 'bottom',
			disableBeacon: true,
		},
		{
			target: '[data-tour="community"]',
			content: 'Discover and join communities that match your interests.',
			title: 'Community Hub',
			placement: 'bottom',
		},
		{
			target: '[data-tour="favorites"]',
			content: 'Quick access to all your saved content and favorites.',
			title: 'Your Favorites',
			placement: 'bottom',
		},
		{
			target: '[data-tour="add-post"]',
			content: 'Share your thoughts, images, or videos with the community.',
			title: 'Create Content',
			placement: 'bottom',
		},

		// Feed section steps
		{
			target: '[data-tour="feed-filters"]',
			content: 'Filter content by category, date, or popularity.',
			title: 'Content Filters',
			placement: 'right',
		},
		{
			target: '[data-tour="feed-item-first"]',
			content: 'Interact with posts by liking, commenting, or sharing.',
			title: 'Engage with Content',
			placement: 'top',
		},

		// Sidebar steps
		{
			target: '[data-tour="trending-section"]',
			content: "See what's trending in your communities.",
			title: 'Trending Topics',
			placement: 'left',
		},
		{
			target: '[data-tour="suggestions"]',
			content: 'Discover new communities and users to follow.',
			title: 'Recommendations',
			placement: 'left',
		},
	],
};

// Feature-specific tours
const postCreationTour: TourConfig = {
	id: 'post-creation-tour',
	name: 'Create Your First Post',
	showProgress: true,
	showSkipButton: true,
	steps: [
		{
			target: '[data-tour="post-title"]',
			content: 'Give your post a catchy title.',
			title: 'Post Title',
			placement: 'top',
		},
		{
			target: '[data-tour="post-content"]',
			content: 'Write your content here. You can format text and add emojis.',
			title: 'Post Content',
			placement: 'top',
		},
		{
			target: '[data-tour="post-media"]',
			content: 'Add images or videos to make your post more engaging.',
			title: 'Media Upload',
			placement: 'left',
		},
		{
			target: '[data-tour="post-tags"]',
			content: 'Add relevant tags to help others find your post.',
			title: 'Tags',
			placement: 'top',
		},
		{
			target: '[data-tour="post-submit"]',
			content: "When you're ready, click here to publish your post.",
			title: 'Publish',
			placement: 'top',
		},
	],
};

// Register tours
tourRegistry.registerTour(homePageTour);
tourRegistry.registerTour(postCreationTour);

// You can also register component-specific steps
tourRegistry.registerComponentSteps('feed-component', [
	{
		target: '[data-tour="feed-refresh"]',
		content: 'Pull down or click here to refresh your feed.',
		title: 'Refresh Feed',
		placement: 'bottom',
	},
	{
		target: '[data-tour="feed-view-toggle"]',
		content: 'Switch between grid and list view.',
		title: 'Change View',
		placement: 'bottom',
	},
]);

export {homePageTour, postCreationTour};
