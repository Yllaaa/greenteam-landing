"use client"
import React, { useState, useCallback } from "react"
import styles from "./PostCard.module.scss"
import { Post } from "@/types"
import { Avatar } from "../../Avatar/Avatar"
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
import { useLocale } from "next-intl"

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
        target.tagName === "VIDEO" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest(`.${styles.authorInfo}`)

      if (!isInteractiveElement) {
        router.push(`/${locale}/feeds/posts/${post.post.id}`)
      }
    },
    [router, locale, post.post.id]
  )

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const username = post.author.username || post.author.name
    if (username) {
      router.push(`/${locale}/profile/${username}`)
    }
  }
  const handleCommentClick = () => {
   console.log("opened")
  }

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <article
      className={`${styles.card} ${!hasMedia ? styles.noMedia : ""} ${className}`}
      onClick={handleCardClick}>
      <header className={styles.header}>
        <Avatar
          src={post.author.avatar}
          name={post.author.name}
          size="medium"
        />

        <div onClick={handleAuthorClick} className={styles.authorInfo}>
          <h3 className={styles.authorName}>
            {post.author.name || "Unknown User"}
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

      <div className={styles.content}>
        <span className={styles.contentText}>{linkifyText(displayText)}</span>
        {isTruncated && (
          <button className={styles.readMoreBtn} onClick={handleReadMoreClick}>
            {isExpanded ? "...Show less" : "Read more..."}
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

      <footer className={styles.footer}>
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
  )
}
