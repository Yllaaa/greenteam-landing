"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

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
// yup
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// redux
import { useAppDispatch } from "@/store/hooks";
import { setUserSignupData } from "@/store/features/signup/userSignupSlice";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function SignUpForm() {
  const router = useRouter();
  const locale = useLocale();
  // register form react-forms
  // yup
  const passwordSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid email"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),

    username: yup
      .string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must not exceed 20 characters"),

    confirmPassword: yup.string().required("Confirm Password is required"),
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
    if (!selectedOption) {
      setSelectedOptionError("Please accept terms and conditions");
    } else if (selectedOption) {
      setSelectedOptionError("");
    }
    try {
      if (data.password !== data.confirmPassword)
        return ToastNot("Password does not match");
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
          if (response.status === 200) ToastNot("Account created successfully");
          dispatch(setUserSignupData(response.data));
          router.replace(`/${locale}/login`);
        })
        .catch((error) => {
          console.log(error);
          ToastNot(error.response.data.message);
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
                <p className={styles.errorMessage}>{errors.username.message}</p>
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
                <p className={styles.errorMessage}>{errors.email.message}</p>
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
                <p className={styles.errorMessage}>
                  {errors.confirmPassword.message}
                </p>
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
