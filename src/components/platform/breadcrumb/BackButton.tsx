"use client";
import React, { useCallback } from "react";
import styles from "./Breadcrumb.module.css";
import { useRouter, usePathname } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

interface BackButtonProps {
  shouldHideOnFeeds?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ shouldHideOnFeeds = false }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Check if we should hide the button based on the path
  const shouldHide = shouldHideOnFeeds && pathname && pathname.includes("/feeds");

  // Enhanced back handler that combines navigation with scrolling
  const handleBack = useCallback(() => {
    router.back();

    // Use a small timeout to ensure scrolling happens after navigation starts
    // This is because router.back() is asynchronous
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Use 'auto' for instant scrolling if preferred
      });
    }, 100);

    // Alternative approach - manually navigate back through history API
    // window.history.back();
    // window.scrollTo(0, 0);
  }, [router]);

  if (shouldHide) {
    return null;
  }

  return (
    <div className={styles.breadcrumb}>
      <div className={styles.container}>
        <button onClick={handleBack} className={styles.back}>
          <IoArrowBack />
          <p>Back</p>
        </button>
      </div>
    </div>
  );
};

export default BackButton;