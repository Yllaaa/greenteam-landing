"use client";
import React from "react";
import styles from "./userDetails.module.scss";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import noPic from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
function Recods() {
  const userDetails = useAppSelector((state) => state.login.user);
  return (
    <>
      <div className={styles.recordContainer}>
        <div className={styles.recordUser}>
          <div className={styles.userImage}>
            <Image
              src={userDetails?.user.avatar ? userDetails?.user.avatar : noPic}
              width={44}
              height={49}
              alt="userImage"
            />
          </div>
          <div className={styles.userName}>
            <label>{userDetails?.user.username}</label>
          </div>
        </div>
        <div className={styles.recordDetails}>
          <div className={styles.record}>
            <label>0</label>
            <label>Posts</label>
          </div>
          <div className={styles.record}>
            <label>0</label>
            <label>Followers</label>
          </div>
          <div className={styles.record}>
            <label>0</label>
            <label>Following</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Recods;
