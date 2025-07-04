"use client";
import React from "react";
import styles from "./hero.module.css";
import hashBg from "@/../public/hero sections/hash.png";
import elipse7 from "@/../public/hero sections/elipse7.svg";
import elipse8 from "@/../public/hero sections/elipse8.svg";
import vector from "@/../public/hero sections/vector.svg";
import flower from "@/../public/hero sections/flower.svg";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { AOSInit } from "@/Utils/aos/aos";
import "aos/dist/aos.css";
function Hero() {
  const locale = useLocale();
  React.useEffect(() => {
    AOSInit(1500);
  }, []);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.heroBg}>
          <Image src={hashBg} alt="heroBg" />
        </div>
        <div className={styles.elipse1}>
          <Image src={elipse7} alt="elipse7" />
        </div>
        <div className={styles.elipse2}>
          <Image src={elipse8} alt="elipse8" />
        </div>
        <div className={styles.header}>
          <h2 data-aos="fade-down">TOGETHER,</h2>
          <h2 data-aos="fade-down">WAY TO THE</h2>
          <h2 data-aos="fade-down">SUSTAINABILITY</h2>
          <Image src={flower} alt="flower" data-aos="fade-up" />
        </div>
        <div className={styles.line}>
          <Image src={vector} alt="vector" data-aos="fade-up" />
        </div>
        <div className={styles.subHeader}>
          <p data-aos="fade-up">
            Join Green Team, the conscious social network, and be part of the
            ecological community.
          </p>
        </div>
        <div className={styles.btn}>
          <Link href={`${locale}/explore`}>EXPLORE MORE</Link>
        </div>
      </div>
    </>
  );
}

export default Hero;
