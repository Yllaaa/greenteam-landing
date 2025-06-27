/** @format */

'use client';
import axios from 'axios';
import {SubscriptionTier, CurrentTier} from '../types/subscriptionTypes.data';
import {getToken} from '@/Utils/userToken/LocalToken';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1`;

// Create a function to get axios instance with dynamic headers
export const createApiClient = (locale?: string) => {
	const token = getToken();
	const accessToken = token ? token.accessToken : '';

	return axios.create({
		baseURL: API_BASE_URL,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
			...(locale && {'Accept-Language': locale}),
		},
	});
};

// Subscription service
export const subscriptionService = {
	getSubscriptionTiers: async (
		locale?: string
	): Promise<SubscriptionTier[]> => {
		try {
			const apiClient = createApiClient(locale);
			const response = await apiClient.get<SubscriptionTier[]>(
				'/subscriptions/tiers'
			);
			return response.data;
		} catch (error) {
			console.error('Error fetching subscription tiers:', error);
			throw error;
		}
	},
};

export const getCurrentPlan = async (locale?: string): Promise<CurrentTier> => {
	try {
		const apiClient = createApiClient(locale);
		const response = await apiClient.get<CurrentTier>(
			'/subscriptions/my-subscription'
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching current plan:', error);
		throw error;
	}
};
