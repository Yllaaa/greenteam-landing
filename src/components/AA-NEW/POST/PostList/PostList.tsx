/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
// components/PostList/PostList.tsx
import React from "react"
import styles from "./PostList.module.scss"
import { PostCard } from "../PostCard/PostCard"
import { ScrollArrows } from "../../ScrollArrows/ScrollArrows"
import { useInfiniteScroll } from "@/hooks/userInfiniteScroll"
import {  PostListProps } from "./PostList.data"
export const PostList: React.FC<PostListProps> = ({
  posts,
  isLoading,
  isFetchingMore,
  error,
  hasMore,
  onLoadMore,
  mainTopicId,
  subTopicId,
  className = "",
  horizontal = false,
  showArrows = "auto",
  scrollAmount = 300,
  arrowSize = "medium",
  arrowPosition = "inside",
}) => {
  const queryKey = `${mainTopicId}-${subTopicId || "all"}`

  const { ref } = useInfiniteScroll({
    loading: isFetchingMore,
    hasMore,
    onLoadMore,
    threshold: 0.5,
    rootMargin: "50px",
  })

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading posts</p>
        <p className={styles.errorMessage}>
          {"data" in error ? (error.data as any)?.message : "Failed to load posts"}
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading posts...</p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
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
      className={`${styles.list} ${horizontal ? styles.horizontal : styles.vertical
        } ${className}`}
    >
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1
        return (
          <div
            key={`${post.post.id}-${queryKey}`}
            ref={isLast && hasMore && !isFetchingMore ? ref : undefined}
            className={styles.postWrapper}
          >
            <PostCard post={post} />
          </div>
        )
      })}

      {isFetchingMore && (
        <div
          className={`${styles.loadingMore} ${horizontal ? styles.horizontalLoading : ""
            }`}
        >
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
          className={styles.scrollWrapper}
        >
          {postList}
        </ScrollArrows>
        {!isFetchingMore && !hasMore && posts.length > 0 && (
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
      {!isFetchingMore && !hasMore && posts.length > 0 && (
        <div className={styles.endMessage}>
          <p>{`You've reached the end`}</p>
        </div>
      )}
    </>
  )
}