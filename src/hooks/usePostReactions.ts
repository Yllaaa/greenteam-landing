/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/usePostReactions.ts (Enhanced version)
import { useState, useCallback, useEffect } from "react"
import { useReactionPostMutation } from "@/services/api"

export type ReactionType = "like" | "dislike" | null
export type ActionType = "like" | "dislike" | "do"

interface UsePostReactionsProps {
  postId: string
  initialLikeCount: number
  initialDislikeCount: number
  initialDoCount?: number
  initialReaction: ReactionType
  initialHasDo: boolean
}

export const usePostReactions = ({
  postId,
  initialLikeCount,
  initialDislikeCount,
  initialDoCount = 0,
  initialReaction,
  initialHasDo,
}: UsePostReactionsProps) => {
  const [reaction, setReaction] = useState(initialReaction)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount)
  const [doCount, setDoCount] = useState(initialDoCount)
  const [hasDo, setHasDo] = useState(initialHasDo)

  const [reactionPost, { isLoading, data }] = useReactionPostMutation()

  // Update counts from server response
  useEffect(() => {
    if (data?.counts) {
      setLikeCount(data.counts.like)
      setDislikeCount(data.counts.dislike)
      setDoCount(data.counts.do)
    }
  }, [data])

  const handleReaction = useCallback(
    async (newReaction: "like" | "dislike") => {
      if (isLoading) return

      const previousReaction = reaction
      const previousLikeCount = likeCount
      const previousDislikeCount = dislikeCount

      // Determine if we're toggling off or changing/adding
      const isToggleOff = reaction === newReaction

      try {
        // Optimistic update
        if (isToggleOff) {
          // Remove reaction
          setReaction(null)
          if (newReaction === "like") {
            setLikeCount(prev => Math.max(0, prev - 1))
          } else {
            setDislikeCount(prev => Math.max(0, prev - 1))
          }
        } else {
          // Remove previous reaction count
          if (reaction === "like") {
            setLikeCount(prev => Math.max(0, prev - 1))
          } else if (reaction === "dislike") {
            setDislikeCount(prev => Math.max(0, prev - 1))
          }

          // Add new reaction
          setReaction(newReaction)
          if (newReaction === "like") {
            setLikeCount(prev => prev + 1)
          } else {
            setDislikeCount(prev => prev + 1)
          }
        }

        // API call
        await reactionPost({
          type: "post",
          id: postId,
          reactionType: newReaction,
        }).unwrap()
      } catch (error: any) {
        // Revert on error
        setReaction(previousReaction)
        setLikeCount(previousLikeCount)
        setDislikeCount(previousDislikeCount)

        // Show error to user
        const errorMessage = error?.data?.message || "Failed to update reaction"
        console.error("Reaction error:", errorMessage)
      }
    },
    [reaction, likeCount, dislikeCount, postId, reactionPost, isLoading]
  )

  const handleDoToggle = useCallback(async () => {
    if (isLoading) return

    const previousHasDo = hasDo
    const previousDoCount = doCount

    try {
      // Optimistic update
      setHasDo(prev => !prev)
      setDoCount(prev => (hasDo ? Math.max(0, prev - 1) : prev + 1))

      // API call
      await reactionPost({
        type: "post",
        id: postId,
        reactionType: "do",
      }).unwrap()
    } catch (error: any) {
      // Revert on error
      setHasDo(previousHasDo)
      setDoCount(previousDoCount)

      const errorMessage = error?.data?.message || "Failed to toggle do"
      console.error("Do toggle error:", errorMessage)
    }
  }, [hasDo, doCount, postId, reactionPost, isLoading])

  return {
    reaction,
    likeCount,
    dislikeCount,
    doCount,
    hasDo,
    handleReaction,
    handleDoToggle,
    isLoading,
  }
}
