/** @format */

// hooks/useComponentTour.ts
import {useEffect, useRef, useCallback} from 'react';
import * as Shepherd from 'shepherd.js';

interface ComponentTourStep {
	id: string;
	title: string;
	text: string;
	target: string; // CSS selector relative to component
	position?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
	showOn?: () => boolean;
	buttons?: {
		text: string;
		action: 'next' | 'back' | 'complete' | 'skip';
		primary?: boolean;
	}[];
}

interface UseComponentTourOptions {
	steps: ComponentTourStep[];
	autoStart?: boolean;
	delay?: number;
	onComplete?: () => void;
	onSkip?: () => void;
	saveProgress?: boolean;
	tourId?: string;
}

export const useComponentTour = ({
	steps,
	autoStart = false,
	delay = 500,
	onComplete,
	onSkip,
	saveProgress = true,
	tourId,
}: UseComponentTourOptions) => {
	const tourRef = useRef<Shepherd.Tour | null>(null);
	const componentRef = useRef<HTMLElement | null>(null);

	const createTour = useCallback(() => {
		const tour = new Shepherd.Tour({
			useModalOverlay: true,
			defaultStepOptions: {
				cancelIcon: {
					enabled: true,
				},
				scrollTo: true,
				modalOverlayOpeningPadding: 8,
				popperOptions: {
					modifiers: [
						{
							name: 'preventOverflow',
							options: {
								boundary: 'viewport',
								padding: 10,
							},
						},
					],
				},
			},
		});

		// Add steps
		steps.forEach((step, index) => {
			const buttons = step.buttons || [
				...(index > 0 ? [{text: 'Back', action: 'back' as const}] : []),
				{text: 'Skip', action: 'skip' as const, primary: false},
				{
					text: index === steps.length - 1 ? 'Finish' : 'Next',
					action:
						index === steps.length - 1
							? ('complete' as const)
							: ('next' as const),
					primary: true,
				},
			];

			tour.addStep({
				id: step.id,
				title: step.title,
				text: step.text,
				attachTo: {
					element: () => {
						if (componentRef.current) {
							const element = componentRef.current.querySelector(step.target);
							return element as HTMLElement;
						}
						return document.querySelector(step.target) as HTMLElement;
					},
					on: step.position || 'auto',
				},
				buttons: buttons.map((btn) => ({
					text: btn.text,
					classes: btn.primary
						? 'shepherd-button-primary'
						: 'shepherd-button-secondary',
					action: function () {
						switch (btn.action) {
							case 'next':
								tour.next();
								break;
							case 'back':
								tour.back();
								break;
							case 'complete':
								tour.complete();
								break;
							case 'skip':
								tour.cancel();
								break;
						}
					},
				})),
				showOn: step.showOn,
				beforeShowPromise: function () {
					return new Promise((resolve) => {
						// Wait for element to be available
						const checkElement = () => {
							const element =
								componentRef.current?.querySelector(step.target) ||
								document.querySelector(step.target);
							if (element) {
								resolve(undefined);
							} else {
								setTimeout(checkElement, 100);
							}
						};
						checkElement();
					});
				},
			});
		});

		// Handle events
		tour.on('complete', () => {
			if (saveProgress && tourId) {
				localStorage.setItem(`tour_completed_${tourId}`, 'true');
			}
			onComplete?.();
		});

		tour.on('cancel', () => {
			onSkip?.();
		});

		tourRef.current = tour;
		return tour;
	}, [steps, onComplete, onSkip, saveProgress, tourId]);

	const startTour = useCallback(() => {
		if (!tourRef.current) {
			createTour();
		}
		tourRef.current?.start();
	}, [createTour]);

	const endTour = useCallback(() => {
		tourRef.current?.complete();
	}, []);

	const setComponentElement = useCallback((element: HTMLElement | null) => {
		componentRef.current = element;
	}, []);

	// Auto start logic
	useEffect(() => {
		if (autoStart && tourId) {
			const isCompleted = localStorage.getItem(`tour_completed_${tourId}`);
			if (!isCompleted) {
				const timer = setTimeout(() => {
					startTour();
				}, delay);
				return () => clearTimeout(timer);
			}
		}
	}, [autoStart, tourId, delay, startTour]);

	// Cleanup
	useEffect(() => {
		return () => {
			tourRef.current?.complete();
		};
	}, []);

	const resetTour = useCallback(() => {
		if (tourId) {
			localStorage.removeItem(`tour_completed_${tourId}`);
		}
	}, [tourId]);

	return {
		startTour,
		endTour,
		resetTour,
		setComponentElement,
		isActive: () => tourRef.current?.isActive() || false,
	};
};
