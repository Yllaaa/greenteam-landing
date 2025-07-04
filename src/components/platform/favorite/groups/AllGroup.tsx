"use client";
import React from "react";
import styles from "./allGroups.module.scss";
import groups from "@/../public/icons/groups.svg";
import Image from "next/image";
import Groups from "./groups/Groups";
import FeedSection from "./feeds/FeedSection";
import { useTranslations } from "next-intl";
function AllGroup() {
  const [selected, setSelected] = React.useState("last posts");
const t = useTranslations("web.favourite.friends");
  return (
    <>
      <div className={styles.allGroup}>
        <div className={styles.allGroupHeader}>
          <div className={styles.icon}>
            <Image src={groups} alt="pages" width={28} height={28} />
          </div>
          <div className={styles.titles}>
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("last posts")}
              className={`${styles.title} ${
                selected === "last posts" ? styles.active : styles.notActive
              }`}
            >
              {t("lastPosts")}
            </h6>
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("groups")}
              className={`${styles.title} ${
                selected === "groups" ? styles.active : styles.notActive
              }`}
            >
              {t("groups")}
            </h6>
          </div>
        </div>
        <div className={styles.body}>
          {selected === "last posts" ? <FeedSection /> : <Groups />}
        </div>
      </div>
    </>
  );
}

export default AllGroup;
