/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import Image from "next/image";
import handsLogo from "@/../public/ZPLATFORM/A-Header/HandLogo.svg";
import FootLogo from "@/../public/ZPLATFORM/A-Header/FootLogo.png";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { setUserLoginData } from "@/store/features/login/userLoginSlice";
import { useRouter } from "next/navigation";

import { useLocale } from "next-intl";
import { FaSearch } from "react-icons/fa";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

type searchTypes = {
  search: string;
};
function Header() {
  // constants
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<searchTypes>({
    defaultValues: {
      search: "",
    },
  });

  // handle state if not logged in
  const [userToken, setUserToken] = useState("");
  useEffect(() => {
    const LocaleS = localStorage?.getItem("user");
    const accessToken = LocaleS ? JSON.parse(LocaleS).accessToken : null;
    setUserToken(accessToken);
  }, []);
  // handle state if logged in
  useEffect(() => {
    if (userToken !== "") {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          const user = {
            loggedIn: !!userToken,
            accessToken: userToken,
            user: res.data,
          };
          dispatch(setUserLoginData(user));
        })
        .catch((err) => console.log(err));
    }
  }, [userToken]);

  // manage user state
  const user = useAppSelector((state) => state.login.user?.user);

  // handle search
  const onSubmit = (data: any) => {
    ToastNot(`we are in testing phase your search is: ${data.search}`);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logos}>
          <div className={styles.footLogo}>
            <Image
              onClick={() => router.push(`/${locale}/feeds`)}
              src={FootLogo}
              alt="Logo"
            />
          </div>
          <div className={styles.handsLogo}>
            <Image
              src={handsLogo}
              alt="community"
              onClick={() => router.push(`/${locale}/community`)}
            />
          </div>
        </div>
        <div className={styles.profile}>
          <form className={styles.search} onSubmit={handleSubmit(onSubmit)}>
            <FaSearch onClick={handleSubmit(onSubmit)} />
            <input {...register("search")} type="text" placeholder="Search" />
          </form>

          <div
            onClick={() => router.push(`/${locale}/profile`)}
            className={styles.profileIcon}
          >
            <div className={styles.avatar}>
              {user && user?.avatar ? (
                <Image
                  src={user?.avatar}
                  alt={`${user.fullName}`}
                  width={30}
                  height={30}
                />
              ) : (
                <Image src={noAvatar} alt="profile" width={30} height={30} />
              )}
            </div>
            <div className={styles.userData}>
              <div className={styles.name}>
                <h5>{user && user?.fullName ? user?.fullName : "username"}</h5>
              </div>

              <div className={styles.username}>
                <h5>@{user && user?.username ? user?.username : "username"}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
