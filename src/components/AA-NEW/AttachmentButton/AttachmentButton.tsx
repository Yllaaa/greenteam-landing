// components/AttachmentButton/AttachmentButton.tsx
import React, { useState } from "react"
import styles from "./AttachmentButton.module.scss"
import { useTranslations } from "next-intl"
import { useClickOutside } from "@/hooks/useClickOutside"

interface AttachmentButtonProps {
  onImageSelect: () => void
  onDocumentSelect: () => void
  hasImages: boolean
  hasDocument: boolean
  imageCount: number
}

export const AttachmentButton: React.FC<AttachmentButtonProps> = ({
  onImageSelect,
  onDocumentSelect,
  hasImages,
  hasDocument,
  imageCount,
}) => {
  const t = useTranslations("web.post.addPost")
  const [showMenu, setShowMenu] = useState(false)

  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setShowMenu(false)
  }, showMenu)

  const handleClick = () => {
    setShowMenu(!showMenu)
  }

  const handleImageClick = () => {
    onImageSelect()
    setShowMenu(false)
  }

  const handleDocumentClick = () => {
    onDocumentSelect()
    setShowMenu(false)
  }

  return (
    <div className={styles.container} ref={menuRef}>
      <button type="button" className={styles.button} onClick={handleClick}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 5V15M5 10H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {t("addMedia")}
      </button>

      {showMenu && (
        <div className={styles.menu}>
          <button
            type="button"
            className={styles.menuItem}
            onClick={handleImageClick}
            disabled={hasDocument || imageCount >= 4}>
            <span className={styles.icon}>🖼️</span>
            <span>{t("addImages")}</span>
            {imageCount > 0 && (
              <span className={styles.count}>({imageCount}/4)</span>
            )}
          </button>

          <button
            type="button"
            className={styles.menuItem}
            onClick={handleDocumentClick}
            disabled={hasImages}>
            <span className={styles.icon}>📄</span>
            <span>{t("addDocument")}</span>
            {hasDocument && <span className={styles.check}>✓</span>}
          </button>
        </div>
      )}
    </div>
  )
}
