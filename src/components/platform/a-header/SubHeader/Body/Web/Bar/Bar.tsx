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

  // Effect to handle tour-based dropdown control
  useEffect(() => {
    // Check if header tour is active
    if (isTourActive && currentTourId === 'header-tour') {
      // Steps 6 and 7 are the profile-related steps (0-indexed)
      // Step 6: [data-tour="profile"] - "Access your profile settings"
      // Step 7: [data-tour="navigate-profile"] - "Navigate to your profile"
      if (currentStepIndex === 3 || currentStepIndex === 4 || currentStepIndex === 5) {
        setBar(true);
        setManuallyOpened(false); // Reset manual state during tour

        // Scroll to top of children section when tour opens it
        setTimeout(() => {
          if (childrenRef.current) {
            childrenRef.current.scrollTop = 0;
          }
        }, 100); // Small delay to ensure content is rendered
      } else {
        setBar(false);
        setManuallyOpened(false);
      }
    }
  }, [isTourActive, currentTourId, currentStepIndex]);

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