/** @format */

// services/tourManager.ts
import {tours, TourConfig} from './tours.config';

class TourManager {
	public tours: {[key: string]: TourConfig};
	private completedTours: Set<string>;
	private currentTour: string | null = null;
	private tourVersion: Record<string, string> = {};

    constructor() {
			this.tours = tours; // assuming tours is defined somewhere
			// Load completed tours from localStorage
			if (typeof window !== 'undefined') {
				const saved = localStorage.getItem('completedTours');
				this.completedTours = new Set(saved ? JSON.parse(saved) : []);

				const versions = localStorage.getItem('tourVersions');
				this.tourVersion = versions ? JSON.parse(versions) : {};
			} else {
				this.completedTours = new Set();
			}
		}

	// Get tours available for current route
	getToursForRoute(route: string): TourConfig[] {
		return Object.values(tours).filter(
			(tour) => tour.routes.includes(route) || tour.routes.includes('*')
		);
	}

	// Check if tour should be shown
	shouldShowTour(tourId: string): boolean {
		const tour = tours[tourId];
		if (!tour) return false;

		// Check if already completed (unless version changed)
		if (this.isCompleted(tourId) && !this.hasVersionChanged(tourId)) {
			return false;
		}

		// Check prerequisites
		if (tour.prerequisites) {
			const allPrereqsMet = tour.prerequisites.every((prereq) =>
				this.isCompleted(prereq)
			);
			if (!allPrereqsMet) return false;
		}

		return true;
	}

	// Check if tour is completed
	isCompleted(tourId: string): boolean {
		return this.completedTours.has(tourId);
	}

	// Check if tour version changed
	hasVersionChanged(tourId: string): boolean {
		const tour = tours[tourId];
		if (!tour?.version) return false;
		return this.tourVersion[tourId] !== tour.version;
	}

	// Mark tour as completed
	completeTour(tourId: string): void {
		this.completedTours.add(tourId);
		const tour = tours[tourId];
		if (tour?.version) {
			this.tourVersion[tourId] = tour.version;
		}
		this.save();
	}

	// Reset tour progress
	resetTour(tourId: string): void {
		this.completedTours.delete(tourId);
		delete this.tourVersion[tourId];
		this.save();
	}

	// Reset all tours
	resetAllTours(): void {
		this.completedTours.clear();
		this.tourVersion = {};
		this.save();
	}

	// Get next available tour
	getNextAvailableTour(currentRoute: string): TourConfig | null {
		const availableTours = this.getToursForRoute(currentRoute);
		return availableTours.find((tour) => this.shouldShowTour(tour.id)) || null;
	}

	// Set current tour
	setCurrentTour(tourId: string | null): void {
		this.currentTour = tourId;
	}

	// Get current tour
	getCurrentTour(): string | null {
		return this.currentTour;
	}

	// Save to localStorage
	private save(): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem(
				'completedTours',
				JSON.stringify([...this.completedTours])
			);
			localStorage.setItem('tourVersions', JSON.stringify(this.tourVersion));
		}
	}
}

export const tourManager = new TourManager();
