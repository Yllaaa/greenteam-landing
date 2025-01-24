"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import styles from "./signup.module.css";
import Link from "next/link";
import Image from "next/image";
import footLogo from "@/../public/logo/foot.png";
import bgImage from "@/../public/auth/dots.png";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import earthImage from "@/../public/auth/earth.svg";
// redux

import { useAppDispatch } from "@/store/hooks";
import { setUserSignupData } from "@/store/features/signup/userSignupSlice";

function SignUpForm() {
  const router = useRouter();
  const locale = useLocale();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
  }>();
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
    setShowConfirmPassword(!showPassword);

  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [selectedOptionError, setSelectedOptionError] = useState<string>("");
  const handleRadioClick = () => {
    setSelectedOption(!selectedOption);
  };

  const notify = (message: string) =>
    toast(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  const signup = () => {
    if (!selectedOption) {
      setSelectedOptionError("Please accept terms and conditions");
    } else if (selectedOption) {
      setSelectedOptionError("");
    }
    try {
      if (data.password !== data.confirmPassword)
        return notify("Password does not match");
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
          if (response.status === 200) notify("Account created successfully");
          dispatch(setUserSignupData(response.data));
          router.push(`/${locale}/login`);
        })
        .catch((error) => {
          console.log(error);
          notify("Account creation failed");
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
              <h5>Create an account</h5>
              <p>Sign up now and unlock exclusive access!</p>
            </div>
          </div>
          <form
            className={styles.form}
            onSubmit={handleSubmit((data) => {
              setData(data);
            })}
          >
            <label htmlFor="username">
              User Name <span>*</span>
            </label>
            <div className={styles.indentifierField}>
              <input
                id="username"
                type="text"
                placeholder="Email or Username"
                {...register("username", {
                  required: { value: true, message: "Email is required" },
                })}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                className={styles.input}
              />{" "}
              {errors.username && (
                <p className={styles.errorMessage}>Indentifier is required</p>
              )}
            </div>
            <label htmlFor="email">
              Email <span>*</span>
            </label>
            <div className={styles.indentifierField}>
              <input
                id="email"
                type="text"
                placeholder="Email or email"
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                })}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className={styles.input}
              />{" "}
              {errors.email && (
                <p className={styles.errorMessage}>Indentifier is required</p>
              )}
            </div>
            <label htmlFor="password">
              Password <span>*</span>
            </label>
            <div className={styles.passwordField}>
              <div className={styles.passwordInput}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
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
                <p className={styles.errorMessage}>Check password field</p>
              )}
            </div>
            <label htmlFor="confirmPasswordpassword">
              Confirm Password <span>*</span>
            </label>
            <div className={styles.passwordField}>
              <div className={styles.passwordInput}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="confirmPassword"
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
                <p className={styles.errorMessage}>Check password field</p>
              )}
            </div>
            <div className={styles.agreeSectionContainer}>
              <div className={styles.agreeSectionAll}>
                <div className={styles.agreeSection}>
                  <div
                    style={
                      selectedOption
                        ? { backgroundColor: "#3c6060" }
                        : { backgroundColor: "#495C5C" }
                    }
                    className={styles.radioBtnContainer}
                  >
                    <input
                      type="radio"
                      name="accept"
                      id="accept"
                      value={selectedOption ? "yes" : "no"}
                      checked={selectedOption}
                      onChange={(e) => {
                        handleRadioClick();
                        console.log(e.target.value);
                      }}
                      onClick={() => {
                        setSelectedOption(!selectedOption);
                      }}
                      className={styles.radio}
                    />
                  </div>
                  <p>
                    I agree to the{" "}
                    <Link href={"service"}>terms of services</Link>
                  </p>
                </div>
                <div className={styles.forgetPassword}>
                  <Link href={`/${locale}/forget-password`}>
                    Forget Password?
                  </Link>
                </div>
              </div>
              {selectedOptionError && (
                <div className={styles.errorMessage}>{selectedOptionError}</div>
              )}
            </div>

            <button type="submit" onClick={signup}>
              Signup
            </button>
          </form>
          <p className={styles.createAccount}>
            Have an account? <Link href={`/${locale}/login`}> Login</Link>
          </p>
        </div>
        <div className={styles.sideImageContainer}>
          <div className={styles.bgImage}>
            <Image src={bgImage} alt="bgImage" />
          </div>
          <div className={styles.sideHeader}>
            <h4>Join the Movement for a </h4>
            <h3>Greener Future</h3>
            <p>
              Be part of a global community working together to create
              sustainable solutions for a healthier planet.
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

export default SignUpForm;
