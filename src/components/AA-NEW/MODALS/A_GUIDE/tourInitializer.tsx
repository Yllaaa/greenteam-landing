
'use client';

import { useEffect } from 'react';
import { useTour } from './tourProvider';
import { TourConfig, TourStep } from './tourRegistry';
// import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

// Extend your step type to include route information
interface ExtendedStep extends TourStep {
    route?: string | ((locale: string) => string); // Add route property as string or function
}

export default function TourInitializer() {
    const { registerTour } = useTour();
    // const router = useRouter();
    const locale = useLocale();

    useEffect(() => {
        console.log('TourInitializer: Registering tours');

        // Create steps with locale resolved
        const createTourSteps = (currentLocale: string): ExtendedStep[] => [
            {
                target: '[data-tour="logo"]',
                content: 'Here is you can navigate to home page from greenteam logo.',
                title: 'Home Page',
                placement: 'bottom',
                disableBeacon: true,
            },
            {
                target: '[data-tour="community"]',
                content: 'Introduce our community you can find pages , groups , events , etc that the other users created.',
                title: 'Community',
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
                placement: 'left',
            },
            {
                target: '[data-tour="notifications"]',
                content: 'Stay updated with notifications.',
                title: 'Notifications',
                placement: 'left',
            },
            {
                target: '[data-tour="chat"]',
                content: 'Send and receive messages.',
                title: 'Messages',
                placement: 'left',
            },
            {
                target: '[data-tour="profile"]',
                content: 'Access your profile settings.',
                title: 'Your Profile',
                placement: 'left',
            },
            {
                target: '[data-tour="navigate-profile"]',
                content: 'Navigate to your profile.',
                title: 'Profile Navigation',
                placement: 'bottom',
            },
            // sub header
            {
                target: '[data-tour="diamond"]',
                content: 'You can see your points and track your impact in every category when you post or create.',
                title: 'The six categories of Green Team',
                placement: 'bottom',
            },
            {
                target: '[data-tour="greenChallenges"]',
                content: 'you can make an impact on a sustainable world and share your experince with every challenge.',
                title: 'Green Challenges',
                placement: 'bottom',
            },
            {
                target: '[data-tour="points"]',
                content: 'Track Your Points that you claim from sharing , posting your experince.',
                title: 'Your Points',
                placement: 'bottom',
            },
            //feeds
            {
                target: '[data-tour="feeds-container"]',
                content: 'Welcome to your feed! Here you\'ll find posts organized by different topics and categories.',
                title: 'Your Feed',
                placement: 'center',
                disableBeacon: true,
            },
            {
                target: '[data-tour="first-topic"]',
                content: 'Each section represents a different topic area. You can explore posts related to specific interests.',
                title: 'Topic Sections',
                placement: 'top',
            },
            {
                target: '[data-tour="topic-title"]',
                content: 'This shows the main topic category. Each topic contains various subtopics for more specific content.',
                title: 'Topic Categories',
                placement: 'bottom',
            },
            {
                target: '[data-tour="subtopic-filters"]',
                content: 'Use these filters to narrow down posts to specific subtopics within each category. Click "All" to see everything.',
                title: 'Subtopic Filters',
                placement: 'bottom',
            },
            {
                target: '[data-tour="posts-section"]',
                content: 'Posts related to the selected topic and subtopic appear here. Scroll to see more content.',
                title: 'Post Feed',
                placement: 'top',
            },
            {
                target: '[data-tour="first-post"]',
                content: 'Each post shows content shared by community members. You can interact with posts in various ways.',
                title: 'Community Posts',
                placement: 'right',
            },
            {
                target: '[data-tour="post-actions"]',
                content: 'Like posts you enjoy, comment to join the discussion, or share interesting content with others.',
                title: 'Post Interactions',
                placement: 'top',
            },
            // forums - needs navigation
            {
                target: '[data-tour="forums"]',
                content: 'Explore our forums to engage in discussions, ask questions, and share knowledge with the community.',
                title: 'Forums',
                placement: 'bottom',

            },
            // events - needs navigation
            {
                target: '[data-tour="events"]',
                content: 'Join our events to connect with like-minded individuals, participate in activities, and make a positive impact.',
                title: 'Events',
                placement: 'bottom',

            },
            // products - needs navigation
            {
                target: '[data-tour="products"]',
                content: 'Discover products to support your sustainability goals.',
                title: 'Products',
                placement: 'bottom',

            },
            // footer
            {
                target: '[data-tour="app-store"]',
                content: 'Download our app and connect with like-minded individuals, participate in activities, and make a positive impact.',
                title: 'download and share the community',
                placement: 'bottom',
            },
            {
                target: '[data-tour="donate"]',
                content: 'Donate to help us and continue with sustinability',
                title: 'Donate',
                placement: 'bottom',
            },
            {
                target: '[data-tour="invite"]',
                content: 'Share our community.',
                title: 'Invite friends',
                placement: 'bottom',
            },
            // community map - needs navigation
            {
                target: '[data-tour="community-map-header"]',
                content: 'Explore our community map to find local groups, events, and activities.',
                title: 'Community Map',
                placement: 'bottom',
                route: `/${currentLocale}/community`,
            },
        ];

        const headerTour: TourConfig = {
            id: 'header-tour',
            name: 'Platform Navigation Tour',
            autoStart: true,
            startDelay: 2000,
            showProgress: true,
            showSkipButton: true,
            continuous: true,
            steps: createTourSteps(locale) as TourStep[],
        };

        // Register the tour
        registerTour(headerTour);

    }, [registerTour, locale]);

    return null;
}