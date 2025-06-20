import React, { useRef, useState, useEffect } from 'react'
import styles from './ScrollArrows.module.scss'

interface ScrollArrowsProps {
  children: React.ReactNode
  className?: string
  arrowClassName?: string
  showArrows?: 'always' | 'hover' | 'auto'
  scrollAmount?: number
  arrowSize?: 'small' | 'medium' | 'large'
  arrowPosition?: 'inside' | 'outside'
}

export const ScrollArrows: React.FC<ScrollArrowsProps> = ({
  children,
  className = '',
  arrowClassName = '',
  showArrows = 'auto',
  scrollAmount = 300,
  arrowSize = 'medium',
  arrowPosition = 'inside',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const checkScrollability = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => checkScrollability()
    container.addEventListener('scroll', handleScroll)
    
    // Check on resize
    const resizeObserver = new ResizeObserver(checkScrollability)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [children])

  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    })
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }

  const shouldShowArrows = () => {
    if (showArrows === 'always') return true
    if (showArrows === 'hover') return isHovered
    if (showArrows === 'auto') return canScrollLeft || canScrollRight
    return false
  }

  return (
    <div 
      className={`${styles.wrapper} ${styles[arrowPosition]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {shouldShowArrows() && canScrollLeft && (
        <button
          className={`${styles.arrow} ${styles.arrowLeft} ${styles[arrowSize]} ${arrowClassName}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className={styles.scrollContainer}
      >
        {children}
      </div>

      {shouldShowArrows() && canScrollRight && (
        <button
          className={`${styles.arrow} ${styles.arrowRight} ${styles[arrowSize]} ${arrowClassName}`}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}