// hooks/useSafeTour.ts
'use client';

import { useEffect, useState } from 'react';
import { useTour as useOriginalTour } from './tourProvider';

export const useSafeTour = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Return dummy functions during SSR
    if (!mounted) {
        return {
            startTour: () => { },
            stopTour: () => { },
            resetTour: () => { },
            isTourActive: false,
        };
    }

    // Once mounted, use the actual hook
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useOriginalTour();
    } catch (error) {
        console.log('Error using tour provider:', error);
        
        // Fallback if provider is not available
        return {
            startTour: () => { },
            stopTour: () => { },
            resetTour: () => { },
            isTourActive: false,
        };
    }
};