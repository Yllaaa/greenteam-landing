// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
// import ReCAPTCHA from "react-google-recaptcha";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import styles from "./signup.module.css";
import Link from "next/link";
import Image from "next/image";
import footLogo from "@/../public/logo/foot.png";
import bgImage from "@/../public/auth/dots.png";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import earthImage from "@/../public/auth/earth.svg";
import googleIcon from "@/../public/icons/google.svg";
// yup
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// redux
import { useAppDispatch } from "@/store/hooks";
import { setUserSignupData } from "@/store/features/signup/userSignupSlice";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function SignUpForm() {
  const t = useTranslations("auth.signUp");
  const router = useRouter();
  const locale = useLocale();


  // yup
  const passwordSchema = yup.object().shape({
    email: yup.string().required(t("emailRequired")).email(t("invalidEmail")),

    password: yup
      .string()
      .required(t("passwordRequired"))
      .min(8, t("passwordMin")),

    username: yup
      .string()
      .required(t("usernameRequired"))
      .min(3, t("usernameMin"))
      .max(20, t("usernameMax")),

    confirmPassword: yup.string().required(t("confirmRequired")),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
  }>({ resolver: yupResolver(passwordSchema) });
  // data
  const [data, setData] = useState<
    | {
        email: string;
        password: string;
        username: string;
        confirmPassword: string;
      }
    | FieldValues
  >({ email: "", password: "", username: "", confirmPassword: "" });

  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [selectedOptionError, setSelectedOptionError] = useState<string>("");
  const handleRadioClick = () => {
    setSelectedOption(!selectedOption);
  };

  const signup = () => {
    // Check if captcha is verified
    // if (!captchaToken) {
    //   ToastNot(t("pleaseSolveCaptcha"));
    //   return;
    // }
    if (!selectedOption) {
      setSelectedOptionError(t("pleaseAccept"));
    } else if (selectedOption) {
      setSelectedOptionError("");
    }
    try {
      if (data.password !== data.confirmPassword)
        return ToastNot(t("passwordNotMatch"));
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/register`,
          {
            email: data.email,
            password: data.password,
            username: data.username,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.status === 200) ToastNot(t("signUpSuccess"));
          dispatch(setUserSignupData(response.data));
          localStorage.setItem("user", JSON.stringify(response.data));
          router.replace(`/${locale}/verification`);
        })
        .catch((error) => {
          console.log(error);
          ToastNot(error.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

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
              <h5>{t("createAccount")}</h5>
              <p>{t("signUpNow")}</p>
            </div>
          </div>
          <div className={styles.icons}>
            <div onClick={googleSignIn} className={styles.icon}>
              <Image src={googleIcon} alt="logo" />
            </div>
          </div>
          <form
            className={styles.form}
            onSubmit={handleSubmit((data) => {
              setData(data);
            })}
          >
            <label htmlFor="username">
              {t("username")} <span>*</span>
            </label>
            <div className={styles.indentifierField}>
              <input
                id="username"
                type="text"
                placeholder={t("username")}
                {...register("username", {
                  required: { value: true, message: t("usernameRequired") },
                })}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                className={styles.input}
              />{" "}
              {errors.username && (
                <p className={styles.errorMessage}>{errors.username.message}</p>
              )}
            </div>
            <label htmlFor="email">
              {t("email")} <span>*</span>
            </label>
            <div className={styles.indentifierField}>
              <input
                id="email"
                type="text"
                placeholder={t("email")}
                {...register("email", {
                  required: { value: true, message: t("emailRequired") },
                })}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className={styles.input}
              />{" "}
              {errors.email && (
                <p className={styles.errorMessage}>{errors.email.message}</p>
              )}
            </div>
            <label htmlFor="password">
              {t("password")} <span>*</span>
            </label>
            <div className={styles.passwordField}>
              <div className={styles.passwordInput}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password")}
                  {...register("password", { required: true, minLength: 8 })}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />{" "}
                <div className={styles.eye} onClick={togglePasswordVisibility}>
                  {showPassword ? <LuEye /> : <LuEyeClosed />}
                </div>
              </div>
              {errors.password && (
                <p className={styles.errorMessage}>{errors.password.message}</p>
              )}
            </div>
            <label htmlFor="confirmPasswordpassword">
              {t("confirmPassword")} <span>*</span>
            </label>
            <div className={styles.passwordField}>
              <div className={styles.passwordInput}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("confirmPassword")}
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
                <p className={styles.errorMessage}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className={styles.agreeSectionContainer}>
              <div className={styles.agreeSectionAll}>
                <div className={styles.agreeSection}>
                  <div
                    className={`${styles.radioBtnContainer} ${selectedOption ? styles.checked : ''}`}
                    onClick={() => {
                      setSelectedOption(!selectedOption);
                      setSelectedOptionError("");
                    }}
                  >
                    <input
                      type="radio"
                      name="accept"
                      id="accept"
                      value={selectedOption ? "yes" : "no"}
                      checked={selectedOption}
                      onChange={() => {
                        handleRadioClick();
                      }}
                      className={styles.radio}
                    />
                    {selectedOption && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </div>
                  <p>
                    {t("IAgree")}{" "}
                    <Link href={"service"}>{t("termsOfService")}</Link>
                  </p>
                </div>
                <div className={styles.forgetPassword}>
                  <Link href={`/${locale}/forget-password`}>
                    {t("forgetPassword")}
                  </Link>
                </div>
              </div>
              {selectedOptionError && (
                <div className={styles.errorMessage}>{selectedOptionError}</div>
              )}
            </div>
            <div className={styles.captchaContainer}>
              {/* <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={(token: any) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              /> */}
            </div>
            <button type="submit" onClick={signup}>
              {t("signUp")}
            </button>
          </form>
          <p className={styles.createAccount}>
            {t("alreadyHaveAccount")}{" "}
            <Link href={`/${locale}/login`}> {t("login")}</Link>
          </p>
        </div>
        <div className={styles.sideImageContainer}>
          <div className={styles.bgImage}>
            <Image src={bgImage} alt="bgImage" />
          </div>
          <div className={styles.sideHeader}>
            <h4>{t("join")}</h4>
            <h3>{t("greenerFuture")}</h3>
            <p>{t("bePart")}</p>
          </div>
          <div className={styles.foots}>
            <Image src={earthImage} alt="feet" />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
