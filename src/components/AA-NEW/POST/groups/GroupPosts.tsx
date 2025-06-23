
"use client"

import React, { useState, useEffect } from "react"
import { PostList } from "../PostList/PostList"
import styles from "./Post.module.scss"
import { useGetGroupPostsQuery } from "@/services/api"
import { Post } from "@/types"

interface GroupPostProps {
  groupId: string
}

function GroupPosts({ groupId }: GroupPostProps) {
  const [page, setPage] = useState(1)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState(true)

  // Fetch group posts
  const { data, isLoading, isFetching, error } = useGetGroupPostsQuery({
    groupId,
    page,
    limit: 5,
  })
  // Update posts when data changes
  useEffect(() => {
    if (data && !isLoading) {
      // Access the data array from PaginatedResponse
      const posts = Array.isArray(data) ? data : data.data || []

      if (page === 1) {
        // Replace posts on first page
        setAllPosts(posts)
        setHasMore(posts.length >= 5)
      } else {
        // Append new posts, avoiding duplicates
        setAllPosts(prev => {
          const existingIds = new Set(prev.map(p => p.post.id))
          const uniqueNewPosts = posts.filter(
            p => !existingIds.has(p.post.id)
          )
          return [...prev, ...uniqueNewPosts]
        })
        setHasMore(posts.length >= 5)
      }
    }
  }, [data, isLoading, page])

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1)
    }
  }

  // Reset when groupId changes
  useEffect(() => {
    setPage(1)
    setAllPosts([])
    setHasMore(true)
  }, [groupId])

  return (
    <div className={styles.container}>
      <div className={styles.topicContainer}>
        <PostList
          posts={allPosts}
          isLoading={isLoading && page === 1}
          isFetchingMore={isFetching && page > 1}
          error={error}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          limit={5}
          // horizontal
          showArrows="auto"
          arrowSize="medium"
          scrollAmount={350}
          className={styles.postContainer}
        />
      </div>
    </div>
  )
}

export default GroupPosts