import React from "react";
import styles from "./Settings.module.css";
import { useTranslations } from "next-intl";
function Settings() {
  const t = useTranslations('web.main.settings')
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
            <h2>{t('personalInfo')}</h2>
          </div>
          <div className={styles.card}></div>
        </div>
        <div className={styles.paymentInfo}>
          <div className={styles.header}>
            <h2>{t('paymentInfo')}</h2>
          </div>
          <div className={styles.card}></div>
        </div>
        {/* hold */}
      </div>
    </>
  );
}

export default Settings;
