"use client";
import React from "react";
import styles from "./header.module.scss";
import Image from "next/image";
import image from "@/../public/ZPLATFORM/A-Header/FootLogo.png";
import add from "@/../public/icons/add.svg";

function Header({
  children,
  tag,
  path,
  setSection,
  withFilter,
  section,
  setPage,
  setAddNew,
}: {
  children: React.ReactNode;
  tag?: string;
  path?: string | boolean;
  image?: string;
  withFilter: boolean;
  section?: string;
  setSection?: React.Dispatch<React.SetStateAction<string>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  setAddNew?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.tag}>
          <Image src={image} alt="tag" width={30} height={30} />
          <h1>{tag}</h1>
        </div>
        {withFilter && (
          <div className={styles.filterSection}>
            <ul>
              <li
                style={
                  section === "all"
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() => {
                  if (setPage && setSection) {
                    setPage(1);
                    setSection("all");
                  }
                }}
              >
                all
              </li>
              <li
                style={
                  section === "social"
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() => {
                  if (setPage && setSection) {
                    setPage(1);
                    setSection("social");
                  }
                }}
              >
                social
              </li>
              <li
                style={
                  section === "volunteering%26work"
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() => {
                  if (setPage && setSection) {
                    setPage(1);
                    setSection("volunteering%26work");
                  }
                }}
              >
                volunteering & work
              </li>
              <li
                style={
                  section === "talks%26workshops"
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() => {
                  if (setPage && setSection) {
                    setPage(1);
                    setSection("talks%26workshops");
                  }
                }}
              >
                talks & workshops
              </li>
            </ul>
          </div>
        )}
        <div
          onClick={() => {
            if (setAddNew) setAddNew(true);
          }}
          className={styles.path}
        >
          <Image src={add} alt="tag" />
          <p>{path}</p>
        </div>
      </div>
      <div className={styles.children}>{children}</div>
      <div></div>
    </>
  );
}

export default Header;
