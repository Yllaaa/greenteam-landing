/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import styles from "./suggested.module.css";
import Challenges from "./challenges/allCahalenges/Challenges";
import AddNewModal from "../modals/addNew/AddNewModal";
import DoItModal from "../modals/toDo/DoItModal";
function Suggested() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = useState(false);
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

  // modals
  const [addNew, setAddNew] = React.useState(false);
  const [doItModal, setDoItModal] = React.useState(false);

  return (
    <>
      <div className={`${styles.navigationWrapper}`}>
        <div ref={sliderRef} className={`keen-slider ${styles.container}`}>
          <div className={`keen-slider__slide ${styles.suggested}`}>
            <Challenges setAddNew={setAddNew} setDoItModal={setDoItModal} />
          </div>
          <div className={`keen-slider__slide ${styles.suggested}`}>
            <Challenges setAddNew={setAddNew} setDoItModal={setDoItModal} />
          </div>
          <div className={`keen-slider__slide ${styles.suggested}`}>
            <Challenges setAddNew={setAddNew} setDoItModal={setDoItModal} />
          </div>
          <div className={`keen-slider__slide ${styles.suggested}`}>
            <Challenges setAddNew={setAddNew} setDoItModal={setDoItModal} />
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
                  className={` ${styles.dot} ${
                    currentSlide === idx ? styles.active : ""
                  }`}
                ></button>
              );
            })}
          </div>
        )}
      </div>
      {/* Modal */}
      {addNew && (
        <>
          <AddNewModal setAddNew={setAddNew} addNew={addNew} />
        </>
      )}
      {doItModal && (
        <>
          <DoItModal setDoItModal={setDoItModal} doItModal={doItModal} />
        </>
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
