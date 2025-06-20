// components/ForumActions/ForumActions.tsx
"use client"
import React, { useState, useCallback } from "react"
import styles from "./ForumActions.module.scss"
import { AiFillLike, AiFillDislike, AiOutlineLike, AiOutlineDislike } from "react-icons/ai"
import { FaComment } from "react-icons/fa"
import { BsPencilSquare, BsFillPencilFill } from "react-icons/bs"
import { useReactionForumMutation } from "@/services/api"
import { useTranslations } from "next-intl"
import ToastNot from '@/Utils/ToastNotification/ToastNot'

interface ForumActionsProps {
    forumId: string
    section: string
    initialLikeCount: number
    initialDislikeCount: number
    initialSignCount: number
    commentCount: number
    initialReaction: 'like' | 'dislike' | 'sign' | null
    onCommentClick: () => void
}

export const ForumActions: React.FC<ForumActionsProps> = ({
    forumId,
    section,
    initialLikeCount,
    initialDislikeCount,
    initialSignCount,
    commentCount,
    initialReaction,
    onCommentClick,
}) => {
    const t = useTranslations("web.main.forums")
    const tCommon = useTranslations("common")

    const [likeCount, setLikeCount] = useState(initialLikeCount)
    const [dislikeCount, setDislikeCount] = useState(initialDislikeCount)
    const [signCount, setSignCount] = useState(initialSignCount)
    const [userReaction, setUserReaction] = useState(initialReaction)
    const [isLoading, setIsLoading] = useState(false)

    const [reactionForum] = useReactionForumMutation()

    const handleReaction = useCallback(async (reactionType: 'like' | 'dislike' | 'sign') => {
        if (isLoading) return // Prevent multiple clicks

        setIsLoading(true)

        // Store previous state for rollback
        const prevReaction = userReaction
        const prevCounts = { likeCount, dislikeCount, signCount }

        // Optimistic update
        if (userReaction === reactionType) {
            // Remove reaction
            setUserReaction(null)
            if (reactionType === 'like') setLikeCount(prev => Math.max(0, prev - 1))
            else if (reactionType === 'dislike') setDislikeCount(prev => Math.max(0, prev - 1))
            else if (reactionType === 'sign') setSignCount(prev => Math.max(0, prev - 1))
        } else {
            // Remove previous reaction count
            if (userReaction === 'like') setLikeCount(prev => Math.max(0, prev - 1))
            else if (userReaction === 'dislike') setDislikeCount(prev => Math.max(0, prev - 1))
            else if (userReaction === 'sign') setSignCount(prev => Math.max(0, prev - 1))

            // Add new reaction
            setUserReaction(reactionType)
            if (reactionType === 'like') setLikeCount(prev => prev + 1)
            else if (reactionType === 'dislike') setDislikeCount(prev => prev + 1)
            else if (reactionType === 'sign') setSignCount(prev => prev + 1)
        }

        try {
            await reactionForum({
                type: 'forum_publication',
                id: forumId,
                reactionType
            }).unwrap()
        } catch (error) {
            console.error("Reaction error:", error)

            // Revert on error
            setUserReaction(prevReaction)
            setLikeCount(prevCounts.likeCount)
            setDislikeCount(prevCounts.dislikeCount)
            setSignCount(prevCounts.signCount)

            // Show error toast
            ToastNot(tCommon("errors.failedToUpdateReaction") || "Failed to update reaction")
        } finally {
            setIsLoading(false)
        }
    }, [userReaction, likeCount, dislikeCount, signCount, forumId, reactionForum, isLoading, tCommon])

    // Determine which section we're in
    const isNeedSection = section === 'need'
    const isDreamSection = section === 'dream'
    const isDoubtSection = section === 'doubt'

    return (
        <div className={styles.actions}>
            {/* Like Button - Show for dream and doubt sections */}
            {(isDreamSection || isDoubtSection) && (
                <button
                    className={`${styles.actionBtn} ${userReaction === 'like' ? styles.activeLike : ''}`}
                    onClick={() => handleReaction('like')}
                    disabled={isLoading}
                    aria-label={`Like ${likeCount}`}
                >
                    {userReaction === 'like' ? <AiFillLike /> : <AiOutlineLike />}
                    <span>{likeCount}</span>
                </button>
            )}

            {/* Sign Button - Show for need section */}
            {isNeedSection && (
                <button
                    className={`${styles.actionBtn} ${userReaction === 'sign' ? styles.activeSign : ''}`}
                    onClick={() => handleReaction('sign')}
                    disabled={isLoading}
                    aria-label={`Sign ${signCount}`}
                >
                    {userReaction === 'sign' ? <BsFillPencilFill /> : <BsPencilSquare />}
                    <span>{signCount} {t("sign")}</span>
                </button>
            )}

            {/* Dislike Button - Always show */}
            <button
                className={`${styles.actionBtn} ${userReaction === 'dislike' ? styles.activeDislike : ''}`}
                onClick={() => handleReaction('dislike')}
                disabled={isLoading}
                aria-label={`Dislike ${dislikeCount}`}
            >
                {userReaction === 'dislike' ? <AiFillDislike /> : <AiOutlineDislike />}
                <span>{dislikeCount}</span>
            </button>

            {/* Comment Button - Always show */}
            <button
                className={`${styles.actionBtn} ${styles.commentBtn}`}
                onClick={onCommentClick}
                aria-label={`Comments ${commentCount}`}
            >
                <FaComment />
                <span>{commentCount}</span>
            </button>
        </div>
    )
}