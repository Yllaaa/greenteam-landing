"use client";
import React from "react";
import styles from "./hero.module.css";
import roundText from "@/../public/hero sections/roundText.svg";
import googleIcon from "@/../public/icons/google.svg";
import logo from "@/../public/logo/foot.png";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { AOSInit } from "@/Utils/aos/aos";
import "aos/dist/aos.css";
import { FaArrowRightLong } from "react-icons/fa6";
import LoadingTree from "@/components/zaLoader/LoadingTree";
function Hero() {
  const locale = useLocale();
  React.useEffect(() => {
    AOSInit(1500);
  }, []);

  const [logoLoaded, setLogoLoaded] = React.useState(false);
  
  return (
    <>
      <div className={styles.container}>
        {!logoLoaded ? (
          <div className={styles.logoLoader}>
            <LoadingTree />
          </div>
        ) : null}
        <div className={styles.logo}>
          <Image
            src={logo}
            alt="logo"
            loading="lazy"
            onLoad={() => setLogoLoaded(true)}
          />
        </div>
        <div className={styles.header}>
          <h2>
            <span className={styles.headerSpan}>
              <Image src={roundText} alt="roundText" />
              Sustainability{" "}
            </span>
            is a way of life
          </h2>
        </div>
        <div className={styles.text}>
          <p>Be part of the sustentable community.</p>
        </div>
        <div className={styles.userOverWorld}></div>
        <div className={styles.logoText}>
          <h4>The conscient</h4>
          <h4>social net.</h4>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.download}>
            Download app <FaArrowRightLong />
          </button>
          <button className={styles.googleLink}>
            Login with Google
            <Image src={googleIcon} alt="googleIcon" />
          </button>
          <Link className={styles.register} href={`/${locale}/register`}>
            Register
          </Link>
        </div>
      </div>
    </>
  );
}

export default Hero;
