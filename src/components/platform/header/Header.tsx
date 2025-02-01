"use client";
import React, { useCallback, useRef, useState } from "react";
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
import { IoIosArrowDown } from "react-icons/io";

function Header() {
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
            <Image src={footLogo} alt="footLogo" />
          </div>
          <div className={styles.profile}>
            <div className={styles.search}>
              <FaSearch />
              <input type="text" placeholder="Search" />
            </div>
            <div className={styles.profileIcon}>
              <div className={styles.avatar}></div>
              <div className={styles.data}>
                <div className={styles.name}>
                  <h5>name surname</h5>
                </div>

                <div className={styles.username}>
                  <h5>@username</h5>
                </div>
              </div>
            </div>
          </div>
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
              <Image src={post} alt="like" />
            </Link>
          </div>
          <div className={styles.link}>
            <Link href="/">
              <span>Add new post</span>
              <Image src={addNew} alt="like" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;


