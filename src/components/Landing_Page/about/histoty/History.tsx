"use client";
import React, { useState } from "react";
import styles from "./history.module.css";
import Image from "next/image";
import big from "@/../public/about/history.jpeg";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface SectionProps {
  title: string;
  points: string[];
}

const Section: React.FC<SectionProps> = ({ title, points }) => (
  <div className={styles.section}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    <ul className={styles.pointsList}>
      {points.map((point, index) => (
        <li key={index} className={styles.point}>
          {point}
        </li>
      ))}
    </ul>
  </div>
);

const History: React.FC = () => {
  const router = useRouter()
  const locale = useLocale();
  const t = useTranslations('landing.history');
  const [loaded, setLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Show first 3 sections when collapsed
  const teaserSections = ['beginning', 'journey', 'education'];
  const allSections = [
    'beginning', 'journey', 'education', 'movements',
    'policies', 'solution', 'project', 'realization',
    'greenteam', 'team', 'support'
  ];

  const sectionsToShow = isExpanded ? allSections : teaserSections;
  const handleRegister = () => {
    router.push(`/${locale}/register`);
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <h2 className={styles.subtitle}>{t('subtitle')}</h2>

      <div className={styles.content}>
        <div className={styles.textWrapper}>
          <div className={styles.sectionsContainer}>
            {sectionsToShow.map((sectionKey) => (
              <Section
                key={sectionKey}
                title={t(`sections.${sectionKey}.title`)}
                points={t.raw(`sections.${sectionKey}.points`) as string[]}
              />
            ))}

            {!isExpanded && (
              <div className={styles.fadeOverlay} />
            )}
          </div>

          {isExpanded && (
            <div className={styles.closingSection}>
              <h3 className={styles.sectionTitle}>{t('sections.closing.title')}</h3>
              <p className={styles.closingMessage}>{t('sections.closing.message')}</p>
              <p className={styles.slogan}>{t('sections.closing.slogan')}</p>
              <button onClick={handleRegister} className={styles.ctaButton}>
                {t('sections.closing.cta')}
              </button>
            </div>
          )}

          <button
            className={styles.readMoreBtn}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? t('readLess') : t('readMore')}
          </button>
        </div>

        <div className={styles.imageContainer}>
          <Image
            src={big}
            alt="GREENTEAM History"
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
          {!loaded && <LoadingTree />}
        </div>
      </div >
    </div >
  );
};

export default History;