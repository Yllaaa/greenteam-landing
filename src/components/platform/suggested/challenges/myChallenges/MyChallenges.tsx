"use client";
import React from "react";
import styles from "./MyChallenges.module.css";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import MyChallengeCard from "./myChallengesCard/MyChallengeCard";

function MyChallenges() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slides: { perView: 1 },
  });

  return (
    <>
      <div className={styles.MyContainer}>
        {/*  */}
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>My Challenges</h2>
          </div>
          <div className={styles.challenges}>
            {/*  */}
            <div
              ref={sliderRef}
              className={`keen-slider ${styles.postContainer}`}
            >
              {/*  */}
              <div className={`keen-slider__slide ${styles.postedChallenge}`}>
                <MyChallengeCard />
              </div>
              {/*  */}
            </div>
          </div>
        </div>
        {/*  */}
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>My Challenges</h2>
          </div>
          <div className={styles.challenges}>
            {/*  */}
            <div
              ref={sliderRef}
              className={`keen-slider ${styles.postContainer}`}
            >
              {/*  */}
              <div className={`keen-slider__slide ${styles.postedChallenge}`}>
                <MyChallengeCard />
              </div>
              {/*  */}
            </div>
          </div>
        </div>
        {/*  */}
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>My Challenges</h2>
          </div>
          <div className={styles.challenges}>
            {/*  */}
            <div
              ref={sliderRef}
              className={`keen-slider ${styles.postContainer}`}
            >
              {/*  */}
              <div className={`keen-slider__slide ${styles.postedChallenge}`}>
                <MyChallengeCard />
              </div>
              {/*  */}
            </div>
          </div>
        </div>
        {/*  */}
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>My Challenges</h2>
          </div>
          <div className={styles.challenges}>
            {/*  */}
            <div
              ref={sliderRef}
              className={`keen-slider ${styles.postContainer}`}
            >
              {/*  */}
              <div className={`keen-slider__slide ${styles.postedChallenge}`}>
                <MyChallengeCard />
              </div>
              {/*  */}
            </div>
          </div>
        </div>
        {/*  */}
      </div>
    </>
  );
}

export default MyChallenges;
