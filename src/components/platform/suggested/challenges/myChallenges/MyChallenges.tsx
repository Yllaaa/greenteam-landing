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
    <div
      onClick={props.onClick}
      className={`${styles.arrow} ${
        props.left ? styles.arrowLeft : styles.arrowRight
      } ${disabled}`}
      // xmlns="http://www.w3.org/2000/svg"
      // viewBox="0 0 24 24"
    >
      {props.left && (
        <svg
          className={styles.arrowLeft}
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" y="0.5" width="54" height="54" rx="27" />
          <path d="M40.0008 28C40.0008 28.2652 39.8954 28.5196 39.7079 28.7071C39.5204 28.8947 39.266 29 39.0008 29H19.4145L26.7083 36.2925C26.8012 36.3854 26.8749 36.4957 26.9252 36.6171C26.9755 36.7385 27.0013 36.8686 27.0013 37C27.0013 37.1314 26.9755 37.2615 26.9252 37.3829C26.8749 37.5043 26.8012 37.6146 26.7083 37.7075C26.6154 37.8004 26.5051 37.8741 26.3837 37.9244C26.2623 37.9747 26.1322 38.0006 26.0008 38.0006C25.8694 38.0006 25.7393 37.9747 25.6179 37.9244C25.4965 37.8741 25.3862 37.8004 25.2933 37.7075L16.2933 28.7075C16.2003 28.6146 16.1266 28.5043 16.0762 28.3829C16.0259 28.2615 16 28.1314 16 28C16 27.8686 16.0259 27.7385 16.0762 27.6171C16.1266 27.4957 16.2003 27.3854 16.2933 27.2925L25.2933 18.2925C25.4809 18.1049 25.7354 17.9995 26.0008 17.9995C26.2662 17.9995 26.5206 18.1049 26.7083 18.2925C26.8959 18.4801 27.0013 18.7346 27.0013 19C27.0013 19.2654 26.8959 19.5199 26.7083 19.7075L19.4145 27H39.0008C39.266 27 39.5204 27.1054 39.7079 27.2929C39.8954 27.4804 40.0008 27.7348 40.0008 28Z" />
        </svg>
      )}
      {!props.left && (
        <svg
          className={styles.arrowRight}
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="55" height="55" rx="27.5" />
          <path
            d="M36.7806 28.5306L30.0306 35.2806C29.8899 35.4213 29.699 35.5004 29.5 35.5004C29.301 35.5004 29.1101 35.4213 28.9694 35.2806C28.8286 35.1399 28.7496 34.949 28.7496 34.75C28.7496 34.551 28.8286 34.3601 28.9694 34.2194L34.4397 28.75H19.75C19.5511 28.75 19.3603 28.671 19.2197 28.5303C19.079 28.3897 19 28.1989 19 28C19 27.8011 19.079 27.6103 19.2197 27.4697C19.3603 27.329 19.5511 27.25 19.75 27.25H34.4397L28.9694 21.7806C28.8286 21.6399 28.7496 21.449 28.7496 21.25C28.7496 21.051 28.8286 20.8601 28.9694 20.7194C29.1101 20.5786 29.301 20.4996 29.5 20.4996C29.699 20.4996 29.8899 20.5786 30.0306 20.7194L36.7806 27.4694C36.8504 27.539 36.9057 27.6217 36.9434 27.7128C36.9812 27.8038 37.0006 27.9014 37.0006 28C37.0006 28.0986 36.9812 28.1961 36.9434 28.2872C36.9057 28.3782 36.8504 28.461 36.7806 28.5306Z"
            fill="#FEFEFE"
          />
        </svg>
      )}
    </div>
  );
}
