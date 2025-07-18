"use client"
import React from 'react'
import styles from "./aboutHero.module.css"
import { useTranslations } from 'next-intl';

function AboutHero() {
  const t = useTranslations('landing.goal');
  return (
    <>
    <div className={styles.container}>
        <p>{t("mini")}</p>
        <h2>{t("big")} <span>Green Team</span></h2>
    </div>
    </>
  )
}

export default AboutHero