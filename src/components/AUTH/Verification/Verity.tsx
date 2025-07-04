/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { setUserLoginData } from "@/store/features/login/userLoginSlice";
import { useAppDispatch } from "@/store/hooks";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import styles from "./verification.module.css";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

function Verity() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/verify/${params.get(
          "key"
        )}`
      )
      .then((res) => {
        console.log(res.data);
        
        dispatch(setUserLoginData(res.data));
        localStorage.setItem("user", JSON.stringify(res.data));
        router.push(`/${locale}/feeds`);
        ToastNot("Verification successful");
      })
      .catch((err) => {
        ToastNot(err.response.data.message);
        router.push(`/${locale}/login`);
        console.log(err);
      });
  }, [dispatch, params]);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>verifying...</div>
      </div>
    </>
  );
}

export default Verity;
