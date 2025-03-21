/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import Image from "next/image";
import handsLogo from "@/../public/ZPLATFORM/A-Header/HandLogo.svg";
import FootLogo from "@/../public/ZPLATFORM/A-Header/FootLogo.png";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import chat from "@/../public/ZPLATFORM/A-Header/navIcons/chat.svg";
import challenges from "@/../public/ZPLATFORM/A-Header/navIcons/challenges.svg";
import community from "@/../public/ZPLATFORM/A-Header/navIcons/community.svg";
import plans from "@/../public/ZPLATFORM/A-Header/navIcons/plans.svg";
import settings from "@/../public/ZPLATFORM/A-Header/navIcons/settings.svg";
import logout from "@/../public/ZPLATFORM/A-Header/navIcons/logout.svg";
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

import Link from "next/link";

function Header() {
  // constants
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const localS = getToken();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const user = localStorage.getItem("user") ? localS : null;
      if (!user) {
        router.push(`/${locale}`);
      }
    }
  }, [mounted]);
  useEffect(() => {
    if (mounted) {
      if (!localS) {
        // Clear user data from Redux store
        dispatch(clearUserLoginData());

        // Remove token from localStorage
        removeToken();

        // Clear any other user-related data
        localStorage.removeItem("user");

        // Redirect to /locale route
        router.push(`/${locale}`);
      }
    }
  }, [mounted]);
  // handle state if not logged in
  const [userToken, setUserToken] = useState("");
  useEffect(() => {
    const accessToken = localS ? localS.accessToken : null;
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownList = [
    {
      id: 1,
      name: "Chat",
      icon: chat,
      link: `/${locale}/chat`,
    },
    {
      id: 2,
      name: "Community",
      icon: community,
      link: `/${locale}/community`,
    },
    {
      id: 3,
      name: "Challenges",
      icon: challenges,
      link: `/${locale}/challenges`,
    },
    {
      id: 4,
      name: "Plans",
      icon: plans,
      link: `/${locale}/payment`,
    },

    {
      id: 5,
      name: "Settings",
      icon: settings,
      link: `/${locale}/settings`,
    },
  ];

  const handleLogout = () => {
    if (localS) {
      // Clear user data from Redux store
      dispatch(clearUserLoginData());

      // Remove token from localStorage
      removeToken();

      // Clear any other user-related data
      localStorage.removeItem("user");

      // Redirect to /locale route
      router.push(`/${locale}`);
    }
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
          <div className={`${styles.headerMenu}`}>
            <div
              onClick={() => !isDropdownOpen && setIsDropdownOpen(true)}
              className={styles.profileIcon}
            >
              <div
                onClick={() =>
                  isDropdownOpen && router.push(`/${locale}/profile`)
                }
                className={styles.userProfile}
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
                onClick={() => isDropdownOpen && setIsDropdownOpen(false)}
                className={`${styles.arrow} ${
                  isDropdownOpen && styles.arrowOpened
                }`}
              >
                <Image src={drop} alt="arrow" />
              </div>
            </div>
            {isDropdownOpen && (
              <div
                style={{ transition: "all 0.3s ease-in-out" }}
                className={styles.dropdown}
              >
                <ul>
                  {dropdownList.map((item) => (
                    <li
                      onClick={() => {
                        setIsDropdownOpen(false);
                      }}
                      className={styles.dropdownItem}
                      key={item.id}
                    >
                      <Image src={item.icon} alt={item.name} />
                      <Link href={item.link}>{item.name}</Link>
                    </li>
                  ))}
                  <li
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className={styles.logout}
                  >
                    <Image src={logout} alt="logout" />
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
