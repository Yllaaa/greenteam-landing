// components/sectionsHeader/regular/MainHeader.tsx
import React, { useState, useEffect } from "react"
import styles from "./MainHeader.module.scss"
import { CategorySelector } from "../../CategorySelector/CategorySelector"
import { AddPostButton } from "../../buttons/postAdd/AddPostButton"
import { AddPostModal } from "../../MODALS/POST/postRegular/AddPostModal"
import { Topic } from "@/types"
import { useTranslations } from "next-intl"
import artIcon from "@/../public/ZPLATFORM/categories/art.svg";
import food from "@/../public/ZPLATFORM/categories/food.svg";
import know from "@/../public/ZPLATFORM/categories/physical.svg";
import physical from "@/../public/ZPLATFORM/categories/eco.svg";
import eco from "@/../public/ZPLATFORM/categories/know.svg";
import community from "@/../public/ZPLATFORM/categories/community.svg";
import Image from "next/image"
import ForumModal from "../../MODALS/FORUM/ForumModal"

interface MainHeaderProps {
  topicData: Topic
  selectedCategory: number | "all"
  onCategoryChange: (category: number | "all") => void
  isFor?: string
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  selectedCategory,
  onCategoryChange,
  topicData,
  isFor
}) => {

  const topicLogo: { id: number; logo: string }[] = [
    { id: 1, logo: food },
    { id: 2, logo: know },
    { id: 3, logo: physical },
    { id: 4, logo: community },
    { id: 5, logo: artIcon },
    { id: 6, logo: eco },
  ];

  const [modalOpen, setModalOpen] = useState(false)
  const [forumModalOpen, setForumModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const t = useTranslations("web.post")

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePostSuccess = () => {
    // You can add any success handling here
    // For example, show a success snackbar, refresh the post list, etc.
    console.log("Post published successfully!")
  }

  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          {/* Title and Add Button Row */}
          <div className={styles.titleRow}>
            <h2 className={`${styles.title} ${isMobile ? styles.titleMobile : ''}`}>
              {isFor !== "forum" && <Image
                src={topicLogo[Number(topicData?.id) - 1]?.logo}
                alt="artIcon"
                loading="lazy"
                className={styles.titleIcon}
                width={30}
                height={30}
                unoptimized
              />}
              {t(`categories.${topicData.name}`)}
            </h2>
            {/* Category Selector */}
            <div style={isMobile ? { display: "none" } : {}} className={styles.categoryContainer}>
              <CategorySelector
                topicData={topicData}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
              />
            </div>
            {isFor === "feed_post" &&
              <AddPostButton
                title={t("addPost.addPost")}
                onClick={() => setModalOpen(true)}
                variant={isMobile ? "icon" : "button"}
              />}
            {isFor === "forum" &&
              <AddPostButton
                title={t("addPost.addForum")}
                onClick={() => setForumModalOpen(true)}
                variant={isMobile ? "icon" : "button"}
              />}
          </div>

          {/* Category Selector */}
          <div style={isMobile ? { display: "block" } : { display: "none" }} className={styles.categoryContainer}>
            <CategorySelector
              topicData={topicData}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />
          </div>
        </div>
      </div>

      <AddPostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTopicId={topicData.id}
        onSuccess={handlePostSuccess}
      />

      <ForumModal
        isOpen={forumModalOpen}
        onClose={() => setForumModalOpen(false)}
      />
    </>
  )
}