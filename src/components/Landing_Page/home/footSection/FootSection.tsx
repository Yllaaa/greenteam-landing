"use client";
import React from "react";
import styles from "./footSection.module.css";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import foot from "@/../public/brain/foot.svg";
import Image from "next/image";
import LoadingTree from "@/components/zaLoader/LoadingTree";

function Foot() {
  const t = useTranslations('landing.foot');
  const locale = useLocale();

  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            {t('bePart')}
            <br />
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
            src={foot}
            alt="Foot"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
    </>
  );
}

export default Foot;
