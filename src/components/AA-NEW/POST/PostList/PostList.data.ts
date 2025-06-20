export interface PostListProps {
  initialPage?: number
  limit?: number
  mainTopicId?: number
  subTopicId?: number
  className?: string
  horizontal?: boolean
  showArrows?: 'always' | 'hover' | 'auto'
  scrollAmount?: number
  arrowSize?: 'small' | 'medium' | 'large'
  arrowPosition?: 'inside' | 'outside'
}