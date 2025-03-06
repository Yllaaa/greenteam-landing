// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import styles from "./Chalenges.module.css";
import doIt from "@/../public/ZPLATFORM/challenges/doIt.svg";

import Image from "next/image";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { Challenge } from "../../GreenTypes/GreenTypes";

type Props = {
  challenges: Challenge[];
};
function Challenges(props: Props) {
  const { challenges } = props;
  return (
    <>
      <div className={styles.container}>
        {/*  */}
        {challenges.map((challenge) => (
          <div key={challenge.id} className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                <Image src={noAvatar} alt="image1" />
              </div>
              <div className={styles.challengeText}>
                <div className={styles.challengeIcon}>
                  <p>{challenge.topic.name}</p>
                </div>
                <h3 className={styles.challengeTitle}>{challenge.title}</h3>
                <p className={styles.challengeDescription}>
                  {challenge.description}
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button
                onClick={() => {
                  ToastNot("Challenge Accepted");
                }}
                className={styles.challengeButton}
              >
                <Image src={doIt} alt="doIt" /> Accept
              </button>
              <button
                onClick={() => {
                  ToastNot("Challenge Accepted");
                }}
                className={styles.challengeButton}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
        {/*  */}
      </div>
    </>
  );
}

export default Challenges;
