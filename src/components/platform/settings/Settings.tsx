import React from "react";
import styles from "./Settings.module.css";
function Settings() {
  // declarations
  // react forms
  // redux
  // APIs edit profile
  // APIs edit or add payment
  return (
    <>
      <div className={styles.container}>
        <div className={styles.userCard}></div>
        <div className={styles.trackCard}></div>
        {/* hold */}
        <div className={styles.personalInfo}>
          <div className={styles.header}>
            <h2>Personal Information</h2>
          </div>
          <div className={styles.card}></div>
        </div>
        <div className={styles.paymentInfo}>
          <div className={styles.header}>
            <h2>payment Information</h2>
          </div>
          <div className={styles.card}></div>
        </div>
        {/* hold */}
      </div>
    </>
  );
}

export default Settings;
