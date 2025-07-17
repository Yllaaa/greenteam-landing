"use client";
import React from "react";
import styles from "./aboutUs.module.css";
import aoura from "@/../public/about/aoura.jpeg";
import Image from "next/image";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { useTranslations } from "next-intl";
function AboutUs() {
  const t = useTranslations("landing.about.aboutus");
  const [loaded, setLoaded] = React.useState(false);
  return (
    <>
      <div className={styles.container}>
      {!loaded && (
        <div className={styles.aboutUsImg}>
          <LoadingTree />
        </div>
      )}
        <div className={styles.aboutUsImg}>
          <Image src={aoura} alt="aoura" loading="lazy" onLoad={() => setLoaded(true)} />
        </div>
        <div className={styles.aboutUsText}>
          <h3>{t("title")}</h3>
          <div className={styles.p1}>
            <p>
              {t("p1")}
            </p>
            <p>{t("p2")}</p>
            <p>
              {t("p3")}
            </p>
          </div>
          <div className={styles.p2}>
            <p>{t("p4")}</p>
            <p>
              {t("p5")}
            </p>
            <p>{t("p6")}</p>
          </div>
          <div className={styles.signature}>
            <h4>Greenteam</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
