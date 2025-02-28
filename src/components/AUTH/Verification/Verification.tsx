/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import styles from "./verification.module.css";
import Image from "next/image";
import bgImage from "@/../public/auth/dots.png";
import message from "@/../public/auth/message.svg";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { setUserLoginData } from "@/store/features/login/userLoginSlice";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function Verification() {
  const t = useTranslations('auth.verification');
  const params = useSearchParams();
  // console.log(params.get("key"));
  const dispatch = useAppDispatch();

  const locale = useLocale();
  const newUser = useAppSelector((state) => state.signup);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/verify/${params.get(
          "key"
        )}`
      )
      .then((res) => {
        dispatch(setUserLoginData(res.data.user));
        ToastNot(res.data.message);
      })
      .catch((err) => {
        ToastNot(err.response.data.message);
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className={styles.container}>
        <Image src={bgImage} alt="bg" className={styles.bg} />
        <div className={styles.verification}>
          <div className={styles.message}>
            <Image src={message} alt="message" />
          </div>
          <div className={styles.text}>
            <h3>{t('hi')} {newUser.user?.username}</h3>
            <h4>{t('weSent')}</h4>
            <p>
              {t("didn'tReceive")}
            </p>
          </div>
          <div className={styles.btn}>
            <Link href={`/${locale}/login`}>{t("verityEmail")}</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Verification;
