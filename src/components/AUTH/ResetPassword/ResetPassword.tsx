"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import styles from "./resetPassword.module.css";
import Link from "next/link";
import Image from "next/image";
import footLogo from "@/../public/logo/foot.png";
import bgImage from "@/../public/auth/dots.png";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import earthImage from "@/../public/auth/earth.svg";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function ResetPassword() {
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
        return ToastNot("Password does not match");
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
          if (response.status === 200) ToastNot("Password reset successfully");
          router.push(`/${locale}/login`);
        })
        .catch((error) => {
          console.log(error);
          ToastNot("Reset password failed");
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
              <h5>Reset Password</h5>
              <p>Write Your Password To reset it</p>
            </div>
          </div>
          <form
            className={styles.form}
            onSubmit={handleSubmit((data) => {
              setData(data);
            })}
          >
            
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
            

            <button type="submit" onClick={passwordReset}>
              Reset
            </button>
          </form>
          <p className={styles.createAccount}>
            Want to login? <Link href={`/${locale}/login`}> Login</Link>
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

export default ResetPassword;
