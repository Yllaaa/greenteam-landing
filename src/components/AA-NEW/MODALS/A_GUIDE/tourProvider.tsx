// components/TourProvider/GlobalTourProvider.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import Joyride, { CallBackProps, STATUS, Step, Styles, EVENTS } from 'react-joyride';
import { tourRegistry, TourConfig, TourStep } from './tourRegistry';
import { usePathname } from 'next/navigation';

interface TourContextType {
    startTour: (tourId: string) => void;
    startDynamicTour: (steps: TourStep[], tourId?: string) => void;
    stopTour: () => void;
    resetTour: (tourId: string) => void;
    isTourActive: boolean;
    currentTourId: string | null;
    currentStepIndex: number;
    registerTour: (tour: TourConfig) => void;
    registerComponentSteps: (componentId: string, steps: TourStep[]) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTour must be used within GlobalTourProvider');
    }
    return context;
};

const tourStyles: Styles = {
    options: {
        primaryColor: '#000',
        backgroundColor: '#1A1E1C',
        textColor: '#fff',
        zIndex: 10000,
    },
    tooltip: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 8,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
    tooltipContainer: {
        textAlign: 'left',
    },
    tooltipTitle: {
        fontSize: '14px',
        fontWeight: 600,
        marginBottom: '4px',
        color: '#fff',
    },
    tooltipContent: {
        fontSize: '14px',
        lineHeight: 1.6,
        color: '#FEFEFEB2'
    },
    buttonNext: {
        background: ' #96B032',
        borderRadius: 6,
        color: '#ffffff',
        fontSize: '0.875rem',
        fontWeight: 500,
        padding: '0.625rem 1.25rem',
    },
    buttonBack: {
        color: '#fff',
        background:"#063",
        fontSize: '0.875rem',
        fontWeight: 500,
        marginRight: 'auto',
    },
    buttonSkip: {
        color: '#fff',
        background: '#575857',
        fontSize: '0.875rem',
        fontWeight: 500,
    },
    spotlight: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    beacon: {},
    beaconInner: {},
    beaconOuter: {},
    buttonClose: {},
    overlay: {},
    overlayLegacy: {},
    overlayLegacyCenter: {},
    spotlightLegacy: {},
    tooltipFooter: {},
    tooltipFooterSpacer: {}
};

export const GlobalTourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentTourId, setCurrentTourId] = useState<string | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0); // Add this
    const [tourConfig, setTourConfig] = useState<Partial<TourConfig>>({});
    const pathname = usePathname();
    const startTourRef = useRef<(tourId: string) => void>(null);

    const handleJoyrideCallback = useCallback((data: CallBackProps) => {
        const { status, index, type } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        // Update current step index
        if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            setCurrentStepIndex(index + 1);
        }

        if (finishedStatuses.includes(status)) {
            if (currentTourId) {
                localStorage.setItem(`tour_completed_${currentTourId}`, 'true');
            }
            setRun(false);
            setSteps([]);
            setCurrentTourId(null);
            setCurrentStepIndex(0); // Reset step index
            setTourConfig({});
        }
    }, [currentTourId]);

    const startTour = useCallback((tourId: string) => {
        console.log(`startTour called with tourId: ${tourId}`);
        const tour = tourRegistry.getTour(tourId);
        console.log('Tour found:', tour);

        if (tour && tour.steps.length > 0) {
            console.log('Setting tour steps:', tour.steps);
            setSteps(tour.steps as Step[]);
            setCurrentTourId(tourId);
            setCurrentStepIndex(0); // Reset to first step
            setTourConfig(tour);
            setRun(true);
        } else {
            console.log('Tour not found or has no steps');
        }
    }, []);

    // Store startTour in ref to use in useEffect
    startTourRef.current = startTour;

    const startDynamicTour = useCallback((tourSteps: TourStep[], tourId?: string) => {
        if (tourSteps.length > 0) {
            setSteps(tourSteps as Step[]);
            setCurrentTourId(tourId || 'dynamic-tour');
            setRun(true);
        }
    }, []);

    const stopTour = useCallback(() => {
        setRun(false);
        setSteps([]);
        setCurrentTourId(null);
        setTourConfig({});
    }, []);

    const resetTour = useCallback((tourId: string) => {
        localStorage.removeItem(`tour_completed_${tourId}`);
    }, []);

    const registerTour = useCallback((tour: TourConfig) => {
        console.log('Registering tour:', tour.id);
        tourRegistry.registerTour(tour);
    }, []);

    const registerComponentSteps = useCallback((componentId: string, steps: TourStep[]) => {
        tourRegistry.registerComponentSteps(componentId, steps);
    }, []);

    // Check for auto-start tours
    useEffect(() => {
        const checkAutoStartTours = () => {
            const allTours = tourRegistry.getAllTours();
            console.log('All registered tours:', allTours);

            for (const tour of allTours) {
                if (tour.autoStart) {
                    const hasCompleted = localStorage.getItem(`tour_completed_${tour.id}`);
                    const isActive = currentTourId === tour.id;

                    console.log(`Tour ${tour.id}: completed=${hasCompleted}, active=${isActive}, running=${run}`);

                    if (!hasCompleted && !isActive && !run) {
                        console.log(`Starting tour ${tour.id} in ${tour.startDelay || 1000}ms`);
                        setTimeout(() => {
                            if (startTourRef.current) {
                                startTourRef.current(tour.id);
                            }
                        }, tour.startDelay || 1000);
                        break;
                    }
                }
            }
        };

        // Delay check to ensure tours are registered
        const timer = setTimeout(checkAutoStartTours, 500);
        return () => clearTimeout(timer);
    }, [pathname, currentTourId, run]);

    return (
        <TourContext.Provider
            value={{
                startTour,
                startDynamicTour,
                stopTour,
                resetTour,
                isTourActive: run,
                currentTourId,
                currentStepIndex, // Add this
                registerTour,
                registerComponentSteps,
            }}
        >
            {children}
            <Joyride
                continuous={tourConfig.continuous ?? true}
                run={run}
                steps={steps}
                stepIndex={currentStepIndex} // Control the step index
                hideCloseButton={false}
                showProgress={tourConfig.showProgress ?? true}
                showSkipButton={tourConfig.showSkipButton ?? true}
                disableOverlay={tourConfig.disableOverlay ?? false}
                disableScrolling={tourConfig.disableScrolling ?? false}
                styles={tourStyles}
                callback={handleJoyrideCallback}
                locale={{
                    back: 'Back',
                    close: 'Close',
                    last: 'Finish',
                    next: 'Next',
                    skip: 'Skip Tour',
                }}
            />
        </TourContext.Provider>
    );
};