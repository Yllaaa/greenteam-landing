"use client";
import React from "react";
import styles from "./brain.module.css";
import Link from "next/link";
import { useLocale } from "next-intl";
import brain from "@/../public/brain/brain.png";
import Image from "next/image";
import LoadingTree from "@/components/zaLoader/LoadingTree";

function Brain() {
  const locale = useLocale();

  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            The Community have the solution to all problems,{" "}
            <span>SUSTAINABLE CULTURE</span>
          </h2>
        </div>
        <div className={styles.text}>
          <p>
            The evolution of culture is a process of dynamic change in the way
            human society sees, understands and acts, linked to values ​​and
            beliefs shaped over time.
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
            src={brain}
            alt="brain"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
    </>
  );
}

export default Brain;
