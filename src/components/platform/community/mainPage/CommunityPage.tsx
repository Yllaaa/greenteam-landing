/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import styles from "./CommunityPage.module.css";
import { setCurrentCommunity } from "@/store/features/communitySection/currentCommunity";
import { useTranslations } from "use-intl";
function CommunityPage() {
  const t = useTranslations('web.main.community')
  const { currentCommunity: community } = useAppSelector(
    (state) => state.currentCommunity
  );
  const dispatch = useAppDispatch();
  const handleCommunityChange = (community: string | any) => {
    dispatch(setCurrentCommunity(community));
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.filterType}>
          <ul>
            <li
              onClick={() => handleCommunityChange("pages")}
              className={`${community === "pages" ? styles.active : ""} ${
                styles.listItem
              }`}
            >
              {t('pages')}
            </li>
            <li
              onClick={() => handleCommunityChange("groups")}
              className={`${community === "groups" ? styles.active : ""} ${
                styles.listItem
              }`}
            >
              {t('groups')}
            </li>
            <li
              onClick={() => handleCommunityChange("events")}
              className={`${community === "events" ? styles.active : ""} ${
                styles.listItem
              }`}
            >
              {t('events')}
            </li>
            <li
              onClick={() => handleCommunityChange("products")}
              className={`${community === "products" ? styles.active : ""} ${
                styles.listItem
              }`}
            >
              {t('products')}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default CommunityPage;
