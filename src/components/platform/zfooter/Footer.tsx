"use client";
import React, { useState } from "react";
import styles from "./footer.module.css";
import footLogo from "@/../public/logo/foot.png";
import green from "@/../public/ZPLATFORM/header/green.svg";
import Image from "next/image";

import Link from "next/link";
import { FaXTwitter, FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { useRouter } from "next/navigation";

function Footer() {
  const t = useTranslations("web.main.footer");
  const route = useRouter();
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    route.push("payment");
    // ToastNot("comming soon");
  };

  const handleInvite = async () => {
    try {
      // Get the current URL
      const currentUrl = window.location.href;

      // Copy to clipboard
      await navigator.clipboard.writeText(currentUrl);

      // Show notification
      setCopied(true);
      // If you want to use ToastNot instead, uncomment the line below:
      ToastNot("Link copied to clipboard!");

      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // You can show an error message here if needed
      // ToastNot("Failed to copy link");
    }
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
                  {t("business")}
                </button>
                <button onClick={handleDownload} className={styles.button}>
                  {t("donate")}
                </button>
              </div>
              <button
                onClick={handleInvite}
                className={styles.button}
                style={{ position: 'relative' }}
              >
                {copied ? "Link Copied!" : t("invite")}
              </button>
            </div>
          </div>

          <Image src={green} alt="circles" className={styles.greenApp} />
        </div>
        <div className={styles.lower}>
          <div className={styles.content}>
            <ul>
              <li>
                <Link href={`/${locale}/feeds`}>{t("home")}</Link>
              </li>
              <li>
                <Link href={`/${locale}/about`}>{t("community")}</Link>
              </li>
              <li>
                <Link href={`/${locale}/goal`}>{t("profile")}</Link>
              </li>
              <li>
                <Link href="#">{t("privacyAndPolicy")}</Link>
              </li>
            </ul>
          </div>
          <div className={styles.containerBottomSocial}>
            <div
              onClick={()=>{
                window.open("https://x.com/theGreenteamapp", "_blank");
              }}
              className={styles.social}>
              <FaXTwitter />
            </div>
            <div 
              onClick={()=>{
                window.open("https://www.facebook.com/profile.php?id=100086985110285", "_blank");
              }}
            className={styles.social}>
              <FaFacebookF />
            </div>
            <div
              onClick={()=>{
                window.open("https://www.instagram.com/greenteam.app/", "_blank");
              }}
            className={styles.social}>
              <FaInstagram />
            </div>
            <div
              onClick={()=>{
                window.open("https://www.linkedin.com/in/david-igual-greenteam-384948191/", "_blank");
              }}
            className={styles.social}>
              <FaLinkedin />
            </div>
            <div
              onClick={()=>{
                window.open("https://www.linkedin.com/in/david-igual-greenteam-384948191/", "_blank");
              }}
            className={styles.social}>
              <FiYoutube />
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