"use client";
import Image from "next/image";
import { PageItem } from "./pages.data";
import styles from "./pages.module.scss";
import logo from "@/../public/personal/menu/pages/logo.svg";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useRef } from "react";

export default function Item({
  pageI,
  page,
  setPage,
  length,
  index,

}: {
  pageI: PageItem;
  page: number;
  setPage: (page: number) => void;
  length: number;
  index: number;
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  reportModal: boolean;
  setReportModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const router = useRouter();
  const locale = useLocale();


  // Track if pagination has already been triggered
  const hasPaginatedRef = useRef(false);

  const handleNavigate = () => {
    router.push(`/${locale}/pages/${pageI.slug}`);
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true, // Only trigger once when coming into view
  });

  const handlePages = useCallback(() => {
    // Only paginate if we haven't already and we're not on the first page load
    if (!hasPaginatedRef.current && length >= 5) {
      hasPaginatedRef.current = true;
      setPage(page + 1);
    }
  }, [length, page, setPage]);

  useEffect(() => {
    // Only trigger pagination if this is the last item and it's in view
    if (inView && index === length - 1) {
      handlePages();
    }
  }, [handlePages, inView, index, length]);
  const t = useTranslations("web.pages");
  return (
    <div ref={index === length - 1 ? ref : null} className={styles.item}>

      <div className={styles.header}>
        <div className={styles.logo}>
          <Image unoptimized src={pageI.avatar ? pageI.avatar : logo} alt={pageI.name} width={100} height={100} />
        </div>
        <div className={styles.ecoVillage}>{pageI.topic.name}</div>
      </div>
      <div className={styles.content}>
        <div onClick={handleNavigate} className={styles.text}>
          <div className={styles.title}>{pageI.name}</div>
        </div>
        <div onClick={handleNavigate} className={styles.description}>
          <div className={styles.headerWhy}>
            <span>{t("why")}: </span>
            {pageI.why.length > 72 ? `${pageI.why.slice(0, 72)}...` : pageI.why}
          </div>
          <div className={styles.headerHow}>
            <span>{t("how")}: </span>
            {pageI.how.length > 72 ? `${pageI.how.slice(0, 72)}...` : pageI.how}
          </div>
          <div className={styles.headerWhat}>
            <span>{t("what")}: </span>
            {pageI.what.length > 72
              ? `${pageI.what.slice(0, 72)}...`
              : pageI.what}
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.counts}>
            <div className={styles.followers}>
              {pageI.followersCount} {t("followers")}
            </div>
          </div>
          <button onClick={handleNavigate} className={styles.like}>{t("visit")}</button>
        </div>
      </div>
    </div>
  );
}