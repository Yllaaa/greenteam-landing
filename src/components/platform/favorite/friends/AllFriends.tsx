"use client";
import React from "react";
import styles from "./allFriends.module.scss";
import friends from "@/../public/icons/friends.svg";
import Image from "next/image";
import FeedSection from "./friend/feeds/FeedSection";
import FeedSectionF from "./last/feeds/FeedSection";
import { useTranslations } from "next-intl";
function AllFriends() {
  const [selected, setSelected] = React.useState("last posts");
  const t = useTranslations("web.favourite.friends");
  return (
    <>
      <div className={styles.allFriends}>
        <div className={styles.allFriendsHeader}>
          <div className={styles.icon}>
            <Image src={friends} alt="pages" width={32} height={32} />
          </div>
          <div className={styles.titles}>
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("last posts")}
              className={`${styles.title} ${selected === "last posts" ? styles.active : styles.notActive
                }`}
            >
              {t("lastPosts")}
            </h6>
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("friends")}
              className={`${styles.title} ${selected === "friends" ? styles.active : styles.notActive
                }`}
            >
              {t("friends")}
            </h6>
          </div>
        </div>
        <div className={styles.body}>
          {selected === "last posts" ? <FeedSection /> : <FeedSectionF />}
        </div>
      </div>
    </>
  );
}

export default AllFriends;
