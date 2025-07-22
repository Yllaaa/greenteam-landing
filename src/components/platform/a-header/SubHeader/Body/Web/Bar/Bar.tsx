'use client'
import React, { useEffect, useState, useRef } from 'react'
import styles from "./Bar.module.scss"
import axios from 'axios'
import { getToken } from '@/Utils/userToken/LocalToken'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { FaArrowDown } from 'react-icons/fa6'
import { useTour } from '@/components/AA-NEW/MODALS/A_GUIDE/tourProvider'

function Bar({ children }: { children: React.ReactNode }) {
  const token = getToken()
  const accessToken = token ? token.accessToken : null
  const username = token ? token.user.username : null
  const locale = useLocale()
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null) // Add ref for children section

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          "Accept-Language": `${locale}`,
        },
      })
      .then((response) => {
        setScore(response.data.userScore)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [bar, setBar] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState(false); // Track if user manually opened

  const openBar = () => {
    setBar(!bar);
    setManuallyOpened(!bar); // Set manual state when user clicks
  }

  // Get tour state from the tour provider
  const { isTourActive, currentTourId, currentStepIndex } = useTour();

  // Track previous step to detect step changes
  const prevStepRef = useRef<number | null>(null);

  // Effect to handle tour-based dropdown control
  useEffect(() => {
    // Check if header tour is active
    if (isTourActive && currentTourId === 'header-tour') {
      // Steps 3, 4, and 5 (0-indexed)
      if (currentStepIndex === 3 || currentStepIndex === 4 || currentStepIndex === 5) {
        setBar(true);
        setManuallyOpened(false); // Reset manual state during tour

        // Scroll to top when entering these steps or when step changes
        if (prevStepRef.current !== currentStepIndex) {
          // Use a longer timeout for step 3 (index 3) to ensure content is fully rendered
          const scrollDelay = currentStepIndex === 3 ? 300 : 100;

          setTimeout(() => {
            if (childrenRef.current) {
              childrenRef.current.scrollTop = 0;
              // Force a second scroll reset for step 3
              if (currentStepIndex === 3) {
                setTimeout(() => {
                  if (childrenRef.current) {
                    childrenRef.current.scrollTop = 0;
                  }
                }, 100);
              }
            }
          }, scrollDelay);
        }
      } else {
        setBar(false);
        setManuallyOpened(false);
      }
    }

    // Update previous step reference
    prevStepRef.current = currentStepIndex;
  }, [isTourActive, currentTourId, currentStepIndex]);

  // Also reset scroll when bar state changes
  useEffect(() => {
    if (bar && childrenRef.current) {
      // Small delay to ensure transition completes
      setTimeout(() => {
        if (childrenRef.current) {
          childrenRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [bar]);

  // Header visibility states
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior for header visibility
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        // Don't auto-close if manually opened OR if tour is active
        if (manuallyOpened || isTourActive) {
          return;
        }

        // Keep header visible at the top
        if (currentScrollY < 5) {
          setShowHeader(true);
        }
        // Hide header only after scrolling down significantly
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowHeader(false);
          // Only auto-expand bar if it's not already manually opened and tour is not active
          if (!bar && !manuallyOpened && !isTourActive) {
            setBar(true);
          }
        }
        // Always show header when scrolling up
        else if (currentScrollY < lastScrollY) {
          setShowHeader(true);
          // Only close if not manually opened and tour is not active
          if (bar && !manuallyOpened && !isTourActive) {
            setBar(false);
          }
        }

        setLastScrollY(currentScrollY);
      }
    };

    const handleScroll = () => {
      controlHeader();
    };

    // Always listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, bar, manuallyOpened, isTourActive]);

  const t = useTranslations("web.subHeader.breif2")

  return (
    <>
      <section
        ref={containerRef}
        className={`${styles.container} ${!showHeader ? styles.hidden : ''} ${bar ? styles.expanded : ''} ${styles.noAnimation}`}
      >
        <div className={`${styles.breifContainer} ${bar ? styles.active : ""}`}>
          <div className={styles.contentWrapper}>
            {/* <p className={styles.label}>{t("yourPoints")}</p> */}
            <h5 className={styles.subtitle}>{t("yourPoints")}</h5>
            <div className={`${styles.breifText} ${!isLoading ? styles.loaded : ''}`}>
              <p className={styles.scoreText}>
                <span className={styles.scoreNumber}>{score}</span>
                <span className={styles.pointsLabel}>{t("points")}</span>
              </p>
            </div>
          </div>
          <div className={`${styles.openIcon} ${bar ? styles.rotated : ''}`}>
            <FaArrowDown onClick={openBar} />
          </div>
        </div>
        <div
          ref={childrenRef} // Add ref here
          className={`${styles.children} ${bar ? styles.active : ""}`}
        >
          <div className={styles.childrenContent}>
            {children}
          </div>
        </div>
      </section>
    </>
  )
}

export default Bar