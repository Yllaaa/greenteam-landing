"use client";
import React from "react";
import styles from "./allPage.module.scss";
import pages from "@/../public/icons/pages.svg";
import Image from "next/image";
import Pages from "./pages/Pages";
import FeedSection from "./feeds/FeedSection";
function AllPage() {
  const [selected, setSelected] = React.useState("last posts");

  return (
    <>
      <div className={styles.allPage}>
        <div className={styles.allPageHeader}>
          <div className={styles.icon}>
            <Image src={pages} alt="pages" width={28} height={28} />
          </div>
          <div className={styles.titles}>
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("last posts")}
              className={`${styles.title} ${
                selected === "last posts" ? styles.active : styles.notActive
              }`}
            >
              Last Posts
            </h6>
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("pages")}
              className={`${styles.title} ${
                selected === "pages" ? styles.active : styles.notActive
              }`}
            >
              Pages
            </h6>
          </div>
        </div>
        <div className={styles.body}>
          {selected === "last posts" ? <FeedSection /> : <Pages />}
        </div>
      </div>
    </>
  );
}

export default AllPage;
