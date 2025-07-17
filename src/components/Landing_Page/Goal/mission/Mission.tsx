import React from "react";
import styles from "./mission.module.css";
import { useTranslations } from "next-intl";

function Mission() {
  const t = useTranslations('landing.about.mission');
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{t("title")}</h2>
        </div>
        <div className={styles.text}>
          <p>
            {t("p1")}
          </p>
          <p>
            {t("p2")}
          </p>
          <p>
            {t("p3")}
          </p>
          <p>
            {t("p4")}
          </p>

          <p>
            {t("p5")}
          </p>
          <p>
            {t("p6")}
          </p>
        </div>
      </div>
    </>
  );
}

export default Mission;
