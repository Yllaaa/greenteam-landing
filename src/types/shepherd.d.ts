/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

declare module 'shepherd.js' {
	export interface StepOptions {
		id?: string;
		title?: string;
		text?: string | string[] | HTMLElement;
		attachTo?: AttachToOptions | string;
		advanceOn?: AdvanceOnOptions;
		beforeShowPromise?: () => Promise<void>;
		buttons?: ButtonConfig[];
		cancelIcon?: {
			enabled?: boolean;
			label?: string;
		};
		classes?: string;
		highlightClass?: string;
		scrollTo?: boolean | ScrollIntoViewOptions;
		scrollToHandler?: (element: HTMLElement) => void;
		showOn?: () => boolean;
		modalOverlayOpeningPadding?: number;
		modalOverlayOpeningRadius?: number;
		floatingUIOptions?: Record<string, any>;
		when?: WhenOptions;
		popperOptions?: Record<string, any>;
	}

	export interface AttachToOptions {
		element: string | HTMLElement | (() => HTMLElement);
		on: PopperPlacement;
	}

	export type PopperPlacement =
		| 'auto'
		| 'auto-start'
		| 'auto-end'
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'right'
		| 'right-start'
		| 'right-end'
		| 'left'
		| 'left-start'
		| 'left-end';

	export interface AdvanceOnOptions {
		selector?: string;
		event?: string;
	}

	export interface ButtonConfig {
		text: string;
		action?: () => void;
		classes?: string;
		disabled?: boolean;
		label?: string;
		secondary?: boolean;
	}

	export interface WhenOptions {
		show?: () => void;
		hide?: () => void;
		complete?: () => void;
		cancel?: () => void;
		destroy?: () => void;
	}

	export interface TourOptions {
		defaultStepOptions?: StepOptions;
		useModalOverlay?: boolean;
		exitOnEsc?: boolean;
		keyboardNavigation?: boolean;
		confirmCancel?: boolean;
		confirmCancelMessage?: string;
		classPrefix?: string;
		tourName?: string;
		steps?: Step[];
		modalContainer?: Element;
	}

	export class Step {
		constructor(tour: Tour, options: StepOptions);
		options: StepOptions;
		id: string;
		tour: Tour;
		el?: HTMLElement;

		show(): Promise<void>;
		hide(): void;
		cancel(): void;
		complete(): void;
		destroy(): void;
		isOpen(): boolean;
		scrollTo(): void;
		updateStepOptions(options: StepOptions): void;
		getElement(): HTMLElement;
		getTarget(): HTMLElement;
		getAttachToOptions(): AttachToOptions;
	}

	export class Tour {
		constructor(options?: TourOptions);

		steps: Step[];
		currentStep?: Step;

		addStep(options: StepOptions): Step;
		addSteps(steps: StepOptions[]): void;
		back(): void;
		cancel(): void;
		complete(): void;
		getById(id: string): Step | undefined;
		getCurrentStep(): Step | undefined;
		hide(): void;
		isActive(): boolean;
		next(): void;
		removeStep(name: string): void;
		show(name?: string | number): void;
		start(): void;

		on(event: string, handler: (...args: any[]) => void): void;
		off(event: string, handler?: (...args: any[]) => void): void;
		once(event: string, handler: (...args: any[]) => void): void;
	}

	const Shepherd: {
		Tour: typeof Tour;
		Step: typeof Step;
	};

	export default Shepherd;
}
