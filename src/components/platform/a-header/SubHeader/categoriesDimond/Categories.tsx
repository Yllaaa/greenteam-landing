/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Categories/Categories.tsx
// categories.tsx - Fixed version

'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styles from './categories.module.css'
import Image from 'next/image'
// import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { StaticImageData } from 'next/image'
import clsx from 'clsx'

// Import images
import diamond from '@/../public/ZPLATFORM/categories/diamond.png'
import community from '@/../public/ZPLATFORM/categories/community.svg'
import art from '@/../public/ZPLATFORM/categories/art.svg'
import eco from '@/../public/ZPLATFORM/categories/eco.svg'
import food from '@/../public/ZPLATFORM/categories/food.svg'
import physical from '@/../public/ZPLATFORM/categories/know.svg'
import know from '@/../public/ZPLATFORM/categories/physical.svg'


// API service
import { useGetTopicScoresQuery, useGetSubTopicScoresQuery } from '@/services/api'
import { useAppDispatch } from '@/store/hooks'
import { setOpenBar } from '@/store/features/baropen/useOpenBar'

interface TopicScore {
  topicId: number
  topicName: string
  totalPoints: string
}

interface CategoryInfo {
  name: string
  icon: StaticImageData
  value: string
  color: string
  borderColor: string
}

// Define category colors
const CATEGORY_COLORS = {
  know: {
    primary: '#000',
    border: '#000',
    fill: '#000'
  },
  food: {
    primary: '#000',
    border: '#000',
    fill: '#000'
  },
  physical: {
    primary: '#000',
    border: '#000',
    fill: '#000'
  },
  community: {
    primary: '#000',
    border: '#000',
    fill: '#000'
  },
  art: {
    primary: '#000',
    border: '#000',
    fill: '#000'
  },
  eco: {
    primary: '#000',
    border: '#000',
    fill: '#000'
  }
}

// Create a mapping of category keys to possible backend topic names
const CATEGORY_TO_TOPIC_MAPPING: Record<string, string[]> = {
  know: ['Knowledge And Values', 'Knowledge and Values', 'knowledge and values'],
  food: ['Food And Health', 'Food and Health', 'food and health'],
  physical: ['Physical And Mental Exercise', 'Physical and Mental Exercise', 'physical and mental exercise'],
  community: ['Community And Nature', 'Community and Nature', 'community and nature'],
  art: ['Art', 'art'],
  eco: ['Ecotechnologies', 'ecotechnologies', 'Eco Technologies', 'Eco-technologies']
}

// Order of categories for consistent mapping
const CATEGORY_ORDER = ['know', 'food', 'physical', 'community', 'art', 'eco'];

