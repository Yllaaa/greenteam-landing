/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./header.module.css";
import Image from "next/image";
import handsLogo from "@/../public/ZPLATFORM/A-Header/HandLogo.svg";
import FootLogo from "@/../public/ZPLATFORM/A-Header/FootLogo.png";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import drop from "@/../public/ZPLATFORM/A-Header/navIcons/dropArrow.svg";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  clearUserLoginData,
  setUserLoginData,
} from "@/store/features/login/userLoginSlice";
import { useRouter } from "next/navigation";

import { useLocale } from "next-intl";
import { getToken, removeToken } from "@/Utils/userToken/LocalToken";
import ProfileMenu from "./profileMenu/ProfileMenu";

function Header() {
  // constants
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const localS = getToken();
  const [mounted, setMounted] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mounted effect
  useEffect(() => {
    if (localS !== "") {
      setMounted(true);
    } else {
      router.push(`/${locale}`);
    }
  }, []);

  // Logout handler
  const handleLogout = useCallback(() => {
    // Clear user data from Redux store
    dispatch(clearUserLoginData());

    // Remove token from localStorage
    removeToken();

    // Clear any other user-related data
    localStorage.removeItem("user");

    // Redirect to /locale route
    router.replace(`/${locale}`);
  }, [dispatch, router, locale]);

  // Authentication check effects
  useEffect(() => {
    if (mounted) {
      const user = localStorage.getItem("user") ? localS : null;
      if (!user) {
        router.replace(`/${locale}`);
      }
    }
  }, [mounted, handleLogout]);

  // Token and user data effect
  useEffect(() => {
    const accessToken = localS ? localS.accessToken : null;
    setUserToken(accessToken || "");
  }, [localS]);

  // Fetch user data effect
  useEffect(() => {
    if (userToken) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            // withCredentials: true,
          },
        })
        .then((res) => {
          const user = {
            loggedIn: !!userToken,
            accessToken: userToken,
            user: res.data,
          };
          dispatch(setUserLoginData(user));
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          // Logout user if token is invalid
          handleLogout();
        });
    }
  }, [userToken, dispatch]);

  // Manage user state
  const user = useAppSelector((state) => state.login.user?.user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.querySelector(`.${styles.headerMenu}`);
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <div
            className={`${styles.headerMenu} ${
              isDropdownOpen ? styles.open : ""
            }`}
          >
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={styles.profileIcon}
            >
              <div
                onClick={() =>
                  isDropdownOpen && router.push(`/${locale}/profile`)
                }
                className={styles.userProfile}
              >
                <div className={styles.avatar}>
                  {user && user?.avatar !==null ? (
                    <Image
                      src={user?.avatar}
                      alt={`${user.fullName}`}
                      width={30}
                      height={30}
                    />
                  ) : (
                    <Image
                      src={noAvatar}
                      alt="profile"
                      width={30}
                      height={30}
                    />
                  )}
                </div>
                <div className={styles.userData}>
                  <div className={styles.name}>
                    <h5>
                      {user && user?.fullName ? user?.fullName : "username"}
                    </h5>
                  </div>

                  <div className={styles.username}>
                    <h5>
                      @{user && user?.username ? user?.username : "username"}
                    </h5>
                  </div>
                </div>
              </div>
              <div
                className={`${styles.arrow} ${
                  isDropdownOpen ? styles.arrowOpened : styles.arrowClosed
                }`}
              >
                <Image src={drop} alt="arrow" />
              </div>
            </div>

            <ProfileMenu
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
