/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useCallback, useMemo, memo } from "react"
import { PostList } from "../PostList/PostList"
import styles from "./Post.module.scss"
import { TOPICS_DATA } from "@/data/topics"
import { MainHeader } from "../../sectionsHeader/regular/MainHeader"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setTopicCategory } from "@/store/features/posts/categorySlice"
import { useGetPostsQuery } from "@/services/api"
import { Post as PostType } from "@/types"

// Memoize the TopicSection component
const TopicSection = memo(({
  topic,
  selectedSubcategory,
  onCategoryChange,
}: {
  topic: any
  selectedSubcategory: number | "all"
  onCategoryChange: (category: number | "all") => void
}) => {
  // Local state for this topic section only
  const [page, setPage] = useState(1)
  const [allPosts, setAllPosts] = useState<PostType[]>([])
  const [hasMore, setHasMore] = useState(true)

  // Reset when category changes
  React.useEffect(() => {
    setPage(1)
    setAllPosts([])
    setHasMore(true)
  }, [selectedSubcategory])

  // Use the query hook
  const { data, isLoading, isFetching, error } = useGetPostsQuery(
    {
      page,
      limit: 5,
      mainTopicId: topic.id,
      subTopicId: selectedSubcategory === "all" ? undefined : selectedSubcategory,
    },
    {
      skip: false,
    }
  )

  // Update posts when data changes
  React.useEffect(() => {
    if (data && !isLoading) {
      const newPosts = Array.isArray(data) ? data : data.data || []

      if (page === 1) {
        setAllPosts(newPosts)
      } else {
        // Append new posts, avoiding duplicates
        setAllPosts(prev => {
          const existingIds = new Set(prev.map(p => p.post.id))
          const uniqueNewPosts = newPosts.filter(
            p => !existingIds.has(p.post.id)
          )
          return [...prev, ...uniqueNewPosts]
        })
      }

      setHasMore(newPosts.length >= 5)
    }
  }, [data, isLoading, page])

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading && !isFetching) {
      setPage(prev => prev + 1)
    }
  }, [hasMore, isLoading, isFetching])

  return (
    <div className={styles.topicContainer}>
      <MainHeader
        isFor="feed_post"
        topicData={topic}
        selectedCategory={selectedSubcategory}
        onCategoryChange={onCategoryChange}
      />

      <PostList
        posts={allPosts}
        isLoading={isLoading && page === 1}
        isFetchingMore={isFetching && page > 1}
        error={error}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        mainTopicId={topic.id}
        subTopicId={selectedSubcategory === "all" ? undefined : selectedSubcategory}
        limit={5}
        horizontal
        showArrows="auto"
        arrowSize="medium"
        scrollAmount={350}
        className={styles.postContainer}
      />
    </div>
  )
})

TopicSection.displayName = 'TopicSection'

function PostContent() {
  const dispatch = useAppDispatch()
  const selectedCategories = useAppSelector(
    state => state.category.selectedCategories
  )

  // Memoize topics to prevent re-creation
  const topics = useMemo(() => TOPICS_DATA, [])

  // Memoize the category change handler
  const handleCategoryChange = useCallback(
    (topicId: number) => (category: number | "all") => {
      dispatch(setTopicCategory({ topicId, subtopicId: category }))
    },
    [dispatch]
  )

  return (
    <div className={styles.container}>
      {topics.map(topic => {
        const selectedSubcategory = selectedCategories[topic.id] || "all"

        return (
          <TopicSection
            key={`${topic.id}-${selectedSubcategory}`} // Important: include subcategory in key
            topic={topic}
            selectedSubcategory={selectedSubcategory}
            onCategoryChange={handleCategoryChange(topic.id)}
          />
        )
      })}
    </div>
  )
}

// Memoize the main component
const Post = memo(() => {
  return <PostContent />
})

Post.displayName = 'Post'

export default Post