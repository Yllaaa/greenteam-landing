import React from "react";
import styles from "./settings.module.css";
import Settings from "@/components/platform/settings/Settings";

function page() {
  return (
    <>
      <div className={styles.container}>
        <div>
          <Settings />
        </div>
      </div>
    </>
  );
}

export default page;
