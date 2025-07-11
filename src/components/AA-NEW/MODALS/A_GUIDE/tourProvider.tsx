// components/TourProvider/GlobalTourProvider.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import Joyride, { CallBackProps, STATUS, Step, Styles, EVENTS, ACTIONS } from 'react-joyride';
import { tourRegistry, TourConfig, TourStep } from './tourRegistry';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Extend TourStep to include route
interface ExtendedTourStep extends TourStep {
    route?: string;
}

interface TourContextType {
    startTour: (tourId: string, startIndex?: number) => void;
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
        maxWidth: 600,
        borderRadius: 3,
        border: '1px solid rgba(1, 114, 203, 0.10)',
        background: '#1A1E1C',
        backdropFilter: 'blur(4px)',
        boxShadow: 'none',
        borderLeft: '3px solid transparent',
        borderImage: 'linear-gradient(90deg, #74B243 0%, #96B032 100%)',
        borderImageSlice: 1,
        backgroundImage: 'linear-gradient(#1A1E1C, #1A1E1C), linear-gradient(90deg, #74B243 0%, #96B032 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
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
        background: 'linear-gradient(90deg, #307040 0%, #74B243 45.5%, #96B032 80%)',
        borderRadius: 3,
        color: '#ffffff',
        fontSize: '0.875rem',
        fontWeight: 500,
        padding: '0.625rem 1.25rem',
        border: 'none',
    },
    buttonBack: {
        display: 'none',
        color: '#fff',
        background: '#063',
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
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [tourConfig, setTourConfig] = useState<Partial<TourConfig>>({});
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const startTourRef = useRef<(tourId: string, startIndex?: number) => void>(null);

    const handleJoyrideCallback = useCallback((data: CallBackProps) => {
        const { status, index, type, action } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        // Handle navigation for steps with routes
        if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT) {
            const nextStepIndex = index + 1;
            const nextStep = steps[nextStepIndex] as ExtendedTourStep;

            if (nextStep?.route) {
                // Save tour state before navigation
                const tourState = {
                    tourId: currentTourId,
                    stepIndex: nextStepIndex,
                    timestamp: Date.now()
                };

                // Store in sessionStorage
                sessionStorage.setItem('tourState', JSON.stringify(tourState));

                // Stop current tour
                setRun(false);

                // Navigate to the new route
                router.push(nextStep.route);
                return;
            }
        }

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
            setCurrentStepIndex(0);
            setTourConfig({});

            // Clear any tour state
            sessionStorage.removeItem('tourState');
        }
    }, [currentTourId, steps, router]);

    const startTour = useCallback((tourId: string, startIndex: number = 0) => {
        console.log(`startTour called with tourId: ${tourId}, startIndex: ${startIndex}`);
        const tour = tourRegistry.getTour(tourId);
        console.log('Tour found:', tour);

        if (tour && tour.steps.length > 0) {
            console.log('Setting tour steps:', tour.steps);
            setSteps(tour.steps as Step[]);
            setCurrentTourId(tourId);
            setCurrentStepIndex(startIndex);
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
            setCurrentStepIndex(0);
            setRun(true);
        }
    }, []);

    const stopTour = useCallback(() => {
        setRun(false);
        setSteps([]);
        setCurrentTourId(null);
        setCurrentStepIndex(0);
        setTourConfig({});
        sessionStorage.removeItem('tourState');
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

    // Check for tour state after navigation
    useEffect(() => {
        const checkTourState = () => {
            // Check sessionStorage for tour state
            const savedState = sessionStorage.getItem('tourState');

            if (savedState) {
                try {
                    const { tourId, stepIndex, timestamp } = JSON.parse(savedState);

                    // Check if the state is recent (within 30 seconds)
                    if (Date.now() - timestamp < 30000) {
                        console.log(`Resuming tour ${tourId} at step ${stepIndex}`);

                        // Wait for page elements to load
                        setTimeout(() => {
                            startTour(tourId, stepIndex);
                            sessionStorage.removeItem('tourState');
                        }, 1500);

                        return true;
                    } else {
                        sessionStorage.removeItem('tourState');
                    }
                } catch (error) {
                    console.error('Error parsing tour state:', error);
                    sessionStorage.removeItem('tourState');
                }
            }

            // Check URL params as fallback
            const tourParam = searchParams.get('tour');
            const stepParam = searchParams.get('step');

            if (tourParam && stepParam) {
                const stepIndex = parseInt(stepParam, 10);

                setTimeout(() => {
                    startTour(tourParam, stepIndex);

                    // Clean up URL params
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('tour');
                    newParams.delete('step');
                    router.replace(`${pathname}?${newParams.toString()}`);
                }, 1500);

                return true;
            }

            return false;
        };

        const hasResumedTour = checkTourState();

        // Check for auto-start tours only if we haven't resumed a tour
        if (!hasResumedTour) {
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
        }
    }, [pathname, currentTourId, run, searchParams, router, startTour]);

    return (
        <TourContext.Provider
            value={{
                startTour,
                startDynamicTour,
                stopTour,
                resetTour,
                isTourActive: run,
                currentTourId,
                currentStepIndex,
                registerTour,
                registerComponentSteps,
            }}
        >
            {children}

            <Joyride
                continuous={tourConfig.continuous ?? true}
                run={run}
                steps={steps}
                stepIndex={currentStepIndex}
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
                    open: 'Open', // Add this
                }}
            />
        </TourContext.Provider>
    );
};