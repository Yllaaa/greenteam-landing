"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { LuEye, LuEyeClosed } from "react-icons/lu";

import styles from "./resetPassword.module.css";
import footLogo from "@/../public/logo/foot.png";
import bgImage from "@/../public/auth/dots.png";
import earthImage from "@/../public/auth/earth.svg";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

function ResetPassword() {
  const t = useTranslations('auth.resetPassword');
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  // Get the reset key from URL parameters
  const resetKey = searchParams.get('key');

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
  } = useForm<ResetPasswordForm>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watch password field for validation
  const password = watch("password");

  useEffect(() => {
    // Redirect if no reset key is present
    if (!resetKey) {
      ToastNot(t('invalidResetLink'));
      router.push(`/${locale}/login`);
    }
  }, [resetKey, router, locale, t]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      if (!resetKey) {
        ToastNot(t('invalidResetLink'));
        return;
      }

      // Call the reset password endpoint with the key
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/reset-password/${resetKey}`,
        {
          password: data.password,
        },
        {
          headers: {
            
            "Content-Type": "application/json",

          },
        }
      );

      if (response.data) {
        ToastNot(t('resetSuccess'));
        router.push(`/${locale}/login`);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || t('resetFailed');
        ToastNot(errorMessage);
      } else {
        ToastNot(t('resetFailed'));
      }
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

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="password">
              {t('password')} <span>*</span>
            </label>
            <div className={styles.passwordField}>
              <div className={styles.passwordInput}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('password')}
                  {...register("password", {
                    required: t('passwordRequired'),
                    minLength: {
                      value: 8,
                      message: t('passwordMinLength')
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: t('passwordComplexity')
                    }
                  })}
                />
                <div className={styles.eye} onClick={togglePasswordVisibility}>
                  {showPassword ? <LuEye /> : <LuEyeClosed />}
                </div>
              </div>
              {errors.password && (
                <p className={styles.errorMessage}>{errors.password.message}</p>
              )}
            </div>

            <label htmlFor="confirmPassword">
              {t('confirmPassword')} <span>*</span>
            </label>
            <div className={styles.passwordField}>
              <div className={styles.passwordInput}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('confirmPassword')}
                  {...register("confirmPassword", {
                    required: t('confirmPasswordRequired'),
                    validate: value => value === password || t('passwordNotMatch')
                  })}
                />
                <div
                  className={styles.eye}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <LuEye /> : <LuEyeClosed />}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={isSubmitting ? styles.disabledButton : ''}
            >
              {isSubmitting ? t('resetting') : t('reset')}
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
            <h3>{t('greenerFuture')}</h3>
            <p>{t('bePart')}</p>
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