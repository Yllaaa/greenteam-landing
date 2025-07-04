"use client";
import React from "react";
import styles from "../allProfileBody.module.scss";
import Image from "next/image";
import tree from "@/../public/icons/tree.svg";
function Breif(props: { score: number }) {
  const { score } = props;
  return (
    <>
      <div className={styles.breifContainer}>
        <div className={styles.breifHeader}>
          <p>Your Points</p>
          <h5>Track Your Impact!</h5>
        </div>

        <Image
          src={tree}
          alt="breif"
          width={100}
          height={100}
          className={styles.breifIcon}
        />
        <div className={styles.breifText}>
          <p>{score} <span>Points</span></p>
        </div>
      </div>
    </>
  );
}

export default Breif;
