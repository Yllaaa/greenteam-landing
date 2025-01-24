"use client"
import React from "react";
import styles from "./verification.module.css";
import Image from "next/image";
import bgImage from "@/../public/auth/dots.png";
import message from "@/../public/auth/message.svg";
import { useAppSelector } from "@/store/hooks";
import { useLocale } from "next-intl";
import Link from "next/link";

function Verification() {
  const locale = useLocale();
  const newUser = useAppSelector((state) => state.signup);
  return (
    <>
      <div className={styles.container}>
        <Image src={bgImage} alt="bg" className={styles.bg} />
        <div className={styles.verification}>
          <div className={styles.message}>
            <Image src={message} alt="message" />
          </div>
          <div className={styles.text}>
            <h3>Hi! {newUser.user?.username}</h3>
            <h4>We’ve sent a verification link to your email.</h4>
            <p>
              Didn’t receive the email? Check your spam folder or contact our
              support team for assistance
            </p>
          </div>
          <div className={styles.btn}>
            <Link href={`/${locale}/login`}>Verify Email</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Verification;
