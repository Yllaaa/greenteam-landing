/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CommentModal/CommentModal.tsx
import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { formatDistanceToNow } from 'date-fns'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import {
    FaFilePdf,
    FaTimes,
    FaHeart,
    FaRegHeart,
    FaReply,
    FaTrash,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa'
import { BiComment } from 'react-icons/bi'
import { IoSend } from 'react-icons/io5'
import styles from './CommentModal.module.scss'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import {
    useGetCommentsQuery,
    usePostCommentMutation,
    usePostReplyMutation,
    useDeleteCommentMutation,
    useDeleteReplyMutation,
    useReactionCommentMutation,
    useLazyGetRepliesQuery,
} from '@/services/api'
import type { Post, ChallengePost, Comment as CommentType } from '@/types'
import { useAppSelector } from '@/store/hooks'
import { useInfiniteScroll } from '@/hooks/userInfiniteScroll'

interface CommentModalProps {
    isOpen: boolean
    onClose: () => void
    post?: Post
    challenge?: ChallengePost
}

interface CommentWithReplies extends CommentType {
    replies?: CommentType[]
    showReplies?: boolean
    showReplyInput?: boolean
}

// Helper functions to normalize data access
const getItemData = (post?: Post, challenge?: ChallengePost) => {
    if (challenge) {
        return {
            id: challenge.id,
            content: challenge.content,
            createdAt: challenge.createdAt,
            media: challenge.media,
            authorName: challenge.creator.name,
            authorAvatar: challenge.creator.avatar,
            type: 'challenge' as const
        }
    }

    if (post) {
        return {
            id: post.post.id,
            content: post.post.content,
            createdAt: post.post.createdAt,
            media: post.media,
            authorName: post.author.name,
            authorAvatar: post.author.avatar,
            type: 'post' as const
        }
    }

    return null
}

export const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, post, challenge }) => {
    const t = useTranslations('web.comments')
    const currentUser = useAppSelector((state) => state.login.user?.user)
    const [comments, setComments] = useState<CommentWithReplies[]>([])
    const [newComment, setNewComment] = useState('')
    const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({})
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const modalRef = useRef<HTMLDivElement>(null)

    // Get normalized item data
    const itemData = getItemData(post, challenge)
    const itemId = itemData?.id ?? ''

    // API hooks
    const { data: commentsData, isLoading: loadingComments, isFetching } = useGetCommentsQuery(
        { postId: itemId, page, limit: 10 },
        { skip: !isOpen || !itemId }
    )

    const [getReplies] = useLazyGetRepliesQuery()
    const [postComment] = usePostCommentMutation()
    const [postReply] = usePostReplyMutation()
    const [deleteComment] = useDeleteCommentMutation()
    const [deleteReply] = useDeleteReplyMutation()
    const [reactionComment] = useReactionCommentMutation()

    // Infinite scroll hook
    const { ref: infiniteScrollRef } = useInfiniteScroll({
        loading: isFetching,
        hasMore: hasMore,
        onLoadMore: () => setPage(prev => prev + 1),
    })

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setComments([])
            setPage(1)
            setHasMore(true)
            setNewComment('')
            setReplyTexts({})
        }
    }, [isOpen])

    // Update comments when data changes
    useEffect(() => {
        if (commentsData && Array.isArray(commentsData)) {
            setComments(prev => {
                const newComments = page === 1 ? [] : [...prev]
                const typedCommentsData = commentsData as CommentType[]

                typedCommentsData.forEach((comment) => {
                    if (!newComments.find(c => c.id === comment.id)) {
                        newComments.push({
                            ...comment,
                            replies: [],
                            showReplies: false,
                            showReplyInput: false
                        })
                    }
                })

                setHasMore(typedCommentsData.length >= 10)

                return newComments
            })
        }
    }, [commentsData, page])

    const handlePostComment = async () => {
        if (!newComment.trim() || !itemId) return

        try {
            const result = await postComment({
                postId: itemId,
                content: newComment.trim()
            }).unwrap()

            if (result) {
                setComments(prev => [{
                    ...result,
                    replies: [],
                    showReplies: false,
                    showReplyInput: false
                }, ...prev])
            }

            setNewComment('')
        } catch (error) {
            console.error('Failed to post comment:', error)
        }
    }

    const handlePostReply = async (commentId: string) => {
        const replyText = replyTexts[commentId]
        if (!replyText?.trim() || !itemId) return

        try {
            await postReply({
                postId: itemId,
                commentId,
                content: replyText.trim()
            }).unwrap()
            setReplyTexts(prev => ({ ...prev, [commentId]: '' }))
            toggleReplies(commentId, true)
        } catch (error) {
            console.error('Failed to post reply:', error)
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm(t('confirmDelete')) || !itemId) return

        try {
            await deleteComment({
                postId: itemId,
                commentId
            }).unwrap()
            setComments(prev => prev.filter(c => c.id !== commentId))
        } catch (error) {
            console.error('Failed to delete comment:', error)
        }
    }

    const handleDeleteReply = async (commentId: string, replyId: string) => {
        if (!confirm(t('confirmDelete')) || !itemId) return

        try {
            await deleteReply({
                postId: itemId,
                commentId,
                replyId
            }).unwrap()
            setComments(prev => prev.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies?.filter(r => r.id !== replyId) || []
                    }
                }
                return comment
            }))
        } catch (error) {
            console.error('Failed to delete reply:', error)
        }
    }

    const handleReaction = async (type: 'comment' | 'reply', id: string, reactionType: 'like') => {
        try {
            await reactionComment({
                type,
                id,
                reactionType
            }).unwrap()
        } catch (error) {
            console.error('Failed to update reaction:', error)
        }
    }

    const toggleReplies = async (commentId: string, forceShow = false) => {
        const comment = comments.find(c => c.id === commentId)
        if (!comment || !itemId) return

        if (!comment.showReplies || forceShow) {
            try {
                const data = await getReplies({
                    postId: itemId,
                    commentId,
                    page: 0,
                    limit: 5
                }).unwrap()

                setComments(prev => prev.map(c => {
                    if (c.id === commentId) {
                        return { ...c, replies: data as CommentType[], showReplies: true }
                    }
                    return c
                }))
            } catch (error) {
                console.error('Failed to load replies:', error)
            }
        } else {
            setComments(prev => prev.map(c => {
                if (c.id === commentId) {
                    return { ...c, showReplies: !c.showReplies }
                }
                return c
            }))
        }
    }

    const toggleReplyInput = (commentId: string) => {
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                return { ...c, showReplyInput: !c.showReplyInput }
            }
            return c
        }))
    }

    const handlePdfClick = (pdfUrl: string) => {
        window.open(pdfUrl, '_blank')
    }

    const renderMediaSlide = (media: any, index: number) => {
        if (media.mediaType === 'image') {
            return (
                <div className={styles.imageWrapper}>
                    <Image
                        src={media.mediaUrl}
                        alt={`${itemData?.type || 'Post'} media ${index + 1}`}
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            )
        } else if (media.mediaType === 'video') {
            return (
                <video
                    src={media.mediaUrl}
                    controls
                    className={styles.video}
                />
            )
        } else if (media.mediaType === 'document') {
            return (
                <div
                    className={styles.pdfContainer}
                    onClick={() => handlePdfClick(media.mediaUrl)}
                >
                    <FaFilePdf className={styles.pdfIcon} size={80} />
                    <p className={styles.pdfText}>{t('clickToViewPdf')}</p>
                    <span className={styles.pdfFileName}>
                        {media.mediaUrl.split('/').pop() || 'document.pdf'}
                    </span>
                </div>
            )
        }
        return null
    }

    if (!isOpen || !itemData) return null

    const hasMedia = itemData.media && itemData.media.length > 0

    return ReactDOM.createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div
                ref={modalRef}
                className={styles.modal}
                onClick={e => e.stopPropagation()}
            >
                <button className={styles.closeButton} onClick={onClose} aria-label={t('aria.closeModal')}>
                    <FaTimes size={20} />
                </button>

                <div className={styles.content}>
                    {/* Left side - Media or Content */}
                    <div className={`${styles.leftSide} ${!hasMedia ? styles.noMedia : ''}`}>
                        {hasMedia ? (
                            <div className={styles.mediaContainer}>
                                {itemData.media.length > 1 ? (
                                    <div className={styles.swiperContainer}>
                                        <Swiper
                                            modules={[Navigation, Pagination]}
                                            navigation={true}
                                            pagination={{
                                                clickable: true,
                                                el: '.swiper-pagination-custom'
                                            }}
                                            className={styles.swiper}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            loop={true}
                                        >
                                            {itemData.media.map((media, index) => (
                                                <SwiperSlide key={media.id} className={styles.slide}>
                                                    {renderMediaSlide(media, index)}
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <div className="swiper-pagination-custom"></div>
                                    </div>
                                ) : (
                                    <div className={styles.singleMediaWrapper}>
                                        {renderMediaSlide(itemData.media[0], 0)}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles.postContent}>
                                <p>{itemData.content}</p>
                            </div>
                        )}
                    </div>

                    {/* Right side - Comments */}
                    <div className={styles.rightSide}>
                        {/* Post info */}
                        <div className={styles.postInfo}>
                            <div className={styles.authorInfo}>
                                {itemData.authorAvatar && (
                                    <Image
                                        src={itemData.authorAvatar}
                                        alt={itemData.authorName || ''}
                                        width={40}
                                        height={40}
                                        className={styles.avatar}
                                    />
                                )}
                                <div>
                                    <h4>{itemData.authorName}</h4>
                                    <span className={styles.timestamp}>
                                        {formatDistanceToNow(new Date(itemData.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                            {hasMedia && <p className={styles.postContentSmall}>{itemData.content}</p>}
                        </div>

                        {/* Comments section */}
                        <div className={styles.commentsSection}>
                            {loadingComments && page === 1 ? (
                                <div className={styles.loading}>{t('loading')}</div>
                            ) : (
                                <>
                                    {comments.length === 0 ? (
                                        <div className={styles.noComments}>
                                            <BiComment size={48} className={styles.noCommentsIcon} />
                                            <p>{t('noComments')}</p>
                                            <p className={styles.beFirst}>{t('beFirstToComment')}</p>
                                        </div>
                                    ) : (
                                        comments.map(comment => (
                                            <div key={comment.id} className={styles.commentWrapper}>
                                                <div className={styles.comment}>
                                                    <div className={styles.commentHeader}>
                                                        <div className={styles.commentAuthor}>
                                                            {comment.author.avatar && (
                                                                <Image
                                                                    src={comment.author.avatar}
                                                                    alt={comment.author.fullName}
                                                                    width={32}
                                                                    height={32}
                                                                    className={styles.commentAvatar}
                                                                />
                                                            )}
                                                            <span className={styles.authorName}>{comment.author.fullName}</span>
                                                        </div>
                                                        {currentUser?.id === comment.author.id && (
                                                            <button
                                                                className={styles.deleteButton}
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                aria-label={t('aria.deleteComment')}
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <p className={styles.commentContent}>{comment.content}</p>

                                                    <div className={styles.commentActions}>
                                                        <button
                                                            className={`${styles.actionButton} ${comment.userReaction === 'like' ? styles.active : ''}`}
                                                            onClick={() => handleReaction('comment', comment.id, 'like')}
                                                            aria-label={comment.userReaction === 'like' ? t('aria.unlikeComment') : t('aria.likeComment')}
                                                        >
                                                            {comment.userReaction === 'like' ? (
                                                                <FaHeart size={16} />
                                                            ) : (
                                                                <FaRegHeart size={16} />
                                                            )}
                                                            <span>{parseInt(comment.likeCount) > 0 && comment.likeCount}</span>
                                                        </button>
                                                        <button
                                                            className={styles.actionButton}
                                                            onClick={() => toggleReplyInput(comment.id)}
                                                            aria-label={t('reply')}
                                                        >
                                                            <FaReply size={14} />
                                                            <span>{t('reply')}</span>
                                                        </button>
                                                        {comment.replyCount > 0 && (
                                                            <button
                                                                className={styles.actionButton}
                                                                onClick={() => toggleReplies(comment.id)}
                                                                aria-label={comment.showReplies ? t('aria.closeReplies') : t('aria.openReplies')}
                                                            >
                                                                {comment.showReplies ? (
                                                                    <FaChevronUp size={14} />
                                                                ) : (
                                                                    <FaChevronDown size={14} />
                                                                )}
                                                                <span>
                                                                    {comment.showReplies ? t('hideReplies') : t('viewReplies', { count: comment.replyCount })}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Reply input */}
                                                    {comment.showReplyInput && (
                                                        <div className={styles.replyInputWrapper}>
                                                            <input
                                                                type="text"
                                                                placeholder={t('writeReply')}
                                                                value={replyTexts[comment.id] || ''}
                                                                onChange={e => setReplyTexts(prev => ({
                                                                    ...prev,
                                                                    [comment.id]: e.target.value
                                                                }))}
                                                                onKeyPress={e => {
                                                                    if (e.key === 'Enter') handlePostReply(comment.id)
                                                                }}
                                                                className={styles.replyInput}
                                                                aria-label={t('aria.replyInput')}
                                                            />
                                                            <button
                                                                className={styles.sendButton}
                                                                onClick={() => handlePostReply(comment.id)}
                                                                disabled={!replyTexts[comment.id]?.trim()}
                                                                aria-label={t('aria.sendReply')}
                                                            >
                                                                <IoSend size={18} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Replies */}
                                                    {comment.showReplies && comment.replies && comment.replies.length > 0 && (
                                                        <div className={styles.replies}>
                                                            {comment.replies.map(reply => (
                                                                <div key={reply.id} className={styles.reply}>
                                                                    <div className={styles.replyHeader}>
                                                                        <span className={styles.replyAuthor}>{reply.author.fullName}</span>
                                                                        {currentUser?.id === reply.author.id && (
                                                                            <button
                                                                                className={styles.deleteButton}
                                                                                onClick={() => handleDeleteReply(comment.id, reply.id)}
                                                                                aria-label={t('aria.deleteReply')}
                                                                            >
                                                                                <FaTrash size={12} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <p className={styles.replyContent}>{reply.content}</p>
                                                                    <button
                                                                        className={`${styles.actionButton} ${reply.userReaction === 'like' ? styles.active : ''}`}
                                                                        onClick={() => handleReaction('reply', reply.id, 'like')}
                                                                        aria-label={reply.userReaction === 'like' ? t('aria.unlikeReply') : t('aria.likeReply')}
                                                                    >
                                                                        {reply.userReaction === 'like' ? (
                                                                            <FaHeart size={14} />
                                                                        ) : (
                                                                            <FaRegHeart size={14} />
                                                                        )}
                                                                        <span>{parseInt(reply.likeCount) > 0 && reply.likeCount}</span>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {/* Infinite scroll trigger */}
                                    {hasMore && comments.length > 0 && (
                                        <div ref={infiniteScrollRef} className={styles.loadingMore}>
                                            {isFetching && <span>{t('loadingMore')}</span>}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* New comment input */}
                        <div className={styles.newCommentSection}>
                            <input
                                type="text"
                                placeholder={t('writeComment')}
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') handlePostComment()
                                }}
                                className={styles.commentInput}
                                aria-label={t('aria.commentInput')}
                            />
                            <button
                                className={styles.sendButton}
                                onClick={handlePostComment}
                                disabled={!newComment.trim()}
                                aria-label={t('aria.sendComment')}
                            >
                                <IoSend size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}