const Categories: React.FC = () => {
  // const router = useRouter()
  const t = useTranslations('web.subHeader.diamond')
  const dispatch = useAppDispatch()
  // const isOpen = useAppSelector(state => state.openBar.isOpen)

  const locale = useLocale()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('community')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const modalRef = React.useRef<HTMLDivElement>(null)

  // Use RTK Query for data fetching
  const {
    data: topicScores = [],
    isLoading: isLoadingTopics,
    error: topicsError
  } = useGetTopicScoresQuery(locale)

  const {
    data: subTopicScores = [],
    isLoading: isLoadingSubTopics,
    error: subTopicsError
  } = useGetSubTopicScoresQuery(
    selectedCategoryId!,
    { skip: !selectedCategoryId }
  )

  // Log the API response to see what we're getting
  useEffect(() => {
    if (topicScores.length > 0) {
      console.log('Topic scores from API:', topicScores)
    }
  }, [topicScores])

  // Category mapping with colors
  const categoryMapping: Record<string, CategoryInfo> = useMemo(() => ({
    know: {
      name: 'Knowledge And Values', // This is for internal use
      value: t("know"), // This is what's displayed
      icon: know,
      color: CATEGORY_COLORS.know.primary,
      borderColor: CATEGORY_COLORS.know.border
    },
    food: {
      name: 'Food And Health',
      value: t("food"),
      icon: food,
      color: CATEGORY_COLORS.food.primary,
      borderColor: CATEGORY_COLORS.food.border
    },
    physical: {
      name: 'Physical And Mental Exercise',
      value: t("physical"),
      icon: eco,
      color: CATEGORY_COLORS.physical.primary,
      borderColor: CATEGORY_COLORS.physical.border
    },
    community: {
      name: 'Community And Nature',
      value: t("community"),
      icon: community,
      color: CATEGORY_COLORS.community.primary,
      borderColor: CATEGORY_COLORS.community.border
    },
    art: {
      name: 'Art',
      value: t("art"),
      icon: art,
      color: CATEGORY_COLORS.art.primary,
      borderColor: CATEGORY_COLORS.art.border
    },
    eco: {
      name: 'Ecotechnologies',
      value: t("eco"),
      icon: physical,
      color: CATEGORY_COLORS.eco.primary,
      borderColor: CATEGORY_COLORS.eco.border
    },
  }), [t])

  const handleCategoryClick = useCallback((category: string) => {
    // Get possible topic names for this category
    const possibleTopicNames = CATEGORY_TO_TOPIC_MAPPING[category] || [categoryMapping[category].name]

    // Try to find a matching topic
    let foundTopic: TopicScore | undefined

    for (const possibleName of possibleTopicNames) {
      foundTopic = topicScores.find(topic => {
        // Try exact match
        if (topic.topicName === possibleName) return true
        // Try case-insensitive match
        if (topic.topicName.toLowerCase() === possibleName.toLowerCase()) return true
        // Try trimmed match
        if (topic.topicName.trim() === possibleName.trim()) return true
        // Try contains match
        if (topic.topicName.toLowerCase().includes(possibleName.toLowerCase())) return true

        return false
      })

      if (foundTopic) break
    }

    if (foundTopic) {
      setSelectedCategoryId(foundTopic.topicId)
      setSelectedCategory(category)
      setIsModalOpen(true)
    } else {

      // You might want to show an error message to the user
      alert(`Topic not found for ${categoryMapping[category].value}. Please check the console for more details.`)
    }
  }, [categoryMapping, topicScores])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedCategory('community')
    setSelectedCategoryId(null)
  }, [])

  const handleSubCategoryClick = useCallback((subTopicId: number) => {
    if (selectedCategoryId) {
      closeModal()
      dispatch(setOpenBar(false)) // Dispatch action to update openBar state
      window.location.assign(`?category=${selectedCategoryId}&subcategory=${subTopicId}`)
    }
  }, [selectedCategoryId, closeModal, dispatch])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false)
      }
    }

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalOpen])

  // Body scroll lock
  useEffect(() => {
    document.documentElement.style.overflow = isModalOpen ? 'hidden' : 'unset'
    return () => {
      document.documentElement.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Loading state
  if (isLoadingTopics) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    )
  }

  // Error state
  if (topicsError) {
    console.error('Error loading topics:', topicsError)
    return (
      <div className={styles.container}>
        <div className={styles.errorText}>Error loading categories</div>
      </div>
    )
  }

  return (
    <>
      <div data-tour="diamond" className={styles.container}>
        {/* Main Hexagon Chart */}
        <HexagonChart
          scores={topicScores}
          selectedCategory={selectedCategory}
          categoryColors={CATEGORY_COLORS}
          categoryMapping={categoryMapping}
          isMainChart={true}
        />

        {/* Diamond Background */}
        <div className={styles.diamondShape}>
          <Image src={diamond} alt="diamond" priority />
        </div>

        {/* Category Labels */}
        <div className={styles.labels}>
          {Object.entries(categoryMapping).map(([key, value], index) => (
            <CategoryLabel
              key={key}
              category={key}
              value={value}
              index={index}
              onClick={handleCategoryClick}
              isSelected={selectedCategory === key}
              color={CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS]}
            />
          ))}
        </div>

        <div className={styles.text}>
          <p>{t('sustainability')} <span>{t('personalG')}</span></p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CategoryModal
          ref={modalRef}
          selectedCategory={selectedCategory}
          categoryInfo={categoryMapping[selectedCategory]}
          subTopicScores={subTopicScores}
          isLoading={isLoadingSubTopics}
          error={subTopicsError}
          onClose={closeModal}
          onSubCategoryClick={handleSubCategoryClick}
          color={CATEGORY_COLORS[selectedCategory as keyof typeof CATEGORY_COLORS]}
        />
      )}
    </>
  )
}

