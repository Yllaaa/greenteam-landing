/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./header.module.css";
import Image from "next/image";

import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import handsLogo from "@/../public/ZPLATFORM/header/handsLogo.svg";
import footLogo from "@/../public/ZPLATFORM/header/foot.svg";
import likes from "@/../public/ZPLATFORM/header/like.svg";
import post from "@/../public/ZPLATFORM/header/posts.svg";
import message from "@/../public/ZPLATFORM/header/message.svg";
import addNew from "@/../public/ZPLATFORM/header/addNew.svg";
import noUserPic from "@/../public/auth/user.png";
import { IoIosArrowDown } from "react-icons/io";
// import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ScreenBreakpoints } from "@/Utils/screenBreakPoints/ScreenBreakPoints";
import axios from "axios";
import { useAppDispatch } from "@/store/hooks";
import { setUserLoginData } from "@/store/features/login/userLoginSlice";

function Header() {
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  // handle state if not logged in
  const [userToken, setUserToken] = useState("");
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const userInfo1 = localStorage?.getItem("user");
      const userInfo = JSON.parse(userInfo1!);
      setUserToken(userInfo.accessToken);
    }
  }, []);
  // handle state if logged in
  useEffect(() => {
    // console.log(userToken);
    if (userToken !== "") {
      console.log(userToken);
      
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          dispatch(setUserLoginData(res.data));
        })
        .catch((err) => console.log(err));
    }
  }, [userToken]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const [isOpen, setIsOpen] = useState(false);

  const menuRefResponsive = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    console.log("clicked");
  };
  const handleClickOutsideMenu = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, [handleClickOutsideMenu]);

  const { isMobile } = ScreenBreakpoints();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.dropdown}>
          <div
            onClick={toggleDropdown}
            ref={menuRef}
            className={styles.dropmenu}
          >
            <h3 style={isDropdownOpen ? { color: "red" } : {}}>
              Menu <IoIosArrowDown />
            </h3>
          </div>

          {isDropdownOpen && (
            <ul style={{ zIndex: "100" }} className={styles.list}>
              <li>
                <Link href="#">Home</Link>
              </li>
              <li>
                <Link href="#">Profile</Link>
              </li>
              <li>
                <Link href="#">About</Link>
              </li>
            </ul>
          )}
        </div>
        <div className={styles.top}>
          <div className={styles.logo}>
            <Image src={handsLogo} alt="handsLogo" />
          </div>
          <div className={styles.footLogo}>
            <Image
              onClick={() => router.push(`/${locale}/feeds`)}
              style={{ cursor: "pointer" }}
              src={footLogo}
              alt="footLogo"
            />
          </div>
          <div className={styles.profile}>
            <div className={styles.search}>
              <FaSearch />
              <input type="text" placeholder="Search" />
            </div>
            <div className={styles.profileIcon}>
              <div className={styles.avatar}>
                {
                  // userInfo().user?.avatar ? (
                  //   <Image
                  //     src={userInfo().user?.avatar}
                  //     alt="profile"
                  //     width={30}
                  //     height={30}
                  //   />
                  // ) :
                  <Image src={noUserPic} alt="profile" width={30} height={30} />
                }
              </div>
              <div className={styles.data}>
                <div className={styles.name}>
                  <h5>
                    {
                      // userInfo().user ? userInfo().user?.fullName :
                      "testing"
                    }
                  </h5>
                </div>

                <div className={styles.username}>
                  <h5>
                    @
                    {
                      // userInfo().user ? userInfo().user?.username :
                      "testing"
                    }
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ zIndex: "10000", display: isOpen ? "none" : "" }}
            className={styles.navbarResponsive}
            onClick={toggleMenu}
            // style={{}}
          >
            <svg
              width="20"
              height="15"
              viewBox="0 0 20 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.527344 0.0595704C0.199219 0.180664 0 0.481445 0 0.856445C0 1.24707 0.226562 1.56348 0.582031 1.67285C0.796875 1.73535 19.2031 1.73535 19.418 1.67285C19.7734 1.56348 20 1.24707 20 0.856445C20 0.473633 19.8008 0.176758 19.457 0.0556642C19.3047 0.00488293 18.2617 -0.00292957 9.98438 0.000976682C1.95312 0.000976682 0.664062 0.00878918 0.527344 0.0595704Z"
                fill="#97b00f"
              />
              <path
                d="M0.425781 6.49316C0.332031 6.54395 0.203125 6.66113 0.136719 6.75098C0.0273438 6.90332 0.0195312 6.94629 0.0195312 7.24316C0.0195312 7.54004 0.0273438 7.58301 0.136719 7.73535C0.203125 7.8252 0.332031 7.94238 0.425781 7.99316L0.597656 8.08301H10H19.4023L19.5742 7.99316C19.668 7.94238 19.8008 7.8252 19.8633 7.73535C19.9727 7.58301 19.9805 7.54004 19.9805 7.24316C19.9805 6.94629 19.9727 6.90332 19.8633 6.75098C19.8008 6.66113 19.668 6.54395 19.5742 6.49316L19.4023 6.40332H10H0.597656L0.425781 6.49316Z"
                fill="#4f8f92"
              />
              <path
                d="M0.574219 12.8213C0.21875 12.9346 0 13.2393 0 13.6299C0 14.0166 0.238281 14.3525 0.574219 14.4463C0.78125 14.5049 19.2188 14.5049 19.4258 14.4463C19.7617 14.3525 20 14.0166 20 13.6299C20 13.2275 19.7617 12.9072 19.3906 12.8135C19.1406 12.751 0.777344 12.7588 0.574219 12.8213Z"
                fill="#2c3e50"
              />
            </svg>
          </div>
          {mounted && isMobile && (
            <div
              className={`${styles.menuContainer} ${isOpen ? styles.open : ""}`}
              ref={menuRefResponsive}
              style={{ zIndex: "101" }}
            >
              <div
                style={{ zIndex: "100" }}
                className={styles.navbarResponsiveClose}
                onClick={toggleMenu}
              >
                <svg
                  width="20"
                  height="15"
                  viewBox="0 0 20 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.527344 0.0595704C0.199219 0.180664 0 0.481445 0 0.856445C0 1.24707 0.226562 1.56348 0.582031 1.67285C0.796875 1.73535 19.2031 1.73535 19.418 1.67285C19.7734 1.56348 20 1.24707 20 0.856445C20 0.473633 19.8008 0.176758 19.457 0.0556642C19.3047 0.00488293 18.2617 -0.00292957 9.98438 0.000976682C1.95312 0.000976682 0.664062 0.00878918 0.527344 0.0595704Z"
                    fill="#97b00f"
                  />
                  <path
                    d="M0.425781 6.49316C0.332031 6.54395 0.203125 6.66113 0.136719 6.75098C0.0273438 6.90332 0.0195312 6.94629 0.0195312 7.24316C0.0195312 7.54004 0.0273438 7.58301 0.136719 7.73535C0.203125 7.8252 0.332031 7.94238 0.425781 7.99316L0.597656 8.08301H10H19.4023L19.5742 7.99316C19.668 7.94238 19.8008 7.8252 19.8633 7.73535C19.9727 7.58301 19.9805 7.54004 19.9805 7.24316C19.9805 6.94629 19.9727 6.90332 19.8633 6.75098C19.8008 6.66113 19.668 6.54395 19.5742 6.49316L19.4023 6.40332H10H0.597656L0.425781 6.49316Z"
                    fill="#4f8f92"
                  />
                  <path
                    d="M0.574219 12.8213C0.21875 12.9346 0 13.2393 0 13.6299C0 14.0166 0.238281 14.3525 0.574219 14.4463C0.78125 14.5049 19.2188 14.5049 19.4258 14.4463C19.7617 14.3525 20 14.0166 20 13.6299C20 13.2275 19.7617 12.9072 19.3906 12.8135C19.1406 12.751 0.777344 12.7588 0.574219 12.8213Z"
                    fill="#2c3e50"
                  />
                </svg>
              </div>
              {/* <ul>
                <li className={`${styles.item}`}>Download the app</li>
                <li className={`${styles.item}`}>
                  <div className={styles.data}>
                    <div className={styles.name}>
                      <h5>{userInfo().user?.fullName}</h5>
                    </div>

                    <div className={styles.username}>
                      <h5>@{userInfo().user?.username}</h5>
                    </div>
                  </div>
                </li>
              </ul> */}
            </div>
          )}
        </div>
        <div className={styles.bottom}>
          <div className={styles.link}>
            <Link href="/">
              <span>125 likes</span>
              <Image src={likes} alt="like" />
            </Link>
          </div>
          <div className={styles.link}>
            <Link href="/">
              <span>125 message</span>
              <Image src={message} alt="like" />
            </Link>
          </div>
          <div className={styles.link}>
            <Link href="/">
              <span>125 posts</span>
              <Image src={post} alt="posts" />
            </Link>
          </div>
          <div className={styles.link}>
            <Link href={`/${locale}/personal/newPost`}>
              <span>Add post</span>
              <Image src={addNew} alt="add" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
