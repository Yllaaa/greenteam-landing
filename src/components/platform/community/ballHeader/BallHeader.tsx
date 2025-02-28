/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import styles from "./ballHeader.module.css";
// import Image from 'next/image';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentCommunity } from "@/store/features/communitySection/currentCommunity";
import rockBall from "@/../public/ZPLATFORM/community/hagar.png";
import Image from "next/image";
import { useTranslations } from "next-intl";

function BallHeader() {
  const t = useTranslations('web.main.community')
  const { currentCommunity } = useAppSelector(
    (state) => state.currentCommunity
  );
  console.log(currentCommunity);
  const dispatch = useAppDispatch();
  const handleCommunityChange = (community: string | any) => {
    dispatch(setCurrentCommunity(community));
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.ball}>
          <div className={styles.ballImage}>
            <Image width={500} height={500} src={rockBall} alt="rockBall" />
          </div>
          <div className={styles.pageContainer}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleCommunityChange("pages")}
              className={styles.pageDot}
            ></div>
            <div
              style={currentCommunity === "pages" ? { opacity: 1 } : {}}
              className={styles.pageDotLine}
            ></div>
            <div
              style={currentCommunity === "pages" ? { opacity: 1 } : {}}
              className={styles.pageText}
            >
              <p>{t('pages')}</p>
            </div>
          </div>
          {/*  */}
          <div className={styles.groupContainer}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleCommunityChange("groups")}
              className={styles.groupDot}
            ></div>
            <div
              style={currentCommunity === "groups" ? { opacity: 1 } : {}}
              className={styles.groupDotLine}
            ></div>
            <div
              style={currentCommunity === "groups" ? { opacity: 1 } : {}}
              className={styles.groupText}
            >
              <p>{t('groups')}</p>
            </div>
          </div>
          {/*  */}
          {/*  */}
          <div className={styles.eventsContainer}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleCommunityChange("events")}
              className={styles.eventsDot}
            ></div>
            <div
              style={currentCommunity === "events" ? { opacity: 1 } : {}}
              className={styles.eventsDotLine}
            ></div>
            <div
              style={currentCommunity === "events" ? { opacity: 1 } : {}}
              className={styles.eventsText}
            >
              <p>{t('events')}</p>
            </div>
          </div>
          {/*  */}
          {/*  */}
          <div className={styles.productsContainer}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleCommunityChange("products")}
              className={styles.productsDot}
            ></div>
            <div
              style={currentCommunity === "products" ? { opacity: 1 } : {}}
              className={styles.productsDotLine}
            ></div>
            <div
              style={currentCommunity === "products" ? { opacity: 1 } : {}}
              className={styles.productsText}
            >
              <p>{t('products')}</p>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </>
  );
}

export default BallHeader;
