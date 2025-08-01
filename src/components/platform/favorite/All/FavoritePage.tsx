"use client";
import React from "react";
import styles from "./favorite.module.scss";
import AllPage from "../pages/AllPage";
import AllGroup from "../groups/AllGroup";
import AllFriends from "../friends/AllFriends";
import EventSection from "../Events/EventSection";
import ProductSection from "../products/ProductSection";
import { useTranslations } from "next-intl";
function FavoritePage() {
  const t = useTranslations("web.favourite");
  return (
    <>
      <div className={styles.favoritePage}>
              <p className={styles.newTitle}>{t('favoriteTitle')}</p>
        <div className={styles.allPages}>
          <AllFriends />
        </div>
        <div className={styles.allPages}>
          <AllPage />
        </div>
        <div className={styles.allPages}>
          <AllGroup />
        </div>
        <div className={styles.allPages}>
          <EventSection />
        </div>
        <div style={{ marginTop: "70px" , marginBottom:"150px"}} className={styles.allPages}>
          <ProductSection />
        </div>
      </div>
    </>
  );
}

export default FavoritePage;
