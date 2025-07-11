/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import styles from "./hero.module.css";
import roundText from "@/../public/hero sections/roundText.svg";
import googleIcon from "@/../public/icons/google.svg";
import logo from "@/../public/logo/foot.png";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AOSInit } from "@/Utils/aos/aos";
import "aos/dist/aos.css";
import { FaArrowRightLong } from "react-icons/fa6";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { useSearchParams } from "next/navigation";
import { setUserLoginData } from "@/store/features/login/userLoginSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
function Hero() {
  const t = useTranslations('landing.hero');
  const locale = useLocale();
  React.useEffect(() => {
    AOSInit(1500);
  }, []);
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoLoaded, setLogoLoaded] = React.useState(false);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = localStorage.getItem("user");
      const userObj = JSON.parse(user!);
      console.log(userObj);
      router.push(`/${locale}/feeds`);

      axios
        .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${userObj.accessToken}`,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (params.get("token")) {
      const userObj = params && params.get("token");
      console.log(userObj);
      // router.push(`/${locale}/feeds`);

      axios
        .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${userObj}`,
          },
        })
        .then((res) => {
          router.push(`/${locale}/feeds`);
          const finalRes = {
            ...res.data,
            accessToken: userObj,
          };
          localStorage.setItem("user", JSON.stringify(finalRes));
          dispatch(setUserLoginData(finalRes));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const googleSignIn = () => {
    // Your Google Sign In logic here
    window.open(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/google/login`,
      "_blank"
    );
  };
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
              {t('sustainability')}{" "}
            </span>
            {t('wayOfLife')}
          </h2>
        </div>
        <div className={styles.text}>
          <p>{t('bePart')}</p>
        </div>
        <div className={styles.userOverWorld}></div>
        <div className={styles.logoText}>
          <h4>{t('theConscient')}</h4>
          <h4>{t('socialNet')}</h4>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.download}>
            {t('downloadApp')} <FaArrowRightLong />
          </button>
          <button onClick={googleSignIn} className={styles.googleLink}>
            {t('loginWithGoogle')}
            <Image src={googleIcon} alt="googleIcon" />
          </button>
          <Link className={styles.register} href={`/${locale}/register`}>
            {t('register')}
          </Link>
        </div>
      </div>
    </>
  );
}

export default Hero;
