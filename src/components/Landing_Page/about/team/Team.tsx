"use client"
import React, { useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import styles from './team.module.css'
import Image from 'next/image'
import img1 from "@/../public/about/1.jpg"
import img2 from "@/../public/about/2.jpg"

function Team() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loaded, setLoaded] = useState(false)

    const teamMembers = [
        {
            name: "John Doe",
            position: "CEO",
            image: img1
        },
        {
            name: "Jane Smith",
            position: "CTO",
            image: img2
        },
        {
            name: "Mike Johnson",
            position: "CFO",
            image: img1
        },
        {
            name: "Sarah Williams",
            position: "COO",
            image: img2
        },
        {
            name: "David Brown",
            position: "Head of Marketing",
            image: img1
        },
        {
            name: "Emily Davis",
            position: "Head of Sales",
            image: img2
        }
    ]

    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        loop: true,
        created() {
            setLoaded(true)
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel)
        },
        slides: {
            perView: 4,
            spacing: 24,
        },
        breakpoints: {
            '(max-width: 1024px)': {
                slides: { perView: 3, spacing: 20 },

            },
            '(max-width: 768px)': {
                slides: { perView: 2, spacing: 16 },

            },
            '(max-width: 480px)': {
                slides: { perView: 1, spacing: 16 },

            },
        },
    })

    return (
        <div className={styles.container}>
            <div className={styles.navBtn}>
                {loaded && instanceRef.current && (
                    <>
                        <button
                            className={`${styles.navButton} ${styles.navButtonLeft}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                instanceRef.current?.prev()
                            }}
                            disabled={currentSlide === 0}
                            aria-label="Previous"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <button
                            className={`${styles.navButton} ${styles.navButtonRight}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                instanceRef.current?.next()
                            }}
                            disabled={
                                currentSlide ===
                                instanceRef.current.track.details.slides.length - 1
                            }
                            aria-label="Next"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    MEET THE <span className={styles.greenText}>GREENTEAM</span>
                </h2>
            </div>

            <div className={styles.sliderWrapper}>

                <div ref={sliderRef} className="keen-slider">
                    {teamMembers.map((member, index) => (
                        <div key={index} className={`keen-slider__slide ${styles.slide}`}>
                            <div className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        className={styles.memberImage}
                                    />
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3 className={styles.memberName}>{member.name}</h3>
                                    <p className={styles.memberPosition}>{member.position}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {loaded && instanceRef.current && (
                <div className={styles.pagination}>
                    {[
                        ...Array(instanceRef.current.track.details.slides.length - 3).keys(),
                    ].map((idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                instanceRef.current?.moveToIdx(idx)
                            }}
                            className={`${styles.dot} ${currentSlide === idx ? styles.activeDot : ''}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Team