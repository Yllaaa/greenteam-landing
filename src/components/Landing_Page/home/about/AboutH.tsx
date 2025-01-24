"use client";
import React from "react";
import styles from "./aboutH.module.css";
import Link from "next/link";
import { useLocale } from "next-intl";

function AboutH() {
  const locale = useLocale();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentBody}>
          <div className={styles.title}></div>
          <div className={styles.content}></div>
        </div>
        <div className={styles.allCardsContainer}>
          <div className={styles.cardsUpper}>
            <div
              className={`${styles.card} ${styles.card1} ${styles.cardGreen}`}
            >
              Sustainability
            </div>
            <div
              className={`${styles.card} ${styles.card2} ${styles.cardDark}`}
            >
              Comunity
            </div>
            <div
              className={`${styles.card} ${styles.card3} ${styles.cardGreen}`}
            >
              Eco-friendly
            </div>
            <div
              className={`${styles.card} ${styles.card4} ${styles.cardDark}`}
            >
              EcoCommunity
            </div>
          </div>
          <div className={styles.cardsLower}>
            <div
              className={`${styles.card} ${styles.card5} ${styles.cardGreen}`}
            >
              Collaboration
            </div>
            <div
              className={`${styles.card} ${styles.card6} ${styles.cardBlue}`}
            >
              Social Impact
            </div>
            <div
              className={`${styles.card} ${styles.card7} ${styles.cardDark}`}
            >
              Design
            </div>
            <div
              className={`${styles.card} ${styles.card8} ${styles.cardDark}`}
            >
              Green Intiative
            </div>
          </div>
        </div>
        <div className={styles.btn}>
          <Link href={`${locale}/login`}>LOGIN</Link>
        </div>
      </div>
    </>
  );
}

export default AboutH;
