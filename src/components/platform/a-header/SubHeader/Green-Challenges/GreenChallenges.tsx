/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import styles from "./GreenChallenges.module.css";
import Challenges from "./allCahalenges/Challenges";
import AddNewModal from "./modal/addNew/AddNewModal";
import DoItModal from "../../../modals/toDo/DoItModal";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import Image from "next/image";
import plus from "@/../public/ZPLATFORM/challenges/plus.svg";
import star from "@/../public/ZPLATFORM/challenges/star.svg";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { Challenge } from "./GreenTypes/GreenTypes";

function GreenChallenges() {
  const user = getToken();
  const accessToken = user.accessToken;
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
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [page, setPage] = useState(1);

  // modals
  const [addNew, setAddNew] = React.useState(false);
  const [challengeId, setChallengeId] = React.useState("");
  const [doItModal, setDoItModal] = React.useState(false);
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/green-challenges?page=${page}&limit=3`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        if (res.data.length === 0) {
          setPage(1);
        } else {
          setChallenges(res.data);
        }
      })
      .then(() => {
        console.log(challenges);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, addNew, doItModal]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h2>Green Challenges</h2>
            <p>
              Share 3 impactful campaigns to raise awareness and amplify the
              message of sustainability
            </p>
          </div>
          <div className={styles.headerBtn}>
            <button
              onClick={() => {
                ToastNot("Challenge Accepted");
                setDoItModal(true);
              }}
              className={styles.challengeButton}
            >
              <Image src={star} alt="star" /> Do It
            </button>
            <button
              onClick={() => {
                ToastNot("Challenge Accepted");
              }}
              className={styles.addButton}
            >
              <Image src={plus} alt="plus" />
            </button>
          </div>
        </div>

        <div className={`${styles.navigationWrapper}`}>
          <div ref={sliderRef} className={`keen-slider `}>
            <div className={`keen-slider__slide ${styles.suggested}`}>
              <Challenges
                challenges={challenges}
                setAddNew={setAddNew}
                setChallengeId={setChallengeId}
                setDoItModal={setDoItModal}
              />
            </div>
          </div>
          {loaded && instanceRef.current && (
            <>
              <Arrow
                left
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentSlide === 0}
              />

              <Arrow
                onClick={() => setPage(page + 1)}
                disabled={
                  currentSlide ===
                  instanceRef.current.track.details?.slides.length - 1
                }
              />
            </>
          )}
        </div>
      </div>
      {/* Modal */}
      {addNew && (
        <>
          <AddNewModal
            setAddNew={setAddNew}
            addNew={addNew}
            challengeId={challengeId}
          />
        </>
      )}
      {doItModal && (
        <>
          <DoItModal
            setDoItModal={setDoItModal}
            doItModal={doItModal}
            challengeId={challengeId}
          />
        </>
      )}
    </>
  );
}

export default GreenChallenges;

function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: () => void;
}) {
  const disabled = props.disabled ? styles.arrowDisabled : "";
  return (
    <div
      onClick={props.onClick}
      className={`${styles.arrow} ${
        props.left ? styles.arrowLeft : styles.arrowRight
      } ${disabled}`}
    >
      {props.left && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaArrowLeft />
        </div>
      )}
      {!props.left && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaArrowRight />
        </div>
      )}
    </div>
  );
}
