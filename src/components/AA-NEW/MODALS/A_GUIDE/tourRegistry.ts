/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */

// config/tours/tourRegistry.ts
export interface TourStep {
	target: string;
	content: string;
	title: string;
	placement?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
	disableBeacon?: boolean;
	spotlightClicks?: boolean;
	styles?: any;
	locale?: any;
}

export interface TourConfig {
	id: string;
	name: string;
	steps: TourStep[];
	autoStart?: boolean;
	startDelay?: number;
	showProgress?: boolean;
	showSkipButton?: boolean;
	continuous?: boolean;
	disableOverlay?: boolean;
	disableScrolling?: boolean;
}

class TourRegistry {
	private tours: Map<string, TourConfig> = new Map();
	private componentSteps: Map<string, TourStep[]> = new Map();

	// Register a complete tour
	registerTour(tour: TourConfig) {
		this.tours.set(tour.id, tour);
	}

	// Register steps for a specific component
	registerComponentSteps(componentId: string, steps: TourStep[]) {
		this.componentSteps.set(componentId, steps);
	}

	// Get tour by ID
	getTour(tourId: string): TourConfig | undefined {
		return this.tours.get(tourId);
	}

	// Get all registered tours
	getAllTours(): TourConfig[] {
		return Array.from(this.tours.values());
	}

	// Build a dynamic tour from component steps
	buildDynamicTour(componentIds: string[]): TourStep[] {
		const steps: TourStep[] = [];
		componentIds.forEach((id) => {
			const componentSteps = this.componentSteps.get(id);
			if (componentSteps) {
				steps.push(...componentSteps);
			}
		});
		return steps;
	}

	// Clear all tours
	clear() {
		this.tours.clear();
		this.componentSteps.clear();
	}
}

export const tourRegistry = new TourRegistry();
