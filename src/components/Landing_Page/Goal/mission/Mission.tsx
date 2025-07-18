import React from "react";
import styles from "./mission.module.css";
import { useTranslations } from "next-intl";

function Mission() {
  const t = useTranslations('landing.about.mission');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{t("title")}</h2>
      </div>

      <div className={styles.text}>
        {/* <h3 className={styles.subtitle}>{t("subtitle")}</h3> */}

        <div className={styles.objectivesSection}>
          <h4 className={styles.objectivesTitle}>{t("objectives.title")}</h4>
          <ul className={styles.objectivesList}>
            <li className={styles.objective}>
              {t("objectives.unity")}
            </li>
            <li className={styles.objective}>
              {t("objectives.habits")}
            </li>
            <li className={styles.objective}>
              {t("objectives.relationships")}
            </li>
          </ul>
        </div>

        <p>
          {t("journey")}
        </p>
        <p>
          {t("commitment")}
        </p>
      </div>
    </div>
  );
}

export default Mission;