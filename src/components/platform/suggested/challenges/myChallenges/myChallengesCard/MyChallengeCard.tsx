"use client";
import React from "react";
import styles from "./MyChallengeCard.module.css";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import Image from "next/image";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

function MyChallengeCard() {
  const locale = useLocale();
  const router = useRouter();
  const postContent = "lorem ipsum dolor sit amet";
  return (
    <>
      <div className={styles.challengeHeader}>
        <div className={styles.userAvatar}>
          <Image src={noAvatar} alt="userAvatar" />
        </div>
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
                {postContent.slice(0, 40)}{" "}
                <span onClick={() => {router.push(`/${locale}/posts/${postContent}`)}} className={styles.readMore}>
                  Read More...{" "}
                </span>
              </p>
            ) : (
              <p>{postContent.slice(0, 50)}</p>
            )}
          </div>
        </div>
      </div>
      <div className={styles.challengeImage}>
        <Image src={noAvatar} alt="challengeImage" />
      </div>
      <div className={styles.challengeActions}>
        <button
          onClick={() => {
            ToastNot("Challenge Accepted");
          }}
          className={styles.challengeButton}
        >
          Do it
        </button>
        <button
          onClick={() => {
            ToastNot("Challenge Accepted");
          }}
          className={styles.challengeButton}
        >
          Comment
        </button>
      </div>
    </>
  );
}

export default MyChallengeCard;
