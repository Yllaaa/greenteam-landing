/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./verification.module.css";
import Image from "next/image";
import bgImage from "@/../public/auth/dots.png";
import message from "@/../public/auth/message.svg";
import { useAppSelector } from "@/store/hooks";
import { useLocale, useTranslations } from "next-intl";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
import axios from "axios";
// import { setUserLoginData } from "@/store/features/login/userLoginSlice";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { useRouter } from "next/navigation";

// Timer Component
const Timer: React.FC<{ seconds: number; onComplete: () => void }> = ({
  seconds,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;

  return (
    <div className={styles.timer}>
      <p>
        resend in: {minutes}:
        {remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
      </p>
    </div>
  );
};

function Verification() {
  const t = useTranslations("auth.verification");
  // const params = useSearchParams();
  // const dispatch = useAppDispatch();

  const locale = useLocale();
  const newUser = useAppSelector((state) => state.signup);
  const [timeOut, setTimeOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!newUser.user) {
      router.push(`/${locale}/login`);
    }
  }, []);

  const handleResendEmail = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/resend-verification`,
        {
          email: newUser.user?.email,
        }
      )
      .then((res) => {
        console.log(res.data);
        ToastNot("Verification email resent");
      });
    // Add your resend email logic here
    setTimeOut(false);
  };

  return (
    <>
      <div className={styles.container}>
        <Image src={bgImage} alt="bg" className={styles.bg} />
        <div className={styles.verification}>
          <div className={styles.message}>
            <Image src={message} alt="message" />
          </div>
          <div className={styles.text}>
            <h3>
              {t("hi")} {newUser.user?.username}
            </h3>
            <h4>{t("weSent")}</h4>
            <p>{t("didn'tReceive")}</p>
          </div>

          {!timeOut ? (
            <Timer seconds={60} onComplete={() => setTimeOut(true)} />
          ) : (
            <div className={styles.timeOut}>
              <button
                onClick={handleResendEmail}
                className={styles.resendButton}
              >
                {t("verityEmail")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Verification;
