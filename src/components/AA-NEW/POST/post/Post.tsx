// app/post/page.tsx
"use client"

import React from "react"
import { PostList } from "../PostList/PostList"
import styles from "./Post.module.scss"
import { TOPICS_DATA } from "@/data/topics"
import { MainHeader } from "../../sectionsHeader/regular/MainHeader"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setTopicCategory } from "@/store/features/posts/categorySlice"

function PostContent() {
  const dispatch = useAppDispatch()
  const selectedCategories = useAppSelector(
    state => state.category.selectedCategories
  )
  const topics = TOPICS_DATA

  const handleCategoryChange =
    (topicId: number) => (category: number | "all") => {
      dispatch(setTopicCategory({ topicId, subtopicId: category }))
    }

  return (
    <div className={styles.container}>
      {topics.map(topic => {
        const selectedSubcategory = selectedCategories[topic.id] || "all"

        return (
          <div key={topic.id} className={styles.topicContainer}>
            <MainHeader
              isFor="feed_post"
              topicData={topic}
              selectedCategory={selectedSubcategory}
              onCategoryChange={handleCategoryChange(topic.id)}
            />

            <PostList
              mainTopicId={topic.id}
              subTopicId={
                selectedSubcategory === "all" ? undefined : selectedSubcategory
              }
              limit={5}
              horizontal
              showArrows="auto"
              arrowSize="medium"
              scrollAmount={350}
              className={styles.postContainer}
            />
          </div>
        )
      })}
    </div>
  )
}

function Post() {
  return <PostContent />
}

export default Post
