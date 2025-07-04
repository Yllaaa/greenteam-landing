// components/CategorySelector/CategorySelector.tsx
import React, { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Topic } from "@/types"
import styles from "./CategorySelector.module.scss"

interface CategorySelectorProps {
  topicData: Topic
  selectedCategory: number | "all"
  onCategoryChange: (category: number | "all") => void
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  topicData,
}) => {
  const t = useTranslations("web.post.categories")
  const [isMobile, setIsMobile] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleSelect = (value: number | "all") => {
    onCategoryChange(value)
    setDropdownOpen(false)
  }

  const getSelectedLabel = () => {
    if (selectedCategory === "all") {
      return t("all")
    }
    const subtopic = topicData.subtopics.find(
      sub => sub.id === selectedCategory
    )
    return subtopic ? subtopic.name : t("all")
  }

  if (isMobile) {
    // Mobile: Dropdown menu
    return (
      <div className={styles.dropdownContainer} ref={dropdownRef}>
        <button
          className={styles.dropdownButton}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          type="button"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}>
          <span>{getSelectedLabel()}</span>
          <svg
            className={`${styles.dropdownIcon} ${dropdownOpen ? styles.open : ''}`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            <button
              className={`${styles.dropdownItem} ${selectedCategory === "all" ? styles.selected : ''}`}
              onClick={() => handleSelect("all")}
              type="button">
              {t("all")}
            </button>
            {topicData.subtopics.map(subtopic => (
              <button
                key={`subtopic-${subtopic.id}`}
                className={`${styles.dropdownItem} ${selectedCategory === subtopic.id ? styles.selected : ''}`}
                onClick={() => handleSelect(subtopic.id)}
                type="button">
                {subtopic.name}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Desktop: Horizontal scrollable tabs
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsWrapper} ref={tabsContainerRef}>
        <div className={styles.tabsList}>
          <button
            className={`${styles.tab} ${selectedCategory === "all" ? styles.activeTab : ''}`}
            onClick={() => onCategoryChange("all")}
            type="button">
            {t("all")}
          </button>
          {topicData.subtopics.map(subtopic => (
            <button
              key={subtopic.id}
              className={`${styles.tab} ${selectedCategory === subtopic.id ? styles.activeTab : ''}`}
              onClick={() => onCategoryChange(subtopic.id)}
              type="button">
              {subtopic.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}