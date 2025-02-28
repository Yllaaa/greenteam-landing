"use client";
import React from "react";
import styles from "./footer.module.css";
import appStore from "@/../public/footer/appStore.svg";
import googlePlay from "@/../public/footer/playStore.svg";
import mockup from "@/../public/footer/mockup.png";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import logo from "@/../public/logo/fullLogo.png";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
function Footer() {
  const t = useTranslations('landing.footer');
  const locale = useLocale();

  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerTop}>
          <div className={styles.containerTopActionsText}>
            <h2>
              {t('theConscient')} <span>{t('greenTeam')}</span>
            </h2>
            <p>{t('takeCare')}</p>
          </div>
          <div className={styles.containerTopActionsBtns}>
            <div className={styles.store}>
              <Image src={appStore} alt="App Store" loading="lazy" />
            </div>
            <div className={styles.store}>
              <Image src={googlePlay} alt="App Store" loading="lazy" />
            </div>
            <div className={styles.link}>
              <Link href={`/${locale}/register`}>{t('registerNow')}</Link>
            </div>
          </div>
          {!imageLoaded && (
            <div className={styles.containerTopActionsLoading}>
              <LoadingTree />
            </div>
          )}
          <div className={styles.containerTopActionsMockup}>
            <Image
              src={mockup}
              alt="Mockup"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
        <div className={styles.containerBottom}>
          <div className={styles.containerBottomLogo}>
            <Image src={logo} alt="Logo" loading="lazy" />
          </div>
          <div className={styles.containerBottomNavigation}>
            <Link className={styles.link} href={`/${locale}/about`}>
              <span>{t('aboutUs')}</span>
            </Link>
            <Link className={styles.link} href={`/${locale}/goal`}>
              {t('goal')}
            </Link>
            <button className={styles.link}>{t('downloadNow')}</button>
            <Link className={styles.link} href={`/${locale}/register`}>
              {t('register')}
            </Link>
          </div>
          <div className={styles.containerBottomSocial}>
            <div className={styles.social}>
              <FaXTwitter />
            </div>
            <div className={styles.social}>
              <FaFacebookF />
            </div>
            <div className={styles.social}>
              <FaInstagram />
            </div>
          </div>
          <div className={styles.containerBottomCopyright}>
            <p>{t('copyright')}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
