/** @format */

// config/tours.config.ts
export interface TourConfig {
	id: string;
	name: string;
	description: string;
	routes: string[]; // Routes where this tour is available
	steps: TourStep[];
	prerequisites?: string[]; // IDs of tours that should be completed first
	version?: string; // For versioning tours when UI changes
}

export interface TourStep {
	id: string;
	route?: string; // If step requires navigation
	title: string;
	text: string;
	element: string;
	position?: 'bottom' | 'top' | 'left' | 'right' | 'auto';
	delay?: number; // Delay before showing step (useful after navigation)
	waitForElement?: boolean; // Wait for element to appear
	skipIfNotFound?: boolean; // Skip step if element not found
}

// Define all your tours
export const tours: Record<string, TourConfig> = {
	onboarding: {
		id: 'onboarding',
		name: 'Welcome Tour',
		description: 'Introduction to the platform',
		routes: ['/en/feeds', '/en/community'],
		steps: [
			{
				id: 'welcome',
				route: '/en/feeds',
				title: 'Welcome!',
				text: "Welcome to our platform. Let's take a quick tour.",
				element: '#main-header',
				position: 'bottom',
			},
			{
				id: 'community-intro',
				route: '/en/community',
				title: 'Your Community',
				text: 'This is your community where you can see all your data.',
				element: '#dashboard-container',
				position: 'bottom',
				delay: 500,
			},
			
		],
	},
	'feature-analytics': {
		id: 'feature-analytics',
		name: 'Analytics Feature Tour',
		description: 'Learn how to use analytics',
		routes: ['/en/community'],
		prerequisites: ['onboarding'],
		steps: [
			{
				id: 'analytics-overview',
				title: 'Analytics Overview',
				text: 'Here you can view all your analytics data.',
				element: '#analytics-header',
				position: 'bottom',
			},
			{
				id: 'date-filter',
				title: 'Filter by Date',
				text: 'Use this filter to select your date range.',
				element: '#date-filter',
				position: 'bottom',
			},
		],
	},
	// Add more tours as needed
};
