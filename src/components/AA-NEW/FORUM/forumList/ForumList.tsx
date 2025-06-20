"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ForumList/ForumList.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react"
import styles from "./ForumList.module.scss"
import { Forum } from "@/types"
import { ForumCard } from "../forumCard/ForumCard"
import { ScrollArrows } from "../../ScrollArrows/ScrollArrows"
import { useInfiniteScroll } from "@/hooks/userInfiniteScroll"
import { useGetForumsQuery } from "@/services/api"
import { ForumListProps } from "./ForumList.data"
import { useTranslations } from "next-intl"

export const ForumList: React.FC<ForumListProps> = ({
    initialPage = 1,
    limit = 10,
    section = 'all',
    className = "",
    horizontal = false,
    showArrows = "auto",
    scrollAmount = 300,
    arrowSize = "medium",
    arrowPosition = "inside",
}) => {
    const [page, setPage] = useState(initialPage)
    const [forumMap, setForumMap] = useState<Map<string, Forum>>(new Map())
    const [hasMore, setHasMore] = useState(true)
    const t = useTranslations("web.errors")

    // Reset when section changes
    useEffect(() => {
        setPage(1)
        setForumMap(new Map())
        setHasMore(true)
    }, [section])

    const { data, isLoading, isFetching, error } = useGetForumsQuery({
        page,
        limit,
        section,
    })

    // Update forums when data changes
    useEffect(() => {
        if (data) {
            const newForums = Array.isArray(data) ? data : data.data || []

            setForumMap(prevMap => {
                const newMap = page === 1 ? new Map() : new Map(prevMap)

                // Add new forums to the map, which automatically handles duplicates
                newForums.forEach(forum => {
                    newMap.set(forum.id, forum)
                })

                return newMap
            })

            // Check if we should stop loading more
            const totalPages = !Array.isArray(data) && data.totalPages ? data.totalPages : null
            const currentTotal = !Array.isArray(data) && data.total ? data.total : null

            if (totalPages) {
                setHasMore(page < totalPages)
            } else if (currentTotal) {
                const loadedCount = forumMap.size + newForums.length
                setHasMore(loadedCount < currentTotal && newForums.length >= limit)
            } else {
                setHasMore(newForums.length >= limit)
            }
        }
    }, [data, page, limit, forumMap.size])

    // Convert map to array for rendering
    const allForums = useMemo(() => Array.from(forumMap.values()), [forumMap])

    // Load more function that increments page
    const loadMore = useCallback(() => {
        if (hasMore && !isFetching) {
            setPage(prev => prev + 1)
        }
    }, [hasMore, isFetching])

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
                <p>{t("anErrorOccurred")}</p>
                <p className={styles.errorMessage}>
                    {"data" in error
                        ? (error.data as any)?.message
                        : t("failedToLoadForums")}
                </p>
            </div>
        )
    }

    if (isLoading && page === 1) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>{t("loadingForums")}</p>
            </div>
        )
    }

    if (!allForums || allForums.length === 0) {
        const sectionName = section !== 'all'
            ? `${section} section`
            : `any section`

        return (
            <div className={styles.empty}>
                <p>{t("notFound")} {sectionName}</p>
            </div>
        )
    }

    const forumList = (
        <div
            className={`${styles.list} ${horizontal ? styles.horizontal : styles.vertical} ${className}`}>
            {allForums.map((forum, index) => {
                const isLast = index === allForums.length - 1
                // Use only the forum.id as key since Map ensures uniqueness
                return (
                    <div
                        key={forum.id}
                        ref={isLast && hasMore && !isFetching ? ref : undefined}
                        className={styles.forumWrapper}>
                        <ForumCard
                            post={forum}
                            section={section === 'all' ? forum.section : section}
                            index={index}
                            page={page}
                            setPage={setPage}
                            length={allForums.length}
                            commentPage={1}
                            setCommentPage={() => { }}
                            setPostId={() => { }}
                            setCommentModal={() => { }}
                            setPostComments={() => { }}
                        />
                    </div>
                )
            })}

            {isFetching && page > 1 && (
                <div
                    className={`${styles.loadingMore} ${horizontal ? styles.horizontalLoading : ""}`}>
                    <div className={styles.spinner} />
                    <p>{t("loadingMore")}</p>
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
                    {forumList}
                </ScrollArrows>
                {!isFetching && !hasMore && allForums.length > 0 && (
                    <div className={styles.endMessage}>
                        <p>{t("noMore")}</p>
                    </div>
                )}
            </>
        )
    }

    // Vertical layout
    return (
        <>
            {forumList}
            {!isFetching && !hasMore && allForums.length > 0 && (
                <div className={styles.endMessage}>
                    <p>{t("noMore")}</p>
                </div>
            )}
        </>
    )
}