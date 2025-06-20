"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PostList/PostList.tsx
import React, { useState, useEffect } from "react"
import styles from "./PostList.module.scss"
import { Post } from "@/types"
import { PostCard } from "../PostCard/PostCard"
import { ScrollArrows } from "../../ScrollArrows/ScrollArrows"
import { useInfiniteScroll } from "@/hooks/userInfiniteScroll"
import { useGetPostsQuery } from "@/services/api"
import { PostListProps } from "./PostList.data"

export const PostList: React.FC<PostListProps> = ({
  initialPage = 1,
  limit = 10,
  mainTopicId,
  subTopicId,
  className = "",
  horizontal = false,
  showArrows = "auto",
  scrollAmount = 300,
  arrowSize = "medium",
  arrowPosition = "inside",
}) => {
  const [page, setPage] = useState(initialPage)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState(true)

  // Create a unique key for this topic/subtopic combination
  const queryKey = `${mainTopicId}-${subTopicId || "all"}`

  // Reset when topic or subtopic changes
  useEffect(() => {
    setPage(1)
    setAllPosts([])
    setHasMore(true)
  }, [queryKey]) // Use queryKey instead of individual dependencies

  const { data, isLoading, isFetching, error } = useGetPostsQuery(
    {
      page,
      limit,
      mainTopicId,
      subTopicId,
    },
    {
      // Skip the query if mainTopicId is not provided
      skip: !mainTopicId,
    }
  )

  // Update posts when data changes
  useEffect(() => {
    if (data) {
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

      // Stop loading more if we got less than requested or empty
      if (newPosts.length < limit || newPosts.length === 0) {
        setHasMore(false)
      }
    }
  }, [data, page, limit])

  // Load more function that increments page
  const loadMore = () => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1)
    }
  }

  const { ref } = useInfiniteScroll({
    loading: isFetching,
    hasMore,
    onLoadMore: loadMore,
    threshold: 0.5,
    rootMargin: "50px",
  })

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading posts</p>
        <p className={styles.errorMessage}>
          {"data" in error
            ? (error.data as any)?.message
            : "Failed to load posts"}
        </p>
      </div>
    )
  }

  if (isLoading && page === 1) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading posts...</p>
      </div>
    )
  }

  if (!allPosts || allPosts.length === 0) {
    const categoryName = subTopicId
      ? `this subcategory`
      : mainTopicId
        ? `this topic`
        : `any category`

    return (
      <div className={styles.empty}>
        <p>No posts found for {categoryName}</p>
      </div>
    )
  }

  const postList = (
    <div
      className={`${styles.list} ${horizontal ? styles.horizontal : styles.vertical} ${className}`}>
      {allPosts.map((post, index) => {
        const isLast = index === allPosts.length - 1
        return (
          <div
            key={`${post.post.id}-${queryKey}`} // Include queryKey to force re-render
            ref={isLast && hasMore && !isFetching ? ref : undefined}
            className={styles.postWrapper}>
            <PostCard post={post} />
          </div>
        )
      })}

      {isFetching && page > 1 && (
        <div
          className={`${styles.loadingMore} ${horizontal ? styles.horizontalLoading : ""}`}>
          <div className={styles.spinner} />
          <p>Loading more posts...</p>
        </div>
      )}
    </div>
  )

  // If horizontal, wrap with ScrollArrows
  if (horizontal) {
    return (
      <>
        <ScrollArrows
          showArrows={showArrows}
          scrollAmount={scrollAmount}
          arrowSize={arrowSize}
          arrowPosition={arrowPosition}
          className={styles.scrollWrapper}>
          {postList}
        </ScrollArrows>
        {!isFetching && !hasMore && allPosts.length > 0 && (
          <div className={styles.endMessage}>
            <p>{`You've reached the end`}</p>
          </div>
        )}
      </>
    )
  }

  // Vertical layout
  return (
    <>
      {postList}
      {!isFetching && !hasMore && allPosts.length > 0 && (
        <div className={styles.endMessage}>
          <p>{`You've reached the end`}</p>
        </div>
      )}
    </>
  )
}
