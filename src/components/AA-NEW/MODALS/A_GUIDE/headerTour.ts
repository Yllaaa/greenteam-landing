/** @format */

// config/tours/index.ts
import {tourRegistry, TourConfig} from './tourRegistry';

// Header Tour Configuration
const headerTour: TourConfig = {
	id: 'header-tour',
	name: 'Platform Navigation Tour',
	autoStart: true,
	startDelay: 1500,
	showProgress: true,
	showSkipButton: true,
	continuous: true,
	steps: [
		{
			target: '[data-tour="logo"]',
			content:
				'Welcome to our platform! 🎉 Click on the logo anytime to return to your main feed.',
			title: 'Navigation Home',
			placement: 'bottom',
			disableBeacon: true,
		},
		{
			target: '[data-tour="community"]',
			content: 'Discover and join communities that share your interests.',
			title: 'Community Hub',
			placement: 'bottom',
		},
		{
			target: '[data-tour="favorites"]',
			content: 'Access all your saved posts and favorite content in one place.',
			title: 'Your Favorites',
			placement: 'bottom',
		},
		{
			target: '[data-tour="add-post"]',
			content: 'Share your thoughts with the community.',
			title: 'Create New Post',
			placement: 'bottom',
		},
		{
			target: '[data-tour="notifications"]',
			content: 'Stay updated with notifications.',
			title: 'Notifications',
			placement: 'bottom',
		},
		{
			target: '[data-tour="chat"]',
			content: 'Send and receive messages.',
			title: 'Messages',
			placement: 'bottom',
		},
		{
			target: '[data-tour="profile"]',
			content: 'Access your profile settings.',
			title: 'Your Profile',
			placement: 'left',
		},
	],
};

// Register the tour
tourRegistry.registerTour(headerTour);

// Export for debugging
export {headerTour};
