"use client";
import React from "react";
import FeedSection from "./body/feeds/FeedSection";
import styles from "./groupUser.module.scss";
import { useAppSelector } from "@/store/hooks";
import GroupSides from "./sides/GroupSides";
import EventSection from "./body/Events/EventSection";
import Settings from "./body/settings/Settings";
// import GroupPosts from "@/components/AA-NEW/POST/groups/GroupPosts";
// import { useParams } from 'next/navigation';
function GroupUser() {
  const groupData = useAppSelector((state) => state.groupState);
  const editState = useAppSelector((state) => state.groupEdit.edit);
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
              {/* <GroupPosts groupId={params.groupId as string} /> */}
            </div>
            <div className={styles.sidebar}>
              <GroupSides />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.settings}>
            <Settings />
          </div>
        </>
      )}
    </>
  );
}

export default GroupUser;
