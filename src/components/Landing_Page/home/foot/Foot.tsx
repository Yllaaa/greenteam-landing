"use client";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import foot from "@/../public/icons/foot.svg";
import styles from "./foot.module.css";

function FootMarquee() {
  return (
    <>
      <div className={styles.marqueeContainer}>
        <Marquee speed={50} autoFill={true} gradient={false}>
          <Image src={foot} alt="arrow" className={styles.marqueeFoot} />
        </Marquee>
      </div>
    </>
  );
}

export default FootMarquee;
