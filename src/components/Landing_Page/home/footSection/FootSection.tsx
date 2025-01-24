"use client";
import React from "react";
import styles from "./footSection.module.css";
import Link from "next/link";
import { useLocale } from "next-intl";
import { FiArrowRight } from "react-icons/fi";
import foot from "@/../public/brain/foot.svg";
import Image from "next/image";

function Foot() {
  const locale = useLocale();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            Discover and share experiences to create a better future,
            <span>COMMUNICATION IS CULTURE.</span>
          </h2>
        </div>
        <div className={styles.text}>
          <p>
            Green team, the conscious social network, is the communication tool
            designed to facilitate interaction between conscious people,
            responsible for their social and environmental impact.
          </p>
        </div>
        <div className={styles.link}>
          <Link href={`/${locale}/about`}>
            <span>Read more</span> <FiArrowRight />
          </Link>
        </div>
        <div className={styles.image}>
          <Image src={foot} alt="Foot" loading="lazy" />
        </div>
      </div>
    </>
  );
}

export default Foot;
