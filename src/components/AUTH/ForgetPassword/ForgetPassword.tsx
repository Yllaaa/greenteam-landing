"use client";

import styles from "./forgetPassword.module.css";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import Link from "next/link";
import Image from "next/image";
import footLogo from "@/../public/logo/foot.png";
import bgImage from "@/../public/auth/dots.png";
import earthImage from "@/../public/auth/earth.svg";
function ForgetPassword() {
  const router = useRouter();
  const locale = useLocale();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{
    email: string;
  }>();
  const [data, setData] = useState<
    | {
        email: string;
      }
    | FieldValues
  >({ email: "" });

  const forgetPassword = () => {
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/auth/forgot-password`, {
          email: data.email,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
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
              <h5>Forget Password</h5>
              <p>Write Your Email To Recover Your Password</p>
            </div>
          </div>
          <form
            className={styles.form}
            onSubmit={handleSubmit((data) => {
              setData(data);
            })}
          >
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

            <button type="submit" onClick={forgetPassword}>
              Rest Password
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
      </div>{" "}
    </>
  );
}

export default ForgetPassword;
