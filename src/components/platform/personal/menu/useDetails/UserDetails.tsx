"use client";
import React from "react";
import styles from "./userDetails.module.scss";
import Recods from "./Recods";
import Breif from "./Breif";
function UserDetails() {
  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.records}>
          <Recods />
        </div>
        <div className={styles.breif}>
          <Breif />
        </div>
      </div>
    </>
  );
}

export default UserDetails;
