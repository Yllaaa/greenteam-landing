/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import logo from "@/../public/logo/fullLogo.png";
import styles from "./navbar.module.css";
import Image from "next/image";
import LangBtn from "./languageBtn/LangBtn";
import Link from "next/link";
import { ScreenBreakpoints } from "@/Utils/screenBreakPoints/ScreenBreakPoints";
// import axios from "axios";
import { useRouter } from "next/navigation";
// import { useRouter, useSearchParams } from "next/navigation";
// import { setUserLoginData } from "@/store/features/login/userLoginSlice";
// import { useAppDispatch } from "@/store/hooks";

function Navbar() {
  const t = useTranslations("landing.navbar");
  const locale = useLocale();
  // const params = useSearchParams();

  const router = useRouter();

  // console.log(params.get("token"));
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   if (localStorage.getItem("user")) {
  //     const user = localStorage.getItem("user");
  //     const userObj = JSON.parse(user!);
  //     console.log(userObj);
  //     router.push(`/${locale}/feeds`);

  //     axios
  //       .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/me`, {
  //         headers: {
  //           Authorization: `Bearer ${userObj.accessToken}`,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  //   if (params.get("token")) {
  //     const userObj = params.get("token");
  //     console.log(userObj);
  //     // router.push(`/${locale}/feeds`);

  //     axios
  //       .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/me`, {
  //         headers: {
  //           Authorization: `Bearer ${userObj}`,
  //         },
  //       })
  //       .then((res) => {
  //         router.push(`/${locale}/feeds`);
  //         const finalRes = {
  //           ...res.data,
  //           accessToken: userObj,
  //         };
  //         localStorage.setItem("user", JSON.stringify(finalRes));
  //         dispatch(setUserLoginData(finalRes));
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, []);
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleClickOutsideMenu = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, [handleClickOutsideMenu]);

  const { isMobile } = ScreenBreakpoints();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const redirectToDownloadLink = () => {
    window.open("https://play.google.com/store/apps/");
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image onClick={() => router.push(`/${locale}`)} src={logo} alt="logo" />
        </div>
        <div className={styles.links}>
          <p onClick={redirectToDownloadLink}>{t("downloadApp")}</p>
          <LangBtn />
        </div>
        <div className={styles.auth}>
          <Link
            href={`/${locale}/login`}
            className={`${styles.login} ${styles.btn}`}
          >
            {t("login")}
          </Link>
          <Link
            href={`/${locale}/register`}
            className={`${styles.signup} ${styles.btn}`}
          >
            {t("signUp")}
          </Link>
        </div>
        <div
          style={{ zIndex: "100" }}
          className={styles.navbarResponsive}
          onClick={toggleMenu}
        >
          <svg
            width="20"
            height="15"
            viewBox="0 0 20 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.527344 0.0595704C0.199219 0.180664 0 0.481445 0 0.856445C0 1.24707 0.226562 1.56348 0.582031 1.67285C0.796875 1.73535 19.2031 1.73535 19.418 1.67285C19.7734 1.56348 20 1.24707 20 0.856445C20 0.473633 19.8008 0.176758 19.457 0.0556642C19.3047 0.00488293 18.2617 -0.00292957 9.98438 0.000976682C1.95312 0.000976682 0.664062 0.00878918 0.527344 0.0595704Z"
              fill="#97b00f"
            />
            <path
              d="M0.425781 6.49316C0.332031 6.54395 0.203125 6.66113 0.136719 6.75098C0.0273438 6.90332 0.0195312 6.94629 0.0195312 7.24316C0.0195312 7.54004 0.0273438 7.58301 0.136719 7.73535C0.203125 7.8252 0.332031 7.94238 0.425781 7.99316L0.597656 8.08301H10H19.4023L19.5742 7.99316C19.668 7.94238 19.8008 7.8252 19.8633 7.73535C19.9727 7.58301 19.9805 7.54004 19.9805 7.24316C19.9805 6.94629 19.9727 6.90332 19.8633 6.75098C19.8008 6.66113 19.668 6.54395 19.5742 6.49316L19.4023 6.40332H10H0.597656L0.425781 6.49316Z"
              fill="#4f8f92"
            />
            <path
              d="M0.574219 12.8213C0.21875 12.9346 0 13.2393 0 13.6299C0 14.0166 0.238281 14.3525 0.574219 14.4463C0.78125 14.5049 19.2188 14.5049 19.4258 14.4463C19.7617 14.3525 20 14.0166 20 13.6299C20 13.2275 19.7617 12.9072 19.3906 12.8135C19.1406 12.751 0.777344 12.7588 0.574219 12.8213Z"
              fill="#2c3e50"
            />
          </svg>
        </div>
        {mounted && isMobile && (
          <div
            className={`${styles.menuContainer} ${isOpen ? styles.open : ""}`}
            ref={menuRef}
            style={{ zIndex: "101" }}
          >
            <div
              style={{ zIndex: "100" }}
              className={styles.navbarResponsiveClose}
              onClick={toggleMenu}
            >
              <svg
                width="20"
                height="15"
                viewBox="0 0 20 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.527344 0.0595704C0.199219 0.180664 0 0.481445 0 0.856445C0 1.24707 0.226562 1.56348 0.582031 1.67285C0.796875 1.73535 19.2031 1.73535 19.418 1.67285C19.7734 1.56348 20 1.24707 20 0.856445C20 0.473633 19.8008 0.176758 19.457 0.0556642C19.3047 0.00488293 18.2617 -0.00292957 9.98438 0.000976682C1.95312 0.000976682 0.664062 0.00878918 0.527344 0.0595704Z"
                  fill="#97b00f"
                />
                <path
                  d="M0.425781 6.49316C0.332031 6.54395 0.203125 6.66113 0.136719 6.75098C0.0273438 6.90332 0.0195312 6.94629 0.0195312 7.24316C0.0195312 7.54004 0.0273438 7.58301 0.136719 7.73535C0.203125 7.8252 0.332031 7.94238 0.425781 7.99316L0.597656 8.08301H10H19.4023L19.5742 7.99316C19.668 7.94238 19.8008 7.8252 19.8633 7.73535C19.9727 7.58301 19.9805 7.54004 19.9805 7.24316C19.9805 6.94629 19.9727 6.90332 19.8633 6.75098C19.8008 6.66113 19.668 6.54395 19.5742 6.49316L19.4023 6.40332H10H0.597656L0.425781 6.49316Z"
                  fill="#4f8f92"
                />
                <path
                  d="M0.574219 12.8213C0.21875 12.9346 0 13.2393 0 13.6299C0 14.0166 0.238281 14.3525 0.574219 14.4463C0.78125 14.5049 19.2188 14.5049 19.4258 14.4463C19.7617 14.3525 20 14.0166 20 13.6299C20 13.2275 19.7617 12.9072 19.3906 12.8135C19.1406 12.751 0.777344 12.7588 0.574219 12.8213Z"
                  fill="#2c3e50"
                />
              </svg>
            </div>
            <ul>
              <li
                onClick={() => redirectToDownloadLink()}
                className={`${styles.item}`}
              >
                {t("downloadApp2")}
              </li>
              <li className={`${styles.item}`}>
                <LangBtn />
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
