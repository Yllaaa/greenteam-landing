"use client";
import React from "react";
import styles from "./whatWeOffer.module.css";
import lock from "@/../public/whatWeOffer/lock.svg";
import tree from "@/../public/whatWeOffer/tree.svg";
import message from "@/../public/whatWeOffer/message.svg";
import Image from "next/image";
import Loading from "@/app/loading";
import { useTranslations } from "next-intl";
function WhatWeOffer() {
  const t = useTranslations('landing.whatWeOffer');
  const cardContent = [
    {
      icon: lock,
      header: t('cards.card1.header'),
      text: t('cards.card1.text'),
    },
    {
      icon: tree,
      header: t('cards.card2.header'),
      text: t('cards.card2.text'),
    },
    {
      icon: message,
      header: t('cards.card3.header'),
      text: t('cards.card3.text'),
    },
  ];
  const [loaded, setLoaded] = React.useState(false);
  return (
    <>
      <div className={styles.container}>
        {loaded ? (
          <div className={styles.header}>
            <h5>{t('whatWeOffer')}</h5>
            <h3>
              {t('howWeMake')}<span>{t('difference')}</span>
            </h3>
          </div>
        ) : (
          <Loading />
        )}
        <div className={styles.cards}>
          {cardContent.map((card, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>
                <Image
                  src={card.icon}
                  alt="icon"
                  loading="lazy"
                  onLoadingComplete={() => setLoaded(true)}
                />
              </div>
              <h3 className={styles.cardHeader}>{card.header.split(" ")[0]} <br/> {card.header.split(" ").slice(1).join(" ")}  </h3>
              <p className={styles.cardText}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WhatWeOffer;