// Hexagon Chart Component - Updated to show colored strokes for each category
interface HexagonChartProps {
  scores: TopicScore[]
  selectedCategory?: string
  categoryColors: typeof CATEGORY_COLORS
  categoryMapping?: Record<string, CategoryInfo>
  isMainChart?: boolean
}

const HexagonChart: React.FC<HexagonChartProps> = ({
  scores,
  selectedCategory,
  categoryColors,
  isMainChart = false
}) => {
  const HEX_RADIUS = 43

  const getPoint = (value: number, angle: number) => {
    const radius = (value / 100) * HEX_RADIUS
    const radian = (angle - 90) * (Math.PI / 180)
    const x = 50 + radius * Math.cos(radian)
    const y = 50 + radius * Math.sin(radian)
    return `${x},${y}`
  }

  // Map scores to categories for main chart
  const orderedScores = useMemo(() => {
    if (!scores || scores.length === 0) return []

    if (isMainChart) {
      // For main chart, order by categories
      return CATEGORY_ORDER.map(categoryKey => {
        const possibleNames = CATEGORY_TO_TOPIC_MAPPING[categoryKey] || []
        const score = scores.find(s =>
          possibleNames.some(name =>
            s.topicName.toLowerCase() === name.toLowerCase() ||
            s.topicName.toLowerCase().includes(name.toLowerCase())
          )
        )
        return {
          score: score || { topicId: 0, topicName: categoryKey, totalPoints: '0' },
          categoryKey
        }
      })
    } else {
      // For subcategory chart, use scores as is
      return scores.slice(0, 6).map(score => ({ score, categoryKey: selectedCategory }))
    }
  }, [scores, isMainChart, selectedCategory])

  // const points = useMemo(() => {
  //   if (orderedScores.length === 0) {
  //     return Array.from({ length: 6 }, (_, i) => getPoint(0, i * 60)).join(' ')
  //   }

  //   const mappedPoints = orderedScores.map(({ score }) => {
  //     const value = Math.min(parseInt(score.totalPoints), 100)
  //     return getPoint(value, score.totalPoints === '0' ? 0 : value)
  //   })

  //   // Ensure we have exactly 6 points
  //   while (mappedPoints.length < 6) {
  //     mappedPoints.push(getPoint(0, mappedPoints.length * 60))
  //   }

  //   return mappedPoints.join(' ')
  // }, [orderedScores])

  // Create path data for each segment with its own color
  const pathSegments = useMemo(() => {
    if (orderedScores.length === 0) return []

    return orderedScores.map(({ score, categoryKey }, index) => {
      const value = Math.min(parseInt(score.totalPoints), 100)
      const nextIndex = (index + 1) % orderedScores.length
      const nextValue = orderedScores[nextIndex]
        ? Math.min(parseInt(orderedScores[nextIndex].score.totalPoints), 100)
        : 0

      const currentPoint = getPoint(value, index * 60)
      const nextPoint = getPoint(nextValue, nextIndex * 60)

      return {
        path: `M ${currentPoint} L ${nextPoint}`,
        color: isMainChart
          ? categoryColors[categoryKey as keyof typeof categoryColors]?.primary
          : categoryColors[selectedCategory as keyof typeof categoryColors]?.primary || '#3B82F6'
      }
    })
  }, [orderedScores, categoryColors, isMainChart, selectedCategory])

  return (
    <div className={styles.chart}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Draw each segment with its category color */}
        {pathSegments.map((segment, index) => (
          <path
            key={`segment-${index}`}
            d={segment.path}
            stroke={segment.color}
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        ))}

        {/* Filled area */}
        {/* <polygon
          points={points}
          className={styles.filledArea}
          fill={isMainChart
            ? 'rgba(0, 102, 51, 0.2)' // Default green fill for main chart
            : (categoryColors[selectedCategory as keyof typeof categoryColors]?.fill || 'rgba(59, 130, 246, 0.2)')
          }
          stroke="none"
        /> */}
      </svg>
    </div>
  )
}

