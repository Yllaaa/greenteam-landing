"use client";
import React from "react";
import { PageItem } from "./pages.data";
import styles from "./pages.module.scss";
import logo from "@/../public/personal/menu/pages/logo.svg";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";

export default function LongItem({
  pageI,
  page,
  setPage,
  length,
  index,
}: {
  pageI: PageItem;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  length: number;
  index: number;
}) {
  const router = useRouter();
  const locale = useLocale();
  // Track if pagination has already been triggered
  const hasPaginatedRef = useRef(false);

  const handleNavigate = () => {
    router.push(`/${locale}/pages/${pageI.slug}`);
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true, // Only trigger once when coming into view
  });

  const handlePages = useCallback(() => {
    // Only paginate if we haven't already and we're not on the first page load
    if (!hasPaginatedRef.current && length >= 5) {
      hasPaginatedRef.current = true;
      setPage(page + 1);
    }
  }, [length, page, setPage]);

  useEffect(() => {
    // Only trigger pagination if this is the last item and it's in view
    if (inView && index === length - 1) {
      handlePages();
    }
  }, [handlePages, inView, index, length]);

  const isLastItem = index === length - 1;

  return (
    <div ref={isLastItem ? ref : undefined} key={index} className={styles.card}>
      <Image
        src={logo}
        alt="image"
        className={styles.logoImage}
        width={200}
        height={200}
      />
      <div className={styles.content}>
        <div className={styles.counts}>
          <div className={styles.followers}>
            {pageI.followersCount} Followers
          </div>
        </div>
        <h2 className={styles.name}>
          {pageI.name ? pageI?.name : "Community Beach Cleanup"}
        </h2>
        <p className={styles.what}>
          <span>What: </span>
          {pageI?.what ? pageI?.what : "No Description!"}
        </p>
        <p className={styles.why}>
          <span>Why: </span>
          {pageI?.why ? pageI?.why : "No Description!"}
        </p>
        <p className={styles.how}>
          <span>How: </span>
          {pageI?.how ? pageI?.how : "No Description!"}
        </p>
      </div>

      <div className={styles.img}>
        <div className={styles.overlay}></div>
        <Image
          src={pageI?.cover ? pageI?.cover : logo}
          alt="image"
          className={styles.image}
          width={200}
          height={200}
        />
      </div>
      <div className={styles.actions}>
        <button onClick={handleNavigate} className={styles.joinButton}>
          POST
        </button>
      </div>
    </div>
  );
}
