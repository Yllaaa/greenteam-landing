"use client";
import React from "react";
import styles from "./footer.module.css";
import appStore from "@/../public/footer/appStore.svg";
import googlePlay from "@/../public/footer/playStore.svg";
import mockup from "@/../public/footer/mockup.png";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

function Footer() {
  const locale = useLocale();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerTop}>
          <div className={styles.containerTopActionsText}>
            <h2>
              THE CONSCIENT SOCIAL NET. <span>GREENTEAM</span>
            </h2>
            <p>Take care of yourself, take care of the world.</p>
          </div>
          <div className={styles.containerTopActionsBtns}>
            <div className={styles.store}>
              <Image src={appStore} alt="App Store" loading="lazy" />
            </div>
            <div className={styles.store}>
              <Image src={googlePlay} alt="App Store" loading="lazy" />
            </div>
            <div className={styles.link}>
              <Link href={`/${locale}/register`}>Register Now</Link>
            </div>
          </div>
          <div className={styles.containerTopActionsMockup}>
            <Image src={mockup} alt="Mockup" loading="lazy" />
          </div>
        </div>
        <div className={styles.containerBottom}></div>
      </div>
    </>
  );
}

export default Footer;
