"use client";
import React from "react";
import styles from "./brain.module.css";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import brain from "@/../public/brain/brain.png";
import Image from "next/image";
import LoadingTree from "@/components/zaLoader/LoadingTree";

function Brain() {
  const t = useTranslations('landing.brain');
  const locale = useLocale();

  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            {t('community')}{" "}
            <span>{t('sustainableCulture')}</span>
          </h2>
        </div>
        <div className={styles.text}>
          <p>
            {t('evolution')}
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
            src={brain}
            alt="brain"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
    </>
  );
}

export default Brain;
