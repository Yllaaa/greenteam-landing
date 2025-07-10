// components/TourInitializer/TourInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useTour } from './tourProvider';
import { TourConfig } from './tourRegistry';

const headerTour: TourConfig = {
    id: 'header-tour',
    name: 'Platform Navigation Tour',
    autoStart: true,
    startDelay: 2000,
    showProgress: true,
    showSkipButton: true,
    continuous: true,
    steps: [
        {
            target: '[data-tour="logo"]',
            content: 'Welcome to our platform! 🎉 Click on the logo anytime to return to your main feed.',
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

const feedTour: TourConfig = {
    id: 'feed-tour',
    name: 'Feed Navigation Tour',
    autoStart: false, // Don't auto-start, we'll trigger it after header tour
    startDelay: 1000,
    showProgress: true,
    showSkipButton: true,
    continuous: true,
    steps: [
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
    ],
  };

export default function TourInitializer() {
    const { registerTour } = useTour();

    useEffect(() => {
        console.log('TourInitializer: Registering tours');
        registerTour(headerTour);
        registerTour(feedTour);
    }, [registerTour]);

    return null;
}