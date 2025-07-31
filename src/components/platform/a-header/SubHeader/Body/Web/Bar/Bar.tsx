/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import styles from "./Bar.module.scss"
import axios from 'axios'
import { getToken } from '@/Utils/userToken/LocalToken'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { FaArrowDown } from 'react-icons/fa6'
import { useTour } from '@/components/AA-NEW/MODALS/A_GUIDE/tourProvider'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setOpenBar } from '@/store/features/baropen/useOpenBar'

function Bar({ children }: { children: React.ReactNode }) {
  const token = getToken()
  const accessToken = token ? token.accessToken : null
  const username = token ? token.user.username : null
  const locale = useLocale()
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(state => state.openBar.isOpen)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  // const [isExpanded, setIsExpanded] = useState(false)
  const [manuallyOpened, setManuallyOpened] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prevStepRef = useRef<number | null>(null)

  const t = useTranslations("web.subHeader.breif2")
  const { isTourActive, currentTourId, currentStepIndex } = useTour()

  // Fetch user score
  useEffect(() => {
    if (!username || !accessToken) {
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          "Accept-Language": locale,
        },
        signal: controller.signal
      })
      .then((response) => {
        setScore(response.data.userScore || 0)
        setIsLoading(false)
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.error('Failed to fetch user score:', error)
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [username, accessToken, locale])

  // Toggle bar with animation
  const toggleBar = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)
    // setIsExpanded(prev => !prev)
    dispatch(setOpenBar(!isOpen)) // Dispatch action to update openBar state
    setManuallyOpened(prev => !prev)

    // Reset animation flag after transition
    setTimeout(() => setIsAnimating(false), 300)
  }, [dispatch, isAnimating, isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isTourActive) {
        // setIsExpanded(false)
        dispatch(setOpenBar(!isOpen))
        setManuallyOpened(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [dispatch, isOpen, isTourActive])

  // Smooth scroll to top
  const scrollToTop = useCallback(() => {
    if (childrenRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      const smoothScroll = () => {
        if (childrenRef.current) {
          const currentScroll = childrenRef.current.scrollTop
          if (currentScroll > 0) {
            childrenRef.current.scrollTop = Math.max(0, currentScroll - currentScroll / 8)
            requestAnimationFrame(smoothScroll)
          }
        }
      }
      requestAnimationFrame(smoothScroll)
    }
  }, [])

  // Handle tour state changes
  useEffect(() => {
    if (isTourActive && currentTourId === 'header-tour') {
      const shouldExpand = currentStepIndex === 3 || currentStepIndex === 4 || currentStepIndex === 5


      if (shouldExpand !== isOpen) {
        // setIsExpanded(shouldExpand)
        dispatch(setOpenBar(!isOpen))
        setManuallyOpened(false)

        if (shouldExpand && prevStepRef.current !== currentStepIndex) {
          // Clear any existing timeout
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }

          // Delay scroll to ensure content is rendered
          scrollTimeoutRef.current = setTimeout(() => {
            scrollToTop()
          }, currentStepIndex === 3 ? 400 : 200)
        }
      }
    }

    prevStepRef.current = currentStepIndex

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isTourActive, currentTourId, currentStepIndex, dispatch, isOpen])

  // Handle scroll behavior with debouncing
  useEffect(() => {
    let ticking = false

    const updateScrollState = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop

      if (manuallyOpened || isTourActive) {
        ticking = false
        return
      }

      // Show header at top
      if (currentScrollY < 5) {
        setShowHeader(true)
      }
      // Hide header when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false)
        if (!isOpen && !manuallyOpened && !isTourActive) {
          // setIsExpanded(true)
          dispatch(setOpenBar(!isOpen))
        }
      }
      // Show header when scrolling up
      else if (currentScrollY < lastScrollY) {
        setShowHeader(true)
        if (isOpen && !manuallyOpened && !isTourActive) {
          // setIsExpanded(false)
          dispatch(setOpenBar(!isOpen))
        }
      }

      setLastScrollY(currentScrollY)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState)
        ticking = true
      }
    }

    // Add passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, manuallyOpened, isTourActive, dispatch, isOpen])

  // Format score with locale-specific thousands separator
  const formattedScore = new Intl.NumberFormat(locale).format(score)

  return (
    <section
      ref={containerRef}
      className={`${styles.container} ${!showHeader ? styles.hidden : ''} ${isOpen ? styles.expanded : ''}`}
      role="complementary"
      aria-label={t("yourPoints")}

      style={{ cursor: isAnimating ? 'not-allowed' : 'pointer' }}
    // aria-expanded={isOpen}
    >
      <div onClick={toggleBar} className={`${styles.breifContainer} ${isOpen ? styles.active : ""}`}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.subtitle}>{t("yourPoints")}</h2>
          <div className={`${styles.breifText} ${!isLoading ? styles.loaded : ''}`}>
            <p className={styles.scoreText}>
              <span className={styles.scoreNumber} aria-live="polite">
                {isLoading ? '...' : formattedScore}
              </span>
              <span className={styles.pointsLabel}>{t("points")}</span>
            </p>
          </div>
        </div>
        <button
          className={`${styles.openIcon} ${isOpen ? styles.rotated : ''}`}
          // onClick={toggleBar}
          aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
          disabled={isAnimating}
        >
          <FaArrowDown />
        </button>
      </div>
      <div
        ref={childrenRef}
        className={`${styles.children} ${isOpen ? styles.active : ""}`}
        role="region"
        aria-hidden={!isOpen}
      >
        <div className={styles.childrenContent}>
          {children}
        </div>
      </div>
    </section>
  )
}

export default React.memo(Bar)