// Category Label Component
interface CategoryLabelProps {
  category: string
  value: CategoryInfo
  index: number
  onClick: (category: string) => void
  isSelected: boolean
  color: typeof CATEGORY_COLORS[keyof typeof CATEGORY_COLORS]
}

const CategoryLabel: React.FC<CategoryLabelProps> = ({
  category,
  value,
  index,
  onClick,
  isSelected,
  color
}) => {
  return (
    <span
      onClick={() => onClick(category)}
      className={clsx(
        styles.label,
        styles[`top${index + 1}`],
        { [styles.selected]: isSelected }
      )}
      style={{
        '--category-color': color.primary,
        '--category-border': color.border,
      } as React.CSSProperties}
    >
      <div className={styles.labelContent}>
        <Image src={value.icon} alt={category} width={32} height={32} />
      </div>
    </span>
  )
}

// Modal Component
interface CategoryModalProps {
  selectedCategory: string
  categoryInfo: CategoryInfo
  subTopicScores: TopicScore[]
  isLoading?: boolean
  error?: any
  onClose: () => void
  onSubCategoryClick: (subTopicId: number) => void
  color: typeof CATEGORY_COLORS[keyof typeof CATEGORY_COLORS]
}

const CategoryModal = React.forwardRef<HTMLDivElement, CategoryModalProps>(
  ({ selectedCategory, categoryInfo, subTopicScores, isLoading, error, onClose, onSubCategoryClick, color }, ref) => {
    return (
      <div className={styles.modal}>
        <div ref={ref} className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            &times;
          </button>

          <div className={styles.subCategories}>
            <div
              className={styles.categoryHeader}
              style={{ '--header-color': color.primary } as React.CSSProperties}
            >
              <Image
                src={categoryInfo.icon}
                alt={selectedCategory}
                width={40}
                height={40}
                className={styles.categoryIcon}
              />
              <h2>{categoryInfo.value.toUpperCase()}</h2>
            </div>

            <div className={styles.modalChartContainer}>
              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <p>Loading subcategories...</p>
                </div>
              ) : error ? (
                <div className={styles.errorContainer}>
                  <p>Error loading subcategories</p>
                </div>
              ) : (
                <>
                  <HexagonChart
                    scores={subTopicScores}
                    selectedCategory={selectedCategory}
                    categoryColors={CATEGORY_COLORS}
                    isMainChart={false}
                  />

                  <div className={styles.diamondShapeModal}>
                    <Image src={diamond} alt="diamond" />
                  </div>

                  <div className={styles.subLabels}>
                    {subTopicScores.map((subTopic, index) => (
                      <SubCategoryCard
                        key={subTopic.topicId}
                        subTopic={subTopic}
                        index={index}
                        onClick={onSubCategoryClick}
                        color={color}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CategoryModal.displayName = 'CategoryModal'

// Sub-category Card Component
interface SubCategoryCardProps {
  subTopic: TopicScore
  index: number
  onClick: (subTopicId: number) => void
  color: typeof CATEGORY_COLORS[keyof typeof CATEGORY_COLORS]
}

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({ subTopic, index, onClick, color }) => {
  const positionClass = styles[`top${index + 1}${index + 1}`]
  const trannss = useTranslations('web.post.categories')
  return (
    <div
      className={clsx(styles.subLabel, positionClass, styles.clickableSubLabel)}
      onClick={() => onClick(subTopic.topicId)}
      style={{
        '--card-color': color.primary,
        '--card-border': color.border,
        '--card-bg': color.fill,
      } as React.CSSProperties}
    >
      <span className={styles.points}>{subTopic.totalPoints}</span>
      <div className={styles.pointsText}>Points</div>
      <div className={styles.subTopicName}>{trannss(subTopic.topicName)}</div>
    </div>
  )
}

export default Categories