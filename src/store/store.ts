/** @format */

// store/store.ts
import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {api} from '@/services/api';
import userSignupSlice from './features/signup/userSignupSlice';
import userLoginSlice from './features/login/userLoginSlice';
import currentCommunity from './features/communitySection/currentCommunity';
import updateState from './features/update/updateSlice';
import pageDetails from './features/pageDetails/pageDetails';
import groupState from './features/groupState/groupState';
import groupEdit from './features/groupState/editGroupSettings';
import pageFilterSlice from './features/pageFilter/pageFillterSlice';
import categoryReducer from './features/posts/categorySlice';
import forumReducer from './features/forum/forumSlice'; // Add this

export const store = () => {
	const storeInstance = configureStore({
		reducer: {
			// Add RTK Query reducer
			[api.reducerPath]: api.reducer,
			// Your existing reducers
			signup: userSignupSlice,
			login: userLoginSlice,
			currentCommunity: currentCommunity,
			updateState: updateState,
			pageState: pageDetails,
			groupState: groupState,
			groupEdit: groupEdit,
			pageFilter: pageFilterSlice,
			category: categoryReducer,
			forum: forumReducer, // Add this
		},
		// Add the RTK Query middleware
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					// Ignore these action types
					ignoredActions: [
						// RTK Query actions
						'api/executeQuery/pending',
						'api/executeQuery/fulfilled',
						'api/executeQuery/rejected',
						'api/executeMutation/pending',
						'api/executeMutation/fulfilled',
						'api/executeMutation/rejected',
						'api/executeQuery/started',
						'api/executeMutation/started',
					],
					// Ignore meta.baseQueryMeta paths
					ignoredActionPaths: [
						'meta.arg',
						'meta.baseQueryMeta',
						'meta.baseQueryMeta.request',
						'meta.baseQueryMeta.response',
						'payload.request',
						'payload.response',
					],
					// Ignore these paths in the state
					ignoredPaths: [
						'api.queries',
						'api.mutations',
						'api.provided',
						'api.subscriptions',
						'api.config',
					],
				},
			}).concat(api.middleware),
		devTools: process.env.NODE_ENV !== 'production',
	});

	// Enable refetchOnFocus/refetchOnReconnect behaviors
	setupListeners(storeInstance.dispatch);

	return storeInstance;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
