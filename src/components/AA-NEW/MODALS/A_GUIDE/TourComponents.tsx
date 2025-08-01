// components/TourComponents.tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

// Dynamically import tour components to prevent SSR issues
const TourInitializer = dynamic(() => import('@/components/AA-NEW/MODALS/A_GUIDE/tourInitializer'), {
    ssr: false
});

const TourChainManager = dynamic(() => import('@/components/AA-NEW/MODALS/A_GUIDE/TourChainManager'), {
    ssr: false
});

export default function TourComponents() {
    useEffect(() => {
        // Import the tour registration only on client side
        import('@/components/AA-NEW/MODALS/A_GUIDE/tourInitializer');
    }, []);

    return (
        <>
            <TourInitializer />
            <TourChainManager />
        </>
    );
}