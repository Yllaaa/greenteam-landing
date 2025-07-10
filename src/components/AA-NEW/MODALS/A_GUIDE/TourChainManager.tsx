// components/TourChainManager/TourChainManager.tsx
'use client';

import { useEffect } from 'react';
import { useTour } from './tourProvider';

export default function TourChainManager() {
    const { startTour } = useTour();

    useEffect(() => {
        // Listen for tour completion events
        const checkTourChain = () => {
            const headerCompleted = localStorage.getItem('tour_completed_header-tour');
            const feedCompleted = localStorage.getItem('tour_completed_feed-tour');

            // If header tour just completed and feed tour hasn't been shown
            if (headerCompleted && !feedCompleted) {
                // Check if we're on the feeds page
                if (window.location.pathname.includes('/feeds')) {
                    setTimeout(() => {
                        startTour('feed-tour');
                    }, 1500);
                }
            }
        };

        // Check on mount
        checkTourChain();

        // Listen for storage changes (tour completions)
        window.addEventListener('storage', checkTourChain);

        return () => {
            window.removeEventListener('storage', checkTourChain);
        };
    }, [startTour]);

    return null;
}