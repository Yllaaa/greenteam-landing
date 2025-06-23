/* eslint-disable @typescript-eslint/no-explicit-any */
// // app/post/page.tsx
// "use client"

// import React from "react"
// import { PostList } from "../PostList/PostList"
// import styles from "./Post.module.scss"
// import { TOPICS_DATA } from "@/data/topics"
// import { MainHeader } from "../../sectionsHeader/regular/MainHeader"
// import { useAppDispatch, useAppSelector } from "@/store/hooks"
// import { setTopicCategory } from "@/store/features/posts/categorySlice"

// function PostContent() {
//   const dispatch = useAppDispatch()
//   const selectedCategories = useAppSelector(
//     state => state.category.selectedCategories
//   )
//   const topics = TOPICS_DATA

//   const handleCategoryChange =
//     (topicId: number) => (category: number | "all") => {
//       dispatch(setTopicCategory({ topicId, subtopicId: category }))
//     }

//   return (
//     <div className={styles.container}>
//       {topics.map(topic => {
//         const selectedSubcategory = selectedCategories[topic.id] || "all"

//         return (
//           <div key={topic.id} className={styles.topicContainer}>
//             <MainHeader
//               isFor="feed_post"
//               topicData={topic}
//               selectedCategory={selectedSubcategory}
//               onCategoryChange={handleCategoryChange(topic.id)}
//             />

//             <PostList
//               mainTopicId={topic.id}
//               subTopicId={
//                 selectedSubcategory === "all" ? undefined : selectedSubcategory
//               }
//               limit={5}
//               horizontal
//               showArrows="auto"
//               arrowSize="medium"
//               scrollAmount={350}
//               className={styles.postContainer}
//             />
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// function Post() {
//   return <PostContent />
// }

// export default Post
// app/post/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { PostList } from "../PostList/PostList"
import styles from "./Post.module.scss"
import { TOPICS_DATA } from "@/data/topics"
import { MainHeader } from "../../sectionsHeader/regular/MainHeader"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setTopicCategory } from "@/store/features/posts/categorySlice"
import { useGetPostsQuery } from "@/services/api"
import { Post as PostType } from "@/types"

interface TopicPostData {
  posts: PostType[]
  page: number
  hasMore: boolean
  isLoading: boolean
  error: any
}

function PostContent() {
  const dispatch = useAppDispatch()
  const selectedCategories = useAppSelector(
    state => state.category.selectedCategories
  )
  const topics = TOPICS_DATA

  // State to manage posts data for each topic
  const [topicsData, setTopicsData] = useState<{
    [key: string]: TopicPostData
  }>({})

  // Initialize topics data
  useEffect(() => {
    const initialData: { [key: string]: TopicPostData } = {}
    topics.forEach(topic => {
      const key = `${topic.id}-${selectedCategories[topic.id] || "all"}`
      if (!topicsData[key]) {
        initialData[key] = {
          posts: [],
          page: 1,
          hasMore: true,
          isLoading: false,
          error: null
        }
      }
    })
    setTopicsData(prev => ({ ...prev, ...initialData }))
  }, [selectedCategories, topics, topicsData])

  const handleCategoryChange =
    (topicId: number) => (category: number | "all") => {
      dispatch(setTopicCategory({ topicId, subtopicId: category }))

      // Reset data for this topic when category changes
      const key = `${topicId}-${category}`
      setTopicsData(prev => ({
        ...prev,
        [key]: {
          posts: [],
          page: 1,
          hasMore: true,
          isLoading: false,
          error: null
        }
      }))
    }

  const loadMorePosts = (topicId: number, subTopicId: number | "all" | undefined) => {
    const key = `${topicId}-${subTopicId || "all"}`
    const currentData = topicsData[key]

    if (currentData && currentData.hasMore && !currentData.isLoading) {
      setTopicsData(prev => ({
        ...prev,
        [key]: {
          ...currentData,
          page: currentData.page + 1
        }
      }))
    }
  }

  return (
    <div className={styles.container}>
      {topics.map(topic => {
        const selectedSubcategory = selectedCategories[topic.id] || "all"
        const key = `${topic.id}-${selectedSubcategory}`
        const topicData = topicsData[key] || {
          posts: [],
          page: 1,
          hasMore: true,
          isLoading: false,
          error: null
        }

        return (
          <TopicSection
            key={topic.id}
            topic={topic}
            selectedSubcategory={selectedSubcategory}
            topicData={topicData}
            onCategoryChange={handleCategoryChange(topic.id)}
            onLoadMore={() => loadMorePosts(topic.id, selectedSubcategory)}
            setTopicsData={setTopicsData}
          />
        )
      })}
    </div>
  )
}

// Separate component to handle individual topic data fetching
function TopicSection({
  topic,
  selectedSubcategory,
  topicData,
  onCategoryChange,
  onLoadMore,
  setTopicsData
}: {
  topic: any
  selectedSubcategory: number | "all"
  topicData: TopicPostData
  onCategoryChange: (category: number | "all") => void
  onLoadMore: () => void
  setTopicsData: React.Dispatch<React.SetStateAction<{ [key: string]: TopicPostData }>>
}) {
  const key = `${topic.id}-${selectedSubcategory}`

  // Use the query hook for this specific topic/category combination
  const { data, isLoading, isFetching, error } = useGetPostsQuery(
    {
      page: topicData.page,
      limit: 5,
      mainTopicId: topic.id,
      subTopicId: selectedSubcategory === "all" ? undefined : selectedSubcategory,
    },
    {
      skip: false,
    }
  )

  // Update posts when data changes
  useEffect(() => {
    if (data && !isLoading) {
      const newPosts = Array.isArray(data) ? data : data.data || []

      setTopicsData(prev => {
        const currentData = prev[key] || topicData

        if (topicData.page === 1) {
          return {
            ...prev,
            [key]: {
              ...currentData,
              posts: newPosts,
              hasMore: newPosts.length >= 5,
              isLoading: false,
              error: null
            }
          }
        } else {
          // Append new posts, avoiding duplicates
          const existingIds = new Set(currentData.posts.map(p => p.post.id))
          const uniqueNewPosts = newPosts.filter(
            p => !existingIds.has(p.post.id)
          )

          return {
            ...prev,
            [key]: {
              ...currentData,
              posts: [...currentData.posts, ...uniqueNewPosts],
              hasMore: newPosts.length >= 5,
              isLoading: false,
              error: null
            }
          }
        }
      })
    }
  }, [data, isLoading, key, setTopicsData, topicData, topicData.page])

  // Update loading state
  useEffect(() => {
    if (isLoading || isFetching) {
      setTopicsData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          isLoading: true
        }
      }))
    }
  }, [isLoading, isFetching, key, setTopicsData])

  // Update error state
  useEffect(() => {
    if (error) {
      setTopicsData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          error,
          isLoading: false
        }
      }))
    }
  }, [error, key, setTopicsData])

  return (
    <div className={styles.topicContainer}>
      <MainHeader
        isFor="feed_post"
        topicData={topic}
        selectedCategory={selectedSubcategory}
        onCategoryChange={onCategoryChange}
      />

      <PostList
        posts={topicData.posts}
        isLoading={topicData.isLoading && topicData.page === 1}
        isFetchingMore={topicData.isLoading && topicData.page > 1}
        error={topicData.error}
        hasMore={topicData.hasMore}
        onLoadMore={onLoadMore}
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
}

function Post() {
  return <PostContent />
}

export default Post