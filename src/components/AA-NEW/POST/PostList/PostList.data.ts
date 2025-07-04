/* eslint-disable @typescript-eslint/no-explicit-any */
import {Post} from '@/types';

export interface PostListProps {
	posts: Post[];
	isLoading: boolean;
	isFetchingMore: boolean;
	error: any;
	hasMore: boolean;
	onLoadMore: () => void;
	mainTopicId?: number;
	subTopicId?: number;
	limit?: number;
	className?: string;
	horizontal?: boolean;
	showArrows?: 'auto' | 'always' | 'hover' | undefined;
	scrollAmount?: number;
	arrowSize?: 'small' | 'medium' | 'large';
	arrowPosition?: 'inside' | 'outside';
}
