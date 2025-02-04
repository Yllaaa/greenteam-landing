"use client";
import React from "react";
import styles from "./footer.module.css";
import footLogo from "@/../public/logo/foot.png";
import Image from "next/image";
import cirle from "@/../public/ZPLATFORM/footer/circle.svg";
import Link from "next/link";
import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";

function Footer() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.upper}>
          <div className={styles.content}>
            <Image src={footLogo} alt="footLogo" className={styles.logo} />
            <h2 className={styles.text}>Help us to make sustainable culture</h2>
            <div className={styles.actions}>
              <button className={styles.button}>Join us</button>
              <button className={styles.button}>Donate</button>
            </div>
          </div>
          <div className={styles.circle}>
            <Image src={cirle} alt="circles" className={styles.circleImage} />
          </div>
        </div>
        <div className={styles.lower}>
          <div className={styles.content}>
            <ul>
              <li>
                <Link href="#">Home</Link>
              </li>
              <li>
                <Link href="#">Community</Link>
              </li>
              <li>
                <Link href="#">Profile</Link>
              </li>
              <li>
                <Link href="#">Privacy and policy</Link>
              </li>
            </ul>
            <div className={styles.copyright}>
              <p>© 2025 All Rights Reserved</p>
            </div>
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
        </div>
      </div>
    </>
  );
}

export default Footer;
