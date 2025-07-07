"use client"

import React, { useCallback, memo } from "react"
import { ForumList } from "../forumList/ForumList"
import styles from "./Forum.module.scss"
import { FORUM_DATA } from "@/data/topics"
import { MainHeader } from "../../sectionsHeader/regular/MainHeader"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setForumSection } from "@/store/features/forum/forumSlice"

// Memoize the ForumSection component
const ForumSection = memo(({
    selectedSection,
    onSectionChange,
}: {
    selectedSection: number | "all"
    onSectionChange: (section: number | "all") => void
}) => {
    // Find the section name for the API call
    const sectionName = selectedSection === "all"
        ? "all"
        : FORUM_DATA.subtopics.find(s => s.id === selectedSection)?.name.toLowerCase() || "all"

    return (
        <div className={styles.forumContainer}>
            <MainHeader
            isFor={"forum"}
                topicData={FORUM_DATA}
                selectedCategory={selectedSection}
                onCategoryChange={onSectionChange}
            />

            <ForumList
                section={sectionName as 'doubt' | 'need' | 'dream' | 'all'}
                limit={10}
                horizontal={true}
                className={styles.forumListContainer}
            />
        </div>
    )
})

ForumSection.displayName = 'ForumSection'

const ForumContent = memo(() => {
    const dispatch = useAppDispatch()

    // Add type safety to the selector
    const selectedSection = useAppSelector(
        (state) => state.forum?.selectedSection || "all"
    )

    // Memoize the section change handler
    const handleSectionChange = useCallback(
        (section: number | "all") => {
            dispatch(setForumSection(section))
        },
        [dispatch]
    )

    return (
        <div className={styles.container}>
            <ForumSection
                key={`forum-${selectedSection}`} // More specific key
                selectedSection={selectedSection}
                onSectionChange={handleSectionChange}
            />
        </div>
    )
})

ForumContent.displayName = 'ForumContent'

// Main component
const Forum = memo(() => {
    return <ForumContent />
})

Forum.displayName = 'Forum'

export default Forum