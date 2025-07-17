import React from 'react'
import styles from "./aboutHero.module.css"
import { useTranslations } from 'next-intl'

function AboutHero() {
  const t = useTranslations('landing.about');
  return (
    <>
    <div className={styles.container}>
        <p>{t("title")}</p>
        <h2>{t("title2")}{" "}<span>{t("title3")}</span></h2>
    </div>
    </>
  )
}

export default AboutHero