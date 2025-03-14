"use client";
import React from "react";
import styles from "./SubHeader.module.css";





import SubHeaderWeb from "./Body/Web/SubHeaderWeb";
import SubHeaderRes from "./Body/Responsive/SubHeaderRes";

function SubHeader() {
  

  return (
    <>
      {/* web */}
      <div className={styles.container}>
        <SubHeaderWeb />
      </div>
      {/* responsive */}
      <div className={styles.ResponsiveContainer}>
        <SubHeaderRes />
      </div>
    </>
  );
}

export default SubHeader;
