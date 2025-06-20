/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ForumCard/ForumCard.tsx
"use client"
import React, { useState } from "react"
import styles from "./ForumCard.module.scss"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { OptionsMenu } from "../../OPTION_MENU/OptionsMenu"
import { DeleteModal } from "../../OPTION_MENU/delete/DeleteModal"
import { ReportModal } from "../../OPTION_MENU/report/ReportModal"
import { ForumActions } from "../forumAction/ForumActions"
import { formatRelativeTime } from "@/Utils/time"
import { useReportContentMutation } from "@/services/api"
import { useDelete } from "@/hooks/useDelete"
import { useAppSelector } from "@/store/hooks"
import ToastNot from '@/Utils/ToastNotification/ToastNot'
import { Forum } from "@/types"
import { FiMapPin } from "react-icons/fi"

// Import your section images
import dreamImg from "@/../public/ZPLATFORM/forum/dreem.png"
import needImg from "@/../public/ZPLATFORM/forum/need.png"
import questionImg from "@/../public/ZPLATFORM/forum/question.png"

interface ForumCardProps {
    post: Forum
    section: string
    index: number
    page: number
    setPage: (page: number) => void
    length: number
    commentPage: number
    setCommentPage: (page: number) => void
    setPostId: (id: string) => void
    setCommentModal: (open: boolean) => void
    setPostComments: (comments: any[]) => void
}

export const ForumCard: React.FC<ForumCardProps> = ({
    post,
    setPostId,
    setCommentModal,
}) => {
    const router = useRouter()
    const locale = useLocale()
    // const t = useTranslations("web.main.forums")
    const tCommon = useTranslations("common")

    const currentUserId = useAppSelector((state) => state.login.user?.user)?.id
    const isAuthor = post.isAuthor || post.author.id === currentUserId

    const [showReportModal, setShowReportModal] = useState(false)
    const [reportContent] = useReportContentMutation()

    const {
        showDeleteModal,
        openDeleteModal,
        closeDeleteModal,
        handleDelete,
        itemToDelete
    } = useDelete({
        contentType: 'forum',
        onSuccess: () => {
            // Optional: Navigate away or update local state
        }
    })

    const handleReport = async (reason: string) => {
        try {
            await reportContent({
                contentType: 'forum',
                contentId: post.id,
                reason,
                details: reason
            }).unwrap()
            ToastNot(tCommon("reportModal.success"))
        } catch (error) {
            ToastNot(tCommon("reportModal.error"))
            throw error
        }
    }

    const navigateToProfile = () => {
        if (post.author.username) {
            router.push(`/${locale}/profile/${post.author.username}`)
        }
    }

    // const navigateToPost = () => {
    //     router.push(`/${locale}/forums/${post.id}`)
    // }

    const getSectionImage = () => {
        switch (post.section) {
            case "need":
                return needImg
            case "dream":
                return dreamImg
            case "doubt":
            default:
                return questionImg
        }
    }

    return (
        <>
            <article className={styles.container}>
                <div className={styles.optionsWrapper}>
                    <OptionsMenu
                        isAuthor={isAuthor}
                        onDelete={() => openDeleteModal(post.id, post.headline)}
                        onReport={() => setShowReportModal(true)}
                    />
                </div>

                <div className={styles.scrollableContent}>
                    <header className={styles.header}>
                        <div className={styles.user}>
                            <div className={styles.avatar} onClick={navigateToProfile}>
                                {post.author.avatar ? (
                                    <Image
                                        src={post.author.avatar}
                                        alt={post.author.fullName}
                                        width={48}
                                        height={48}
                                        className={styles.avatarImage}
                                    />
                                ) : (
                                    <div className={styles.noAvatar}>
                                        {post.author.fullName[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className={styles.userInfo}>
                                <h3 className={styles.username} onClick={navigateToProfile}>
                                    {post.author.username}
                                </h3>
                                <p className={styles.fullName}>{post.author.fullName}</p>
                                <time className={styles.timestamp}>
                                    {formatRelativeTime(post.createdAt)}
                                </time>
                            </div>
                        </div>
                        <div className={styles.sectionBadge}>
                            <Image
                                src={getSectionImage()}
                                alt={post.section}
                                width={40}
                                height={40}
                            />
                        </div>
                    </header>

                    {post.location && (
                        <div className={styles.location}>
                            <FiMapPin className={styles.locationIcon} />
                            <span>{post.location.cityName}, {post.location.countryName}</span>
                        </div>
                    )}

                    <div className={styles.content}
                    // onClick={navigateToPost}
                    >
                        <h2 className={styles.headline}>{post.headline}</h2>
                        <p className={styles.text}>{post.content}</p>

                        {post.media.length > 0 && (
                            <div className={styles.mediaContainer}>
                                <Image
                                    src={post.media[0].mediaUrl}
                                    alt="Forum media"
                                    layout="responsive"
                                    width={400}
                                    height={300}
                                    className={styles.media}
                                />
                                {post.media.length > 1 && (
                                    <div className={styles.mediaCount}>
                                        +{post.media.length - 1}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <footer className={styles.footer}>
                    <ForumActions
                        forumId={post.id}
                        section={post.section}
                        initialLikeCount={post.likeCount || 0}
                        initialDislikeCount={post.dislikeCount}
                        initialSignCount={post.signCount || 0}
                        commentCount={post.commentCount}
                        initialReaction={post.userReaction}
                        onCommentClick={() => {
                            setPostId(post.id)
                            setCommentModal(true)
                        }}
                    />
                </footer>
            </article>

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="forum"
                itemTitle={itemToDelete?.title}
            />

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReport}
                itemType="forum"
                itemId={post.id}
            />
        </>
    )
}