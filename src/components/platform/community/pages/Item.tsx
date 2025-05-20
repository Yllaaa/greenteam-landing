"use client";
import Image from "next/image";
import { PageItem } from "./pages.data";
import styles from "./pages.module.scss";
import logo from "@/../public/personal/menu/pages/logo.svg";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineReportProblem } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { PiDotsThreeCircleLight } from "react-icons/pi";

export default function Item({
  pageI,
  page,
  setPage,
  length,
  index,
  deleteModal,
  setDeleteModal,
  reportModal,
  setReportModal,
  setPostId,
}: {
  pageI: PageItem;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
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
  const [activeOptionsPost, setActiveOptionsPost] = useState<string | null>(
    null
  );

  const optionsMenuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the options menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setActiveOptionsPost(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle options menu for a specific post
  const toggleOptionsMenu = useCallback((postId: string) => {
    setActiveOptionsPost((prev) => (prev === postId ? null : postId));
  }, []);

  // Handle delete or report action
  const handleActionDelete = useCallback(
    (postId: string) => {
      if (setDeleteModal && setPostId) {
        setPostId(postId);
        setDeleteModal(!deleteModal);
      }
      setActiveOptionsPost(null); // Close the menu after action
    },
    [deleteModal, setDeleteModal, setPostId]
  );
  // Handle delete or report action
  const handleActionReport = useCallback(
    (postId: string) => {
      if (setReportModal && setPostId) {
        setPostId(postId);
        setReportModal(!reportModal);
      }
      setActiveOptionsPost(null); // Close the menu after action
    },
    [reportModal, setPostId, setReportModal]
  );


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

  return (
    <div ref={index === length - 1 ? ref : null} className={styles.item}>
      <div className={styles.options}>
        <div
          onClick={() => toggleOptionsMenu(pageI.id)}
          className={styles.optionsIcon}
        >
          <PiDotsThreeCircleLight fill="#006633" />
        </div>

        {activeOptionsPost === pageI.id && (
          <div ref={optionsMenuRef} className={styles.optionsMenu}>
            {pageI.isOwner && (
              <div
                onClick={() => handleActionDelete(pageI.slug)}
                className={styles.optionItem}
              >
                <FaTrash /> <span>Delete Page</span>
              </div>
            )}
            <div
              onClick={() => handleActionReport(pageI.slug)}
              className={styles.optionItem}
            >
              <MdOutlineReportProblem /> <span>Report Page</span>
            </div>
          </div>
        )}
      </div>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image src={logo} alt={pageI.name} />
        </div>
        <div className={styles.ecoVillage}>EcoVillage</div>
      </div>
      <div className={styles.content}>
        <div onClick={handleNavigate} className={styles.text}>
          <div className={styles.title}>{pageI.name}</div>
        </div>
        <div onClick={handleNavigate} className={styles.description}>
          <div className={styles.headerWhy}>
            <span>Why: </span>
            {pageI.why.length > 72 ? `${pageI.why.slice(0, 72)}...` : pageI.why}
          </div>
          <div className={styles.headerHow}>
            <span>How: </span>
            {pageI.how.length > 72 ? `${pageI.how.slice(0, 72)}...` : pageI.how}
          </div>
          <div className={styles.headerWhat}>
            <span>What: </span>
            {pageI.what.length > 72
              ? `${pageI.what.slice(0, 72)}...`
              : pageI.what}
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.counts}>
            <div className={styles.followers}>
              {pageI.followersCount} Followers
            </div>
          </div>
          <button className={styles.like}>Visit</button>
        </div>
      </div>
    </div>
  );
}