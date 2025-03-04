"use client";
import React, { lazy, Suspense, useState } from "react";
import styles from "./SubHeader.module.css";

const Categories = lazy(() => import("../../categoriesDimond/Categories"));
const Suggested = lazy(() => import("../../suggested/GreenChallenges"));
const MyChallenges = lazy(() =>
  import("../../suggested/challenges/myChallenges/MyChallenges")
);
import Link from "next/link";
import Image from "next/image";

import likes from "@/../public/ZPLATFORM/header/like.svg";
import message from "@/../public/ZPLATFORM/header/message.svg";
import addNew from "@/../public/ZPLATFORM/header/addNew.svg";
import { useLocale } from "next-intl";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import toRight from "@/../public/ZPLATFORM/A-iconsAndBtns/ToRights.svg";
function SubHeader() {
  const locale = useLocale();

  // Go to Next Slide
  const [isOpen, setIsOpen] = useState(false);
  const nextSlide = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* web */}
      <div className={styles.container}>
        <div className={styles.navBtns}>
          <div className={styles.next} onClick={nextSlide}>
            <Image
              src={toRight}
              alt="prev"
              width={100}
              height={100}
              loading="lazy"
            />
          </div>
        </div>
        <div className={styles.cardsContainer}>
          <div className={styles.diamond}>
            <Suspense
              fallback={
                <div className={styles.loading}>
                  <LoadingTree />
                </div>
              }
            >
              <Categories />
            </Suspense>
          </div>
          <div className={styles.suggested}>
            <Suspense
              fallback={
                <div className={styles.loading}>
                  <LoadingTree />
                </div>
              }
            >
              <Suggested />
            </Suspense>
          </div>

          <div
            className={`${styles.subcontainer} ${
              isOpen ? styles.openWindow : styles.closeWindow
            }`}
          >
            <div className={styles.challenges}>
              <Suspense
                fallback={
                  <div className={styles.loading}>
                    <LoadingTree />
                  </div>
                }
              >
                <MyChallenges />
              </Suspense>
            </div>
          </div>
        </div>
        <div className={styles.links}>
          <div className={styles.link}>
            <Link href="/" className={styles.regularLink}>
              <Image src={likes} alt="like" />

              <span>125 likes</span>
            </Link>
          </div>
          <div className={styles.link}>
            <Link href="/" className={styles.regularLink}>
              <Image src={message} alt="like" />
              <span>125 message</span>
            </Link>
          </div>
          <div className={styles.link}>
            <Link
              href={`/${locale}/personal/newPost`}
              className={styles.postLink}
            >
              <Image src={addNew} alt="add" />
              <span>Add post</span>
            </Link>
          </div>
        </div>
      </div>
      {/* responsive */}
      <div className={styles.ResponsiveContainer}>
        <div className={styles.diamond}>
          <Suspense
            fallback={
              <div className={styles.loading}>
                <LoadingTree />
              </div>
            }
          >
            <Categories />
          </Suspense>
        </div>
        <div className={styles.links}>
          <div className={styles.link}>
            <Link href="/" className={styles.regularLink}>
              <Image src={likes} alt="like" />

              <span>125 likes</span>
            </Link>
          </div>
          <div className={styles.link}>
            <Link href="/" className={styles.regularLink}>
              <Image src={message} alt="like" />
              <span>125 message</span>
            </Link>
          </div>
          <div className={styles.link}>
            <Link
              href={`/${locale}/personal/newPost`}
              className={styles.postLink}
            >
              <Image src={addNew} alt="add" />
              <span>Add post</span>
            </Link>
          </div>
        </div>

        <div className={styles.subContent}>
          <div className={styles.suggested}>
            <Suspense
              fallback={
                <div className={styles.loading}>
                  <LoadingTree />
                </div>
              }
            >
              <Suggested />
            </Suspense>
          </div>
          <div className={styles.challenges}>
            <Suspense
              fallback={
                <div className={styles.loading}>
                  <LoadingTree />
                </div>
              }
            >
              <MyChallenges />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubHeader;
