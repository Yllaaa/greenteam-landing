/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import styles from "./suggested.module.css";
import Challenges from "./challenges/allCahalenges/Challenges";
function Suggested() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  return (
    <>
      <div className={`${styles.navigationWrapper} ${styles.container}`}>
        <div ref={sliderRef} className={`keen-slider`}>
          <div className={`keen-slider__slide ${styles.suggested}`}>
            <Challenges />
          </div>
          <div className={`keen-slider__slide ${styles.suggested}`}>2</div>
          <div className={`keen-slider__slide ${styles.suggested}`}>3</div>
          <div className={`keen-slider__slide ${styles.suggested}`}>4</div>
          <div className={`keen-slider__slide ${styles.suggested}`}>5</div>
          <div className={`keen-slider__slide ${styles.suggested}`}>6</div>
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
      {loaded && instanceRef.current && (
        <div className={styles.dots}>
          {[
            ...Array(instanceRef.current.track.details.slides.length).keys(),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={
                  styles.dot + (currentSlide === idx ? styles.active : "")
                }
              ></button>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Suggested;

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
