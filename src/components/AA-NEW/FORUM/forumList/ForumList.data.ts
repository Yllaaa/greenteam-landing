// components/ForumList/ForumList.data.ts
export interface ForumListProps {
	initialPage?: number;
	limit?: number;
	section?: 'doubt' | 'need' | 'dream' | 'all';
	className?: string;
	horizontal?: boolean;
	showArrows?: 'auto' | 'always' | 'hover';
	scrollAmount?: number;
	arrowSize?: 'small' | 'medium' | 'large';
	arrowPosition?: 'inside' | 'outside';
}
