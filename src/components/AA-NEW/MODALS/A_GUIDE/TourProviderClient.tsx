// components/TourProvider/TourProviderClient.tsx
'use client';

import { Suspense } from 'react';
import { GlobalTourProvider } from './tourProvider';

function TourProviderFallback() {
    return null; // or a loading state if needed
}

export function TourProviderClient({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<TourProviderFallback />}>
            <GlobalTourProvider>{children}</GlobalTourProvider>
        </Suspense>
    );
}