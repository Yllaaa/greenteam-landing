/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'
import styles from './categories.module.css'
import Image from 'next/image'
import diamond from '@/../public/ZPLATFORM/categories/GroupD.png'
import community from '@/../public/ZPLATFORM/categories/community.svg'
import art from '@/../public/ZPLATFORM/categories/art.svg'
import eco from '@/../public/ZPLATFORM/categories/eco.svg'
import food from '@/../public/ZPLATFORM/categories/food.svg'
import physical from '@/../public/ZPLATFORM/categories/know.svg'
import know from '@/../public/ZPLATFORM/categories/physical.svg'
import axios from 'axios'
import { getToken } from '@/Utils/userToken/LocalToken'
import { useTranslations } from 'next-intl'
import { StaticImageData } from 'next/image'
import { useRouter } from 'next/navigation'

interface TopicScore {
  topicId: number
  topicName: string
  totalPoints: string
}

interface CategoryInfo {
  name: string
  icon: StaticImageData
  value: string
}

function Categories() {
  const router = useRouter()
  const token = getToken()
  const accessToken = token ? token.accessToken : null
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [topicScores, setTopicScores] = useState<TopicScore[]>([])
  const [subTopicScores, setSubTopicScores] = useState<TopicScore[]>([])
  const t = useTranslations('web.subHeader.diamond')

  // Mapping between component categories and backend topic names with icons
  const categoryMapping: Record<string, CategoryInfo> = {
    know: { name: 'Knowledge And Values', value: t("know"), icon: know },
    food: { name: 'Food And Health', value: t("food"), icon: food },
    physical: { name: 'Physical And Mental Exercise', value: t("physical"), icon: physical },
    community: { name: 'Community And Nature', value: t("community"), icon: community },
    art: { name: 'Art', value: t("art"), icon: art },
    eco: { name: 'Ecotechnologies', value: t("eco"), icon: eco },
  }

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/score/main-topics`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        setTopicScores(res.data)
      })
      .catch((error) => {
        console.error('Error fetching topic scores:', error)
      })
  }, [])

  const [selectedCategory, setSelectedCategory] = useState<
    keyof typeof categoryMapping
  >('community')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const modalRef = React.useRef<HTMLDivElement>(null)

  const handleCategoryClick = (category: keyof typeof categoryMapping) => {
    const selectedTopic = categoryMapping[category].name
    const topicId = topicScores.find(
      (topic) => topic.topicName === selectedTopic
    )?.topicId

    if (topicId) {
      setSelectedCategoryId(topicId)

      // Fetch sub-topics for the selected category
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/score/sub-topics/${topicId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          const filteredScores = res.data
          setSubTopicScores(filteredScores)
          setSelectedCategory(category)
          setIsModalOpen(true)
        })
        .catch((error) => {
          console.error('Error fetching sub-topic scores:', error)
        })
    }
  }

  const handleSubCategoryClick = (subTopicId: number) => {
    if (selectedCategoryId) {
      // Close the modal
      closeModal()

      // Navigate to home page with category and subcategory parameters
      router.push(`?category=${selectedCategoryId}&subcategory=${subTopicId}`);

      // Optional: If you want to scroll to a specific section on the home page
      // You can add a setTimeout and use the scrollIntoView method
      setTimeout(() => {
        const section = document.getElementById(`section-${subTopicId}`);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  useEffect(() => {
    const htmlElelemtTag = document.documentElement
    if (isModalOpen) {
      htmlElelemtTag.style.overflow = 'hidden'
    } else {
      htmlElelemtTag.style.overflow = 'unset'
    }
  }, [isModalOpen])

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCategory('community')
  }

  const HEX_RADIUS = 43

  const getPoint = (value: number, angle: number) => {
    const radius = (value / 100) * HEX_RADIUS // Scale value to adjusted hex radius
    const radian = (angle - 90) * (Math.PI / 180) // Convert angle to radians
    const x = 50 + radius * Math.cos(radian) // Center X at 50
    const y = 50 + radius * Math.sin(radian) // Center Y at 50
    return `${x},${y}`
  }

  // Get points based on actual topic scores
  const getScaledPoints = (scores?: TopicScore[]) => {
    // If no scores, return random points
    if (!scores || scores.length === 0) {
      return [
        getPoint(Math.floor(0), 0),
        getPoint(Math.floor(0), 60),
        getPoint(Math.floor(0), 120),
        getPoint(Math.floor(0), 180),
        getPoint(Math.floor(0), 240),
        getPoint(Math.floor(0), 300),
      ].join(' ')
    }

    // Map points to create hexagon
    const points = scores.map((score, index) => {
      const value = Math.min(parseInt(score.totalPoints), 100)
      return getPoint(value, index * 60)
    })

    // If fewer than 6 points, pad with zeros
    while (points.length < 6) {
      points.push(getPoint(0, points.length * 60))
    }

    return points.join(' ')
  }

  return (
    <>
      <div style={{ zIndex: 0 }} className={styles.container}>
        <div style={{ zIndex: 11 }} className={styles.chart}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points={getScaledPoints(topicScores)}
              className={styles.filledArea}
            />
          </svg>
        </div>
        <div style={{ zIndex: 10 }} className={styles.diamondShape}>
          <Image src={diamond} alt="diamond" />
        </div>
        <div style={{ zIndex: 1000 }} className={styles.labels}>
          {Object.entries(categoryMapping).map(([key, value]) => {
            return (
              <span
                key={key}
                onClick={() =>
                  handleCategoryClick(key as keyof typeof categoryMapping)
                }
                className={`${styles.label} ${styles[`top${Object.keys(categoryMapping).indexOf(key) + 1}`]
                  }`}
              >
                <Image src={value.icon} alt={key} />
              </span>
            )
          })}
        </div>
        <div className={styles.text}>
          <p>{t('sustainability')}</p>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && selectedCategory && (
        <div className={styles.modal}>
          <div ref={modalRef} className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal} aria-label="Close modal">
              &times;
            </button>

            <div className={styles.subCategories}>
              <div className={styles.categoryHeader}>
                <Image
                  src={categoryMapping[selectedCategory].icon}
                  alt={selectedCategory}
                  width={40}
                  height={40}
                  className={styles.categoryIcon}
                />
                <h2>{categoryMapping[selectedCategory].value.toUpperCase()}</h2>
              </div>

              <div style={{ position: 'relative', height: '450px' }}>
                {/* Charts */}
                <div style={{ zIndex: 11 }} className={styles.chart}>
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <polygon
                      points={getScaledPoints(subTopicScores)}
                      className={styles.filledArea}
                    />
                  </svg>
                </div>

                {/* Diamond shape */}
                <div style={{ zIndex: 10 }} className={styles.diamondShapeModal}>
                  <Image src={diamond} alt="diamond" />
                </div>

                {/* Sub category cards */}
                <div style={{ zIndex: 1000 }} className={styles.subLabels}>
                  {subTopicScores.map((subTopic, index) => {
                    // Position class based on index
                    const positionClass = styles[`top${index + 1}${index + 1}`];

                    return (
                      <div
                        key={subTopic.topicId}
                        className={`${styles.subLabel} ${positionClass} ${styles.clickableSubLabel}`}
                        onClick={() => handleSubCategoryClick(subTopic.topicId)}
                      >
                        <span>{subTopic.totalPoints}</span>
                        <div className={styles.pointsText}>Points</div>
                        <div className={styles.subTopicName}>{subTopic.topicName}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Categories