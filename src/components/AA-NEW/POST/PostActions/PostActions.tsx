// components/PostActions/PostActions.tsx
import React, { useState } from 'react'
import styles from './PostActions.module.scss'
import { usePostReactions, ReactionType } from '@/hooks/usePostReactions'
import { CommentModal } from '../../MODALS/COMMENTS/CommentModal'
import type { Post } from '@/types'

interface PostActionsProps {
  postId: string
  initialLikeCount: number
  initialDislikeCount: number
  commentCount: number
  initialReaction: ReactionType
  initialHasDo: boolean
  post: Post // Add this prop to pass the full post data
  onCommentClick?: () => void
}

export const PostActions: React.FC<PostActionsProps> = ({
  postId,
  initialLikeCount,
  initialDislikeCount,
  commentCount,
  initialReaction,
  initialHasDo,
  post,
  onCommentClick,
}) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)

  const {
    reaction,
    likeCount,
    dislikeCount,
    hasDo,
    handleReaction,
    handleDoToggle,
  } = usePostReactions({
    postId,
    initialLikeCount,
    initialDislikeCount,
    initialReaction,
    initialHasDo,
  })

  const handleCommentClick = () => {
    setIsCommentModalOpen(true)
    onCommentClick?.() // Call the optional callback if provided
  }

  return (
    <>
      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${reaction === 'like' ? styles.active : ''}`}
          onClick={() => handleReaction('like')}
          aria-label={reaction === 'like' ? 'Remove like' : 'Like'}
          aria-pressed={reaction === 'like'}
        >
          <svg
            fill={reaction === 'like' ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>{likeCount}</span>
        </button>

        <button
          className={`${styles.actionButton} ${reaction === 'dislike' ? `${styles.active} ${styles.dislike}` : ''}`}
          onClick={() => handleReaction('dislike')}
          aria-label={reaction === 'dislike' ? 'Remove dislike' : 'Dislike'}
          aria-pressed={reaction === 'dislike'}
        >
          <svg
            fill={reaction === 'dislike' ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
          <span>{dislikeCount}</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.doButton} ${hasDo ? styles.hasDo : ''}`}
          onClick={handleDoToggle}
          aria-label={hasDo ? 'Mark as not done' : 'Mark as done'}
          aria-pressed={hasDo}
        >
          <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span>{hasDo ? 'Done' : 'Do'}</span>
        </button>

        <button
          className={styles.actionButton}
          onClick={handleCommentClick}
          aria-label={`${commentCount} comments`}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{commentCount}</span>
        </button>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={post}
      />
    </>
  )
}