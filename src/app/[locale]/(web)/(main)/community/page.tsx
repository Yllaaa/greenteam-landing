import React from "react";
import styles from "./community.module.css";
import CommunityPage from "@/components/platform/community/Zcommunity/CommunityPage";

function page() {
  return (
    <>
      <div className={styles.container}>
        <CommunityPage />
      </div>
    </>
  );
}

export default page;
