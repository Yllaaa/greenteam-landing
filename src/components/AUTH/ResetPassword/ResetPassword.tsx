"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import styles from "./resetPassword.module.css";
import Link from "next/link";
import Image from "next/image";
import footLogo from "@/../public/logo/foot.png";
import bgImage from "@/../public/auth/dots.png";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import earthImage from "@/../public/auth/earth.svg";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function ResetPassword() {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const locale = useLocale();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{
    password: string;
    confirmPassword: string;
  }>();
  const [data, setData] = useState<
    | {
        password: string;
        confirmPassword: string;
      }
    | FieldValues
  >({ password: "", confirmPassword: "" });



  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showPassword);

  
  const passwordReset = () => {
    try {
      if (data.password !== data.confirmPassword)
        return ToastNot(t('passwordNotMatch'));
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/register`,
          {
            password: data.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.status === 200) ToastNot(t('resetSuccess'));
          router.push(`/${locale}/login`);
        })
        .catch((error) => {
          console.log(error);
          ToastNot(t('resetFailed'));
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.shadowBg1}></div>
        <div className={styles.shadowBg2}></div>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            {/* logo */}
            <div className={styles.logo}>
              <Image
                src={footLogo}
                alt="logo"
                onClick={() => router.push("/")}
                style={{ cursor: "pointer" }}
              />
            </div>
            {/* header */}
            <div className={styles.title}>
              <h5>{t('resetPassword')}</h5>
              <p>{t('writePassword')}</p>
            </div>
          </div>
          <form
            className={styles.form}
            onSubmit={handleSubmit((data) => {
              setData(data);
            })}
          >
            
            <label htmlFor="password">
              {t('password')} <span>*</span>
            </label>
            <div className={styles.passwordField}>
              <div className={styles.passwordInput}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('password')}
                  {...register("password", { required: true })}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />{" "}
                <div className={styles.eye} onClick={togglePasswordVisibility}>
                  {showPassword ? <LuEye /> : <LuEyeClosed />}
                </div>
              </div>
              {errors.password && (
                <p className={styles.errorMessage}>{t('checkPassword')}</p>
              )}
            </div>
            <label htmlFor="confirmPasswordpassword">
              {t('confirmPassword')} <span>*</span>
            </label>
            <div className={styles.passwordField}>
              <div className={styles.passwordInput}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('confirmPassword')}
                  {...register("confirmPassword", { required: true })}
                  onChange={(e) =>
                    setData({ ...data, confirmPassword: e.target.value })
                  }
                />{" "}
                <div
                  className={styles.eye}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <LuEye /> : <LuEyeClosed />}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className={styles.errorMessage}>{t('checkPassword')}</p>
              )}
            </div>
            

            <button type="submit" onClick={passwordReset}>
              {t('reset')}
            </button>
          </form>
          <p className={styles.createAccount}>
            {t('wantLogin')} <Link href={`/${locale}/login`}> {t('login')}</Link>
          </p>
        </div>
        <div className={styles.sideImageContainer}>
          <div className={styles.bgImage}>
            <Image src={bgImage} alt="bgImage" />
          </div>
          <div className={styles.sideHeader}>
            <h4>{t('join')}</h4>
            <h3>{t('greenerFuture')}e</h3>
            <p>
              {t('bePart')}
            </p>
          </div>
          <div className={styles.foots}>
            <Image src={earthImage} alt="feet" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
