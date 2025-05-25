// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import styles from "./Chalenges.module.css";
// import doIt from "@/../public/ZPLATFORM/challenges/doIt.svg";

import Image from "next/image";

import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { Props } from "./types/ChallengeTypes.data";
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
// import ToastNot from "@/Utils/ToastNotification/ToastNot";
// import axios from "axios";
// import { getToken } from "@/Utils/userToken/LocalToken";

function Challenges(props: Props) {
  const {
    challenges,
    setAddNew,
    setChallengeId,
    // setDoItModal,
    // setSection,
    // acceptDo
    acceptDoit,
  } = props;

  const router = useRouter();
  const locale = useLocale();
  // const token = getToken();
  // const accessToken = token ? token.accessToken : null

  const handleNavigation = () => {
    router.push(`/${locale}/challenges`)

  }
  // const acceptDo = (challengeId: string) => {
  //   try {
  //     axios
  //       .post(
  //         `${process.env.NEXT_PUBLIC_BACKENDAPI
  //         }/api/v1/challenges/green-challenges/${challengeId}/add-to-do
  //         }`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             "Access-Control-Allow-Origin": "*",
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         if (res) {
  //           ToastNot("challenge marked as done");
  //           // setDoItModal(false);
  //         }
  //       }).then(
  //         () => {
  //           window.location.reload();
  //         }
  //       )
  //       .catch((err) => {
  //         console.log(err);
  //         ToastNot("error occurred while marking challenge as done");
  //       });
  //   } catch {
  //     ToastNot("error occurred while marking challenge as done");
  //   }
  // };
  return (
    <>
      <div className={styles.container}>
        {/*  */}
        {challenges.map((challenge) => (
          <div key={challenge.id} className={styles.challenge}>
            <div style={{cursor: 'pointer'}} onClick={handleNavigation} className={styles.challengeDetails}>
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
                  // setDoItModal(true);
                  // setSection("green-challenges");
                  // setChallengeId(challenge.id);
                  acceptDoit(challenge.id);
                }}
                className={styles.challengeButton}
              >
                Do it
              </button>
              <button
                onClick={() => {
                  setChallengeId(challenge.id);
                  setAddNew(true);
                }}
                className={styles.challengeButton}
              >
                Done
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
