"use client";
import React from "react";
import styles from "./footer.module.css";
import footLogo from "@/../public/logo/foot.png";
import handLogo from "@/../public/ZPLATFORM/header/handsLogo.svg";
import Image from "next/image";
import cirle from "@/../public/ZPLATFORM/footer/circle.svg";
import Link from "next/link";
import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { useTranslations } from "next-intl";

function Footer() {
  const t = useTranslations('web.main.footer')
  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerDiscover}>
          <div className={styles.textOne}>
            <p>{t('discover')}</p>
          </div>
          <div className={styles.logo}>
            <Image src={handLogo} alt="community" className={styles.logo} />
          </div>
          <div className={styles.textTwo}>
            <p>{t('allNeed')}</p>
          </div>
        </div>
        <div className={styles.upper}>
          <div className={styles.content}>
            <h2 className={styles.text}>{t('eachGrain')}</h2>
            <h2 className={styles.text}>
              {t('brighterFuture')}{" "}
              <span>
                <Image
                  src={footLogo}
                  alt="footLogo"
                  className={styles.logoImage}
                />
              </span>
            </h2>
            <div className={styles.actions}>
              <div className={styles.topActions}>
                <button className={styles.button}>{t('joinUs')}</button>
                <button className={styles.button}>{t('donate')}</button>
              </div>
              <button className={styles.button}>{t('donate')}</button>
            </div>
          </div>
          {/* <div className={styles.circle}> */}
          <Image src={cirle} alt="circles" className={styles.circleImage} />
          {/* </div> */}
        </div>
        <div className={styles.lower}>
          <div className={styles.content}>
            <ul>
              <li>
                <Link href="#">{t('home')}</Link>
              </li>
              <li>
                <Link href="#">{t('community')}</Link>
              </li>
              <li>
                <Link href="#">{t('profile')}</Link>
              </li>
              <li>
                <Link href="#">{t('privacyAndPolicy')}</Link>
              </li>
            </ul>
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
          <div className={styles.copyright}>
            <p>{t('rightsReserved')}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
