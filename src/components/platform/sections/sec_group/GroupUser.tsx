"use client";
import React, { useEffect, useRef, useState } from "react";
import FeedSection from "./body/feeds/FeedSection";
import styles from "./groupUser.module.scss";
import { useAppSelector } from "@/store/hooks";
import GroupSides from "./sides/GroupSides";
import EventSection from "./body/Events/EventSection";
import Settings from "./body/settings/Settings";

function GroupUser() {
  const groupData = useAppSelector((state) => state.groupState);
  const editState = useAppSelector((state) => state.groupEdit.edit);
  const settingsRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (editState && settingsRef.current) {
      settingsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [editState]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Make sidebar sticky after scrolling 500px
      if (scrollPosition >= 1300) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Call once to check initial position
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {!editState ? (
        <>
          {groupData && groupData.isAdmin && (
            <div style={{ marginTop: "32.5px" }}>
              <EventSection />
            </div>
          )}
          <div className={styles.container}>
            <div className={styles.body}>
              <FeedSection />
            </div>
            <div
              ref={sidebarRef}
              className={`${styles.sidebar} ${isSticky ? styles.sticky : ''}`}
            >
              <GroupSides />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.settings} ref={settingsRef}>
            <Settings />
          </div>
        </>
      )}
    </>
  );
}

export default GroupUser;