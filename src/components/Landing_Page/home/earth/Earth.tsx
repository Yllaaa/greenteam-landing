"use client";
import React from "react";
import styles from "./earth.module.css";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import earth from "@/../public/brain/earth.png";
import Image from "next/image";
import LoadingTree from "@/components/zaLoader/LoadingTree";

function EarthSection() {
  const t = useTranslations('landing.earth');
  const locale = useLocale();

  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            {t('bePart')}{" "}
            <span>{t('theSustainable')}</span>
          </h2>
        </div>
        <div className={styles.text}>
          <p>
           {t('greenTeam')}
          </p>
        </div>
        <div className={styles.link}>
          <Link href={`/${locale}/about`}>
          <span>{t('learnMore')}</span>
          </Link>
        </div>
        {!imageLoaded && (
          <div className={styles.image}>
            <LoadingTree />
          </div>
        )}
        <div className={styles.image}>
          <Image
            src={earth}
            alt="Foot"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
    </>
  );
}

export default EarthSection;
