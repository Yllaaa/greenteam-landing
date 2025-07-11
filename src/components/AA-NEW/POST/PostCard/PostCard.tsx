"use client"
import React, { useState, useCallback } from "react"
import styles from "./PostCard.module.scss"
import { Post } from "@/types"
import { Avatar } from "../../Avatar/Avatar"
import { OptionsMenu } from "../../OPTION_MENU/OptionsMenu"
import { DeleteModal } from "../../OPTION_MENU/delete/DeleteModal"
import { ReportModal } from "../../OPTION_MENU/report/ReportModal"
import { PostActions } from "../PostActions/PostActions"
import { formatRelativeTime } from "@/Utils/time"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { useLinkify } from "@/hooks/useLinkify"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useLocale, useTranslations } from "next-intl"
import ToastNot from "@/Utils/ToastNotification/ToastNot"
import { useAppSelector } from "@/store/hooks"
import { useReportContentMutation } from "@/services/api"
import { useDelete } from "@/hooks/useDelete"

interface PostCardProps {
  post: Post
  className?: string
}

// Function to truncate text
function truncateText(
  text: string,
  maxLength: number
): { truncated: string; isTruncated: boolean } {
  if (text.length <= maxLength) {
    return { truncated: text, isTruncated: false }
  }

  const truncated = text.substring(0, maxLength).trim()
  const lastSpaceIndex = truncated.lastIndexOf(" ")

  return {
    truncated:
      lastSpaceIndex < 0 ? truncated.substring(0, lastSpaceIndex) : truncated,
    isTruncated: true,
  }
}

export const PostCard: React.FC<PostCardProps> = ({ post, className = "" }) => {
  const router = useRouter()
  const locale = useLocale()
  const tCommon = useTranslations("web.post.common")
  // const tError = useTranslations("web.error")
  const t = useTranslations("web.post.card")
  const hasMedia = post.media.length > 0
  const [isExpanded, setIsExpanded] = useState(false)

  // Use the linkify hook
  const { linkifyText } = useLinkify({
    linkClassName: styles.link,
    mentionClassName: styles.mention,
    hashtagClassName: styles.hashtag,
    onMentionClick: (e, mention) => {
      // Handle mention click - navigate to user profile
      const username = mention.substring(1) // Remove @ symbol
      router.push(`${locale}/users/${username}`)
    },
    onHashtagClick: (e, hashtag) => {
      // Handle hashtag click - navigate to hashtag feed
      const tag = hashtag.substring(1) // Remove # symbol
      router.push(`${locale}/hashtags/${tag}`)
    },
  })
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
        contentType: 'post',
        contentId: post.post.id,
        reason,
        details: reason
      }).unwrap()
      ToastNot(tCommon("reportModal.success"))
    } catch (error) {
      ToastNot(tCommon("reportModal.error"))
      throw error
    }
  }
  // Different text limits based on media presence
  const MAX_LENGTH_WITH_MEDIA = 50
  const MAX_LENGTH_WITHOUT_MEDIA = 300
  const maxLength = hasMedia ? MAX_LENGTH_WITH_MEDIA : MAX_LENGTH_WITHOUT_MEDIA

  const { truncated, isTruncated } = truncateText(post.post.content, maxLength)
  const displayText = isExpanded ? post.post.content : truncated

  const handleCardClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // Prevent navigation if clicking on interactive elements
      const target = e.target as HTMLElement
      const isInteractiveElement =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("video") ||
        target.closest(".swiper") ||
        target.closest(`.${styles.footer}`) ||
        target.closest(`.${styles.optionsWrapper}`) ||
        target.tagName === "VIDEO" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest(`.${styles.authorInfo}`)

      if (!isInteractiveElement) {
        console.log("Navigating to post details")
        router.push(`/${locale}/feeds/posts/${post.post.id}`)
      }
    },
    [router, locale, post.post.id]
  )

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const username = post.author.username || post.author.name
    if (username) {
      if (post.author.type !== "page") {
        router.push(`/${locale}/profile/${username}`)
      } else {
        router.push(`/${locale}/pages/${username}`)
      }
    }
  }
  const handleCommentClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    console.log("opened")
  }

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }
  // handler for options menu clicks
  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  return (
    <>
      <article
        className={`${styles.card} ${!hasMedia ? styles.noMedia : ""} ${className}`}
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }} // Add visual feedback
      >
        <div className={styles.optionsWrapper} onClick={handleOptionsClick}>
          <OptionsMenu
            isAuthor={isAuthor}
            onDelete={() => openDeleteModal(post.post.id, post.post.content)}
            onReport={() => setShowReportModal(true)}
          />
        </div>
        <header className={styles.header}>
          <Avatar
            src={post.author.avatar}
            name={post.author.name}
            size="medium"
          />

          <div onClick={handleAuthorClick} className={styles.authorInfo} style={{ cursor: 'pointer' }}>
            <h3 className={styles.authorName}>
              {post.author.name && post.author.name.length > 20 ? `${post.author.name.substring(0, 20)}...` : post.author.name || "Unknown User"}
              {post.author.type && (
                <span className={styles.authorType}>
                  {post.author.type.replace("_", " ")}
                </span>
              )}
            </h3>

            {post.author.username && (
              <p className={styles.username}>@{post.author.username}</p>
            )}

            <div className={styles.meta}>
              {post.location.cityName && post.location.countryName && (
                <span className={styles.location}>
                  📍 {post.location.cityName}, {post.location.countryName}
                </span>
              )}
              <time className={styles.timestamp} dateTime={post.post.createdAt}>
                {formatRelativeTime(post.post.createdAt)}
              </time>
            </div>
          </div>
        </header>

        <div className={`${styles.content} ${!hasMedia && styles.noMedia}`}>
          <span className={styles.contentText}>{linkifyText(displayText)}</span>
          {isTruncated && (
            <button type="button" className={styles.readMoreBtn} onClick={handleReadMoreClick}>
              {isExpanded ? t("less") : t("more")}
            </button>
          )}
        </div>

        {hasMedia && (
          <div
            className={styles.swiperContainer}
            onClick={e => e.stopPropagation()}>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              loop
              navigation={post.media.length > 1}
              pagination={post.media.length > 1 ? { clickable: true } : false}
              className={styles.swiper}>
              {post.media.map(media => (
                <SwiperSlide key={media.id} className={styles.slide}>
                  {media.mediaType === "image" && (
                    <Image
                      src={media.mediaUrl}
                      alt="Post media"
                      loading="lazy"
                      width={1000}
                      height={1000}
                      className={styles.mediaImage}
                    />
                  )}
                  {media.mediaType === "video" && (
                    <video controls className={styles.mediaVideo}>
                      <source src={media.mediaUrl} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <footer onClick={e => e.stopPropagation()} className={styles.footer}>
          <PostActions
            postId={post.post.id}
            initialLikeCount={parseInt(post.likeCount)}
            initialDislikeCount={parseInt(post.dislikeCount)}
            commentCount={parseInt(post.commentCount)}
            initialReaction={post.userReactionType}
            initialHasDo={post.hasDoReaction}
            onCommentClick={handleCommentClick}
            post={post}
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
        itemId={post.post.id}
      />
    </>
  )
}
