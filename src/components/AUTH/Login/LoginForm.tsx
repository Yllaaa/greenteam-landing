/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import styles from "./loginForm.module.css";
import Image from "next/image";
import footLogo from "@/../public/logo/foot.png";
import googleIcon from "@/../public/icons/google.svg";
// import facebookIcon from "@/../public/icons/facebook.svg";
// import appleIcon from "@/../public/icons/apple.svg";
// import twitterIcon from "@/../public/icons/twitter.svg";
import bgImage from "@/../public/auth/dots.png";
import feet from "@/../public/auth/foots.svg";
import { LuEye, LuEyeClosed } from "react-icons/lu";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import "react-toastify/dist/ReactToastify.css";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUserLoginData } from "@/store/features/login/userLoginSlice";
import https from "https";
function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const locale = useLocale();

  // form
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [data, setData] = useState<
    { identifier: string; password: string; selection: boolean } | FieldValues
  >({ identifier: "", password: "", selection: false });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [selectedOptionError, setSelectedOptionError] = useState<string>("");
  const handleRadioClick = () => {
    setSelectedOption(!selectedOption);
  };
  // end form
  const dispatch = useAppDispatch();
  const newUserSignup = useAppSelector((state) => state.signup);

  useEffect(() => {
    if (newUserSignup.user) {
      ToastNot(newUserSignup.message);
    }
  }, []);

  // const iconsArray = [googleIcon, facebookIcon, appleIcon, twitterIcon];

  const googleSignIn = () => {
    // Your Google Sign In logic here
    window.open(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/google/login`,
      "_blank"
    );
  };
  const login = () => {
    if (!selectedOption) {
      setSelectedOptionError(t("pleaseAccept"));
      ToastNot(t("pleaseAccept"));
    } else if (selectedOption) {
      setSelectedOptionError("");
    }
    console.log(data);

    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/login`,
          {
            identifier: data?.identifier,
            password: data?.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            httpsAgent: new https.Agent({
              rejectUnauthorized: false,
            }),
          }
        )
        .then((response) => {
          console.log(response);
          localStorage.setItem("user", JSON.stringify(response.data));
          document.cookie = `user=${JSON.stringify(response.data.accessToken)}`;
          dispatch(setUserLoginData(response.data));
          ToastNot(t("loginSuccess"));
          setTimeout(() => {
            router.replace(`/${locale}/feeds`);
          }, 3000);
        })
        .catch((error) => {
          if (error.response.data) {
            ToastNot(error.response.data.message);
          } else {
            ToastNot(t("loginFailed"));
          }
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
              <h5>{t("login")}</h5>
              <p>{t("signInNow")}</p>
            </div>
            {/* icons */}
            <div className={styles.icons}>
              <div onClick={googleSignIn} className={styles.icon}>
                <Image src={googleIcon} alt="logo" />
              </div>
              {/* {iconsArray.map((icon, index) => (
                
              ))} */}
            </div>
            {/* secerate line */}
            <div className={styles.line}>
              <div className={styles.lineBefore}></div>
              <p>{t("or")}</p>
              <div className={styles.lineAfter}></div>
            </div>
          </div>
          <form
            className={styles.form}
            onSubmit={handleSubmit((data) => {
              setData(data);
            })}
          >
            <p className={styles.errorMessage}>{newUserSignup.message}</p>
            <label htmlFor="identifier">
              {t("name")} <span>*</span>
            </label>
            <div className={styles.indentifierField}>
              <input
                id="identifier"
                type="text"
                value={
                  newUserSignup.user
                    ? newUserSignup.user.username
                    : data.identifier
                }
                placeholder={
                  newUserSignup.user
                    ? newUserSignup.user.email
                    : t("emailOrUsername")
                }
                {...register("identifier", {
                  required: { value: true, message: t("emailRequired") },
                })}
                onChange={(e) =>
                  setData({ ...data, identifier: e.target.value })
                }
                className={styles.input}
              />{" "}
              {errors.identifier && (
                <p className={styles.errorMessage}>{t("identifierRequired")}</p>
              )}
            </div>
            <label htmlFor="password">{t("password")}</label>
            <div className={styles.passwordField}>
              <div className={styles.passwordInput}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password")}
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
                <p className={styles.errorMessage}>{t("checkPassword")}</p>
              )}
            </div>
            <div className={styles.agreeSectionContainer}>
              <div className={styles.agreeSectionAll}>
                <div className={styles.agreeSection}>
                  <div
                    style={
                      selectedOption
                        ? { backgroundColor: "#307040" }
                        : { backgroundColor: "#96b032" }
                    }
                    className={styles.radioBtnContainer}
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
                      onClick={() => {
                        setSelectedOption(!selectedOption);
                      }}
                      className={styles.radio}
                    />
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

            <button type="submit" onClick={login}>
              {t("login")}
            </button>
          </form>
          <p className={styles.createAccount}>
            {t("don'tHaveAccount")}{" "}
            <Link href={`/${locale}/register`} replace>
              {" "}
              {t("signUp")}
            </Link>
          </p>
        </div>
        <div className={styles.sideImageContainer}>
          <div className={styles.bgImage}>
            <Image src={bgImage} alt="bgImage" />
          </div>
          <div className={styles.sideHeader}>
            <h4>{t("welcomeBack")}</h4>
            <h3>{t("sustainability")}</h3>
            <p>{t("reconnect")}</p>
          </div>
          <div className={styles.foots}>
            <Image src={feet} alt="feet" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
