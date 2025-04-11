"use client";
import React from "react";
import styles from "./footer.module.css";
import footLogo from "@/../public/logo/foot.png";
import green from "@/../public/ZPLATFORM/header/green.svg";
import Image from "next/image";
import cirle from "@/../public/ZPLATFORM/footer/circle.svg";
import Link from "next/link";
import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { useLocale, useTranslations } from "next-intl";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function Footer() {
  const t = useTranslations("web.main.footer");

  const locale = useLocale();

  const handleDownload = () => {
    ToastNot("comming soon");
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerDiscover}>
          <div className={styles.textOneContainer}>
            <p>{t("sustainability")}</p>
            <button onClick={handleDownload}>{t("download")}</button>
          </div>
          <div className={styles.logoContainer}>
            <Image src={footLogo} alt="community" className={styles.logo} />
          </div>
        </div>
        <div className={styles.upper}>
          <div className={styles.content}>
            <h2 className={styles.text}>{t("eachGrain")}</h2>
            <p>{t("walking")}</p>
            <div className={styles.actions}>
              <div className={styles.topActions}>
                <button onClick={handleDownload} className={styles.button}>
                  {t("joinUs")}
                </button>
                <button onClick={handleDownload} className={styles.button}>
                  {t("donate")}
                </button>
              </div>
              <button onClick={handleDownload} className={styles.button}>
                {t("invite")}
              </button>
            </div>
          </div>

          <Image src={green} alt="circles" className={styles.greenApp} />
          <Image src={cirle} alt="circles" className={styles.circleImage} />
        </div>
        <div className={styles.lower}>
          <div className={styles.content}>
            <ul>
              <li>
                <Link href={`/${locale}/feeds`}>{t("home")}</Link>
              </li>
              <li>
                <Link href="#">{t("community")}</Link>
              </li>
              <li>
                <Link href="#">{t("profile")}</Link>
              </li>
              <li>
                <Link href="#">{t("privacyAndPolicy")}</Link>
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
            <p>{t("rightsReserved")}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
