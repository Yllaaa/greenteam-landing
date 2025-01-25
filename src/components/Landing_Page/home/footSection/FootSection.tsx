"use client";
import React from "react";
import styles from "./footSection.module.css";
import Link from "next/link";
import { useLocale } from "next-intl";
import foot from "@/../public/brain/foot.svg";
import Image from "next/image";
import LoadingTree from "@/components/zaLoader/LoadingTree";

function Foot() {
  const locale = useLocale();

  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            Be part of the community with GreenTeam,
            <br />
            <span>THE SUSTAINABLE COMMUNICATION TOOL.</span>
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
            <span>Learn more</span>
          </Link>
        </div>
        {!imageLoaded && (
          <div className={styles.image}>
            <LoadingTree />
          </div>
        )}
        <div className={styles.image}>
          <Image
            src={foot}
            alt="Foot"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
    </>
  );
}

export default Foot;
