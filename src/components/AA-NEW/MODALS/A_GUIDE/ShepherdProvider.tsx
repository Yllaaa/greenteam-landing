/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ShepherdProvider.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as Shepherd from 'shepherd.js';
import { tourManager } from './tourManager';
import { TourConfig, TourStep } from './tours.config';

interface ShepherdContextType {
    currentTour: TourConfig | null;
    currentStepIndex: number;
    isActive: boolean;
    startTour: (tourId: string) => void;
    startAutoTour: () => void;
    endTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTour: () => void;
}

const ShepherdContext = createContext<ShepherdContextType | undefined>(undefined);

export const useShepherd = () => {
    const context = useContext(ShepherdContext);
    if (!context) {
        throw new Error('useShepherd must be used within a ShepherdProvider');
    }
    return context;
};

export const ShepherdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isActive, setIsActive] = useState(false);
    const [currentTour, setCurrentTour] = useState<TourConfig | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const shepherdTourRef = useRef<Shepherd.Tour | null>(null);
    const waitingForNavigation = useRef(false);

    // Auto-start tours on route change
    useEffect(() => {
        if (!waitingForNavigation.current) {
            const availableTour = tourManager.getNextAvailableTour(pathname);
            if (availableTour && !isActive) {
                // Delay to ensure page is loaded
                setTimeout(() => {
                    startTour(availableTour.id);
                }, 1000);
            }
        }
        waitingForNavigation.current = false;
    }, [pathname]);

    // Function to wait for element
    const waitForElement = (selector: string, timeout = 5000): Promise<HTMLElement> => {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector) as HTMLElement;
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found`));
            }, timeout);
        });
    };

    // Create Shepherd step from tour step
    const createShepherdStep = (step: TourStep, index: number, totalSteps: number): Shepherd.StepOptions => {
        return {
            id: step.id,
            title: step.title,
            text: step.text,
            attachTo: {
                element: step.element,
                on: (step.position || 'bottom') as any
            },
            beforeShowPromise: async function () {
                // Wait for element if specified
                if (step.waitForElement !== false) {
                    try {
                        await waitForElement(step.element);
                    } catch (error : any) {
                        console.warn(`Element ${step.element} not found, skipping... `, error);
                        if (step.skipIfNotFound) {
                            shepherdTourRef.current?.next();
                        }
                    }
                }

                // Add delay if specified
                if (step.delay) {
                    await new Promise(resolve => setTimeout(resolve, step.delay));
                }
            },
            buttons: [
                ...(index > 0 ? [{
                    text: 'Back',
                    action: function () { prevStep(); }
                }] : []),
                {
                    text: 'Skip Tour',
                    action: function () { skipTour(); },
                    classes: 'shepherd-button-secondary'
                },
                {
                    text: index === totalSteps - 1 ? 'Finish' : 'Next',
                    action: function () {
                        if (index === totalSteps - 1) {
                            endTour();
                        } else {
                            nextStep();
                        }
                    }
                }
            ],
            popperOptions: {
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: 'viewport',
                            padding: 10
                        }
                    }
                ]
            }
        };
    };

    const startTour = useCallback((tourId: string) => {
        const tour = tourManager.tours[tourId];
        if (!tour) return;

        // Clean up existing tour
        if (shepherdTourRef.current) {
            shepherdTourRef.current.complete();
        }

        setCurrentTour(tour);
        setCurrentStepIndex(0);
        tourManager.setCurrentTour(tourId);

        // Create new Shepherd tour
        const shepherdTour = new Shepherd.Tour({
            useModalOverlay: true,
            defaultStepOptions: {
                cancelIcon: {
                    enabled: true
                },
                scrollTo: true
            }
        });

        // Handle tour events
        shepherdTour.on('cancel', () => {
            setIsActive(false);
            tourManager.setCurrentTour(null);
        });

        shepherdTourRef.current = shepherdTour;

        // Process first step
        processStep(tour, 0, shepherdTour);
        setIsActive(true);
    }, []);

    const processStep = async (tour: TourConfig, stepIndex: number, shepherdTour: Shepherd.Tour) => {
        if (stepIndex >= tour.steps.length) {
            endTour();
            return;
        }

        const step = tour.steps[stepIndex];
        setCurrentStepIndex(stepIndex);

        // Check if we need to navigate
        if (step.route && step.route !== pathname) {
            waitingForNavigation.current = true;
            // Store tour state before navigation
            sessionStorage.setItem('pendingTour', JSON.stringify({
                tourId: tour.id,
                stepIndex: stepIndex
            }));
            router.push(step.route);
            return;
        }

        // Add step to Shepherd
        const shepherdStep = createShepherdStep(step, stepIndex, tour.steps.length);
        shepherdTour.addStep(shepherdStep);

        if (!shepherdTour.isActive()) {
            shepherdTour.start();
        } else {
            shepherdTour.next();
        }
    };

    const nextStep = useCallback(() => {
        if (!currentTour || !shepherdTourRef.current) return;

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < currentTour.steps.length) {
            processStep(currentTour, nextIndex, shepherdTourRef.current);
        } else {
            endTour();
        }
    }, [currentTour, currentStepIndex]);

    const prevStep = useCallback(() => {
        if (!currentTour || !shepherdTourRef.current || currentStepIndex === 0) return;

        const prevIndex = currentStepIndex - 1;
        processStep(currentTour, prevIndex, shepherdTourRef.current);
    }, [currentTour, currentStepIndex]);

    const endTour = useCallback(() => {
        if (currentTour) {
            tourManager.completeTour(currentTour.id);
        }

        if (shepherdTourRef.current) {
            shepherdTourRef.current.complete();
        }

        setIsActive(false);
        setCurrentTour(null);
        setCurrentStepIndex(0);
        tourManager.setCurrentTour(null);
        sessionStorage.removeItem('pendingTour');
    }, [currentTour]);

    const skipTour = useCallback(() => {
        endTour();
    }, [endTour]);

    const startAutoTour = useCallback(() => {
        const availableTour = tourManager.getNextAvailableTour(pathname);
        if (availableTour) {
            startTour(availableTour.id);
        }
    }, [pathname, startTour]);

    // Resume tour after navigation
    useEffect(() => {
        const pendingTour = sessionStorage.getItem('pendingTour');
        if (pendingTour && !isActive) {
            const { tourId, stepIndex } = JSON.parse(pendingTour);
            const tour = tourManager.tours[tourId];
            if (tour) {
                setCurrentTour(tour);
                setCurrentStepIndex(stepIndex);

                const shepherdTour = new Shepherd.Tour({
                    useModalOverlay: true,
                    defaultStepOptions: {
                        cancelIcon: { enabled: true },
                        scrollTo: true
                    }
                });

                        shepherdTourRef.current = shepherdTour;
        processStep(tour, stepIndex, shepherdTour);
        setIsActive(true);
        sessionStorage.removeItem('pendingTour');
      }
    }
  }, [pathname]);

  return (
    <ShepherdContext.Provider 
      value={{ 
        currentTour,
        currentStepIndex,
        isActive,
        startTour,
        startAutoTour,
        endTour,
        nextStep,
        prevStep,
        skipTour
      }}
    >
      {children}
    </ShepherdContext.Provider>
  );
};