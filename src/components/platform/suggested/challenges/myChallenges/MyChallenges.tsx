/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import styles from "./MyChallenges.module.css";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function MyChallenges() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slides: { perView: 1 },

    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  const postContent = "lorem ipsum dolor sit amet";
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>My Challenges</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
            consequuntur saepe, sint quam sed optio!
          </p>
        </div>
        <div className={styles.challenges}>
          {/*  */}
          <div className={styles.challenge}>
            <div
              ref={sliderRef}
              className={`keen-slider ${styles.postContainer}`}
            >
              {/*  */}
              <div className={`keen-slider__slide ${styles.postedChallenge}`}>
                <div className={styles.challengeHeader}>
                  <div className={styles.userAvatar}></div>
                  <div className={styles.details}>
                    <div className={styles.userName}>
                      <p>
                        John Doe <span>@JohnDoe</span>
                        <span>{" . "}23S</span>
                      </p>
                    </div>
                    <div className={styles.post}>
                      {postContent.length > 50 ? (
                        <p>
                          {postContent.slice(0, 40)} <span>Read More... </span>
                        </p>
                      ) : (
                        <p>{postContent.slice(0, 50)}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.challengeImage}></div>
                <div className={styles.challengeActions}>
                  <button
                    onClick={() => {
                      ToastNot("Challenge Accepted");
                    }}
                    className={styles.challengeButton}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      ToastNot("Challenge Accepted");
                    }}
                    className={styles.challengeButton}
                  >
                    Accept
                  </button>
                </div>
              </div>
              {/*  */}
            </div>
          </div>
        </div>
        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            />
          </>
        )}
      </div>
    </>
  );
}

export default MyChallenges;

function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}) {
  const disabled = props.disabled ? styles.arrowDisabled : "";
  return (
    <svg
      onClick={props.onClick}
      className={`${styles.arrow} ${
        props.left ? styles.arrowLeft : styles.arrowRight
      } ${disabled}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
