'use client'
import React, { useEffect, useState, useRef } from 'react'
import styles from "./Bar.module.scss"
import axios from 'axios'
import { getToken } from '@/Utils/userToken/LocalToken'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { FaArrowDown } from 'react-icons/fa6'

function Bar({ children }: { children: React.ReactNode }) {
  const token = getToken()
  const accessToken = token ? token.accessToken : null
  const username = token ? token.user.username : null
  const locale = useLocale()
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

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
  const openBar = () => {
    setBar(!bar);
  }

  // Header visibility states
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle scroll behavior for header visibility
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        // Keep header visible at the top
        if (currentScrollY < 5) {
          setShowHeader(true);
          if (bar) {
            setBar(false);
          }
        }
        // Hide header only after scrolling down significantly
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowHeader(false);
          // Only auto-expand bar if it's not already manually opened
          if (!bar) {
            setBar(true);
          }
        }
        // Always show header when scrolling up
        else if (currentScrollY < lastScrollY) {
          setShowHeader(true);
          // Close expanded bar when scrolling up
          if (bar) {
            setBar(false);
          }
        }

        setLastScrollY(currentScrollY);
      }
    };

    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      const timeout = setTimeout(controlHeader, 10);
      setScrollTimeout(timeout);
    };

    // Always listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY, scrollTimeout, bar]);

  const t = useTranslations("web.subHeader.breif")

  return (
    <>
      <section
        ref={containerRef}
        className={`${styles.container} ${!showHeader ? styles.hidden : ''} ${bar ? styles.expanded : ''}`}
      >
        <div className={`${styles.breifContainer} ${bar ? styles.active : ""}`}>
          <div className={styles.contentWrapper}>
            <p className={styles.label}>{t("yourPoints")}</p>
            <h5 className={styles.subtitle}>{t("track")}</h5>
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
        <div className={`${styles.children} ${bar ? styles.active : ""}`}>
          <div className={styles.childrenContent}>
            {children}
          </div>
        </div>
      </section>
    </>
  )
}

export default Bar