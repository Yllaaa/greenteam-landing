"use client";
import React from "react";
import styles from "./footer.module.css";
import footLogo from "@/../public/logo/foot.png";
import Image from "next/image";

function Footer() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.upper}>
          <Image src={footLogo} alt="footLogo" />
        </div>
        <div className={styles.lower}></div>
      </div>
    </>
  );
}

export default Footer;
