/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./header.module.css";
import modalStyles from "./modal.module.css";
import Image from "next/image";
import handsLogo from "@/../public/ZPLATFORM/A-Header/HandLogo.svg";
import FootLogo from "@/../public/ZPLATFORM/A-Header/FootLogo.png";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import drop from "@/../public/ZPLATFORM/A-Header/navIcons/dropArrow.svg";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IoIosAddCircle } from "react-icons/io";
import {
  clearUserLoginData,
  setUserLoginData,
} from "@/store/features/login/userLoginSlice";
import { useRouter } from "next/navigation";

import { useLocale } from "next-intl";
import { getToken, removeToken } from "@/Utils/userToken/LocalToken";
import ProfileMenu from "./profileMenu/ProfileMenu";
import NotificationIcon from "./notifications/NotificationIcon";
import { FaStar } from "react-icons/fa6";
import ChatIcon from "./chatIcon/ChatIcon";
import AddNew from "../addNew/post/AddNew";

function Header() {
  // constants
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const localS = getToken();
  const [mounted, setMounted] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addPost, setAddPost] = useState(false);
  // Scroll handling state
  // const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  // const lastScrollY = useRef(0);
  // const scrollThreshold = 30; // Minimum scroll amount before hiding/showing

  // Manage user state
  const user = useAppSelector((state) => state.login.user?.user);

  // Handle scroll events
  // const handleScroll = useCallback(() => {
  //   const currentScrollY = window.scrollY;

  //   // Only check if we've scrolled more than threshold
  //   if (Math.abs(currentScrollY - lastScrollY.current) > scrollThreshold) {
  //     // Scrolling down - hide header
  //     if (currentScrollY > lastScrollY.current) {
  //       setIsHeaderVisible(false);
  //     }
  //     // Scrolling up - show header
  //     else {
  //       setIsHeaderVisible(true);
  //     }

  //     // Update last scroll position
  //     lastScrollY.current = currentScrollY;
  //   }
  // }, []);

  // Add scroll event listener
  // useEffect(() => {
  //   // Use passive: true for better scroll performance
  //   window.addEventListener("scroll", handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [handleScroll]);

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

  const handleAddPost = () => {
    setAddPost(!addPost);
  }

  // Handle direct navigation to user profile
  // const goToProfile = () => {
  //   if (user?.username) {
  //     router.push(`/${locale}/profile/${user.username}`);
  //   }
  // };

  return (
    <>
      <div className={styles.spacer}></div>
      <div className={`${styles.container} ${styles.headerVisible}`}>
        <div className={styles.logos}>
          <div className={styles.footLogo}>
            <Image
              onClick={() => router.push(`/${locale}/feeds`)}
              src={FootLogo}
              alt="Logo"
            />
          </div>
          <div onClick={() => router.push(`/${locale}/community`)} className={styles.handsLogo}>
            <Image
              src={handsLogo}
              alt="community"
            />
            <p>Community</p>
          </div>
          <div onClick={() => router.push(`/${locale}/favorite`)} className={styles.starFav}>
            <FaStar fill="yellow" />
            <p>Favorite</p>
          </div>
        </div>

        <div className={styles.profile}>
          <div className={styles.icons}>
            <div onClick={handleAddPost} className={styles.notification}>
              <IoIosAddCircle />
            </div>
            <div className={styles.notification}>
              <NotificationIcon />
            </div>
            <div className={styles.notification}>
              <ChatIcon />
            </div>
          </div>
          <div className={`${styles.headerMenu} ${isDropdownOpen ? styles.open : ""}`}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={styles.profileIcon}
            >
              <div
                // onClick={goToProfile}
                className={styles.userProfile}
              >
                <div className={styles.avatar}>
                  {user && user?.avatar !== null ? (
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
              </div>
              <div
                className={`${styles.arrow} ${isDropdownOpen ? styles.arrowOpened : styles.arrowClosed}`}
              >
                <Image src={drop} alt="arrow" />
              </div>
            </div>

            <ProfileMenu
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              handleLogout={handleLogout}
              user={user ?? {}}
            />
          </div>
        </div>
      </div>
      {addPost && (
        <div className={modalStyles.modalOverlay} onClick={() => setAddPost(false)}>
          <div className={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={modalStyles.closeButton}
              onClick={() => setAddPost(false)}
            >
              &times;
            </button>
            <AddNew />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;