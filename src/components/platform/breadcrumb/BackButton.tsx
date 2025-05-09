"use client";
import React from "react";
import styles from "./Breadcrumb.module.css";
import { useRouter, usePathname } from "next/navigation";
import { FaBackspace } from "react-icons/fa";

interface BackButtonProps {
  shouldHideOnFeeds?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ shouldHideOnFeeds = false }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Check if we should hide the button based on the path
  const shouldHide = shouldHideOnFeeds && pathname.includes("/feeds");

  if (shouldHide) {
    return null;
  }

  return (
    <div className={styles.breadcrumb}>
      <div className={styles.container}>
        <button onClick={() => router.back()} className={styles.back}>
          <FaBackspace />
          <p>Back</p>
        </button>
      </div>
    </div>
  );
};

export default BackButton;