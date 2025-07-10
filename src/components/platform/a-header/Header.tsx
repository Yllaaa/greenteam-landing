/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { FaBars, FaTimes } from "react-icons/fa";
import {
  clearUserLoginData,
  setUserLoginData,
} from "@/store/features/login/userLoginSlice";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getToken, removeToken } from "@/Utils/userToken/LocalToken";
import ProfileMenu from "./profileMenu/ProfileMenu";
import NotificationIcon from "./notifications/NotificationIcon";
import { FaStar } from "react-icons/fa6";
import ChatIcon from "./chatIcon/ChatIcon";
import AddNew from "../addNew/post/AddNew";

function Header() {
  const t = useTranslations("web.header");
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const localS = getToken();
  const [mounted, setMounted] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addPost, setAddPost] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Header visibility states
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // Manage user state
  const user = useAppSelector((state) => state.login.user?.user);

  // Handle scroll behavior for header visibility
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        if (currentScrollY < 5) {
          setShowHeader(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowHeader(false);
        } else if (currentScrollY < lastScrollY) {
          setShowHeader(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      const timeout = setTimeout(controlHeader, 10);
      setScrollTimeout(timeout);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY, scrollTimeout]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    dispatch(clearUserLoginData());
    removeToken();
    localStorage.removeItem("user");
    setMobileMenuOpen(false);
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
          handleLogout();
        });
    }
  }, [userToken, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const dropdownElement = document.querySelector(`.${styles.headerMenu}`);
      if (dropdownElement && !dropdownElement.contains(event.target)) {
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
    setMobileMenuOpen(false);

    if (!addPost) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  };

  const closeModal = () => {
    setAddPost(false);
    document.body.classList.remove('modal-open');
  };

  const handleMenuItemClick = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className={styles.spacer}></div>
      <div
        style={{ zIndex: "9999" }}
        className={`${styles.container} ${!showHeader ? styles.hidden : ''}`}
      >
        <div className={styles.logos}>
          <div className={styles.logoItem}>
            <div data-tour="logo" className={styles.footLogo}>
              <Image
                onClick={() => router.push(`/${locale}/feeds`)}
                src={FootLogo}
                alt="Logo"
                width={60}
                height={60}
              />
            </div>
          </div>

          {windowWidth > 768 && (
            <>
              <div className={styles.logoItem}>
                <div
                  data-tour="community"
                  onClick={() => router.push(`/${locale}/community`)}
                  className={styles.handsLogo}
                >
                  <Image src={handsLogo} alt="community" width={60} height={48} />
                  <p>{t("community")}</p>
                </div>
              </div>

              <div className={styles.logoItem}>
                <div
                  data-tour="favorites"
                  onClick={() => router.push(`/${locale}/favorite`)}
                  className={styles.starFav}
                >
                  <FaStar size={100} color="yellow" />
                  <p>{t("favorites")}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.profile}>
          {windowWidth <= 768 && (
            <div
              className={styles.mobileMenuToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          )}

          <div className={styles.icons}>
            <div
              onClick={handleAddPost}
              className={styles.notification}
              data-tour="add-post"
            >
              <IoIosAddCircle />
            </div>
            <div
              className={styles.notification}
              data-tour="notifications"
            >
              <NotificationIcon />
            </div>
            <div
              className={styles.notification}
              data-tour="chat"
            >
              <ChatIcon />
            </div>
          </div>

          <div
            className={`${styles.headerMenu} ${isDropdownOpen ? styles.open : ""}`}
            data-tour="profile"
          >
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={styles.profileIcon}
            >
              <div className={styles.userProfile}>
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
                className={`${styles.arrow} ${isDropdownOpen ? styles.arrowOpened : styles.arrowClosed
                  }`}
              >
                <Image src={drop} alt="arrow" />
              </div>
            </div>
            {user && (
              <ProfileMenu
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                handleLogout={handleLogout}
                user={user}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && windowWidth <= 768 && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuContent}>
            <div
              className={styles.mobileMenuItem}
              onClick={() => handleMenuItemClick(`/${locale}/community`)}
            >
              <Image src={handsLogo} alt="community" width={24} height={24} />
              <p>{t("community")}</p>
            </div>
            <div
              className={styles.mobileMenuItem}
              onClick={() => handleMenuItemClick(`/${locale}/favorite`)}
            >
              <FaStar size={24} color="yellow" />
              <p>{t("favorites")}</p>
            </div>
            <div
              className={styles.mobileMenuItem}
              onClick={handleAddPost}
            >
              <IoIosAddCircle size={24} />
              <p>{t("addPost")}</p>
            </div>
            <div
              className={styles.mobileMenuItem}
              onClick={handleLogout}
            >
              <span className={styles.logoutIcon}>🚪</span>
              <p>{t("logout")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {addPost && (
        <div
          className={modalStyles.modalOverlay}
          onClick={closeModal}
        >
          <div
            className={modalStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={modalStyles.closeButton}
              onClick={closeModal}
            >
              &times;
            </button>
            <AddNew setAddPost={setAddPost} />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;