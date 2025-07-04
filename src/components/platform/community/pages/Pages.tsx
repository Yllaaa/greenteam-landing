"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Item from "./Item";
// import { PageItem } from "./pages.data";
import styles from "./pages.module.scss";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import Header from "../header/Header";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import AddNewPage from "@/components/AA-NEW/MODALS/ADD_PAGE/AddNewPage";
import DeleteModal from "./deleteModal/DeleteModal";
import Report from "./reportModal/Report";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  setPages,
  setLoading,
  setPaginationLoading,
  setHasMore,
  setCurrentPage,
} from '@/store/features/pageFilter/pageFillterSlice';
import { useTranslations, useLocale } from 'next-intl';
import pageLogo from "@/../public/community/page.svg";
export default function Pages() {
  const locale = useLocale()
  const city = useAppSelector(
    (state) => state.currentCommunity.selectedCity
  )?.toString();

  const country = useAppSelector(
    (state) => state.currentCommunity.selectedCountry
  )?.toString();
  const verified = useAppSelector(
    (state) => state.currentCommunity.verificationStatus
  );

  const dispatch = useAppDispatch();

  // Redux state
  const filteredPages = useAppSelector(state => state.pageFilter.filteredPages);
  const isLoading = useAppSelector(state => state.pageFilter.isLoading);
  const isPaginationLoading = useAppSelector(state => state.pageFilter.isPaginationLoading);
  const hasMore = useAppSelector(state => state.pageFilter.hasMore);
  const currentPage = useAppSelector(state => state.pageFilter.currentPage);

  const limit = 5;
  const [addNew, setAddNew] = useState(false);
  const [endOfResults, setEndOfResults] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [postId, setPostId] = useState<string>("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  // const containerRef = useRef<HTMLDivElement>(null);

  // Get token only once
  const localeS = useRef(getToken());
  const accessToken = localeS.current ? localeS.current.accessToken : null;

  // Check scroll position to update navigation button states
  const updateScrollButtonStates = useCallback(() => {
    if (!bodyRef.current) return;

    const container = bodyRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setCanScrollLeft(scrollLeft > 10); // Add a small threshold
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // Add a small threshold
  }, []);

  const fetchPages = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        const countryParam = country !== "" && country ? `&countryId=${country}` : "";
        const cityParam = city !== "" && city ? `&cityId=${city}` : "";
        const verifiedParam = verified !== "all" ? `&verified=true` : '';

        if (replace) {
          dispatch(setLoading(true));
          setEndOfResults(false);
        } else {
          dispatch(setPaginationLoading(true));
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/community/pages?limit=${limit}&page=${pageNum}${countryParam}${cityParam}${verifiedParam}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
              "Accept-Language": `${locale}`
            },
          }
        );

        const data = response.data;

        if (data.length < limit) {
          dispatch(setHasMore(false));
          if (data.length === 0 && pageNum > 1) {
            setEndOfResults(true);
          }
        } else {
          dispatch(setHasMore(true));
        }

        dispatch(setPages({ pages: data, replace }));
        setTimeout(updateScrollButtonStates, 300);

        return data;
      } catch (error) {
        console.error("Failed to fetch forums:", error);
        throw error;
      } finally {
        dispatch(setLoading(false));
        dispatch(setPaginationLoading(false));
      }
    },
    [country, city, verified, accessToken, locale, dispatch, updateScrollButtonStates]
  );


  // Initial load
  useEffect(() => {
    fetchPages(1, true);
  }, [fetchPages]);
  // Reset and refetch when city or country changes
  useEffect(() => {
    dispatch(setCurrentPage(1));
    dispatch(setHasMore(true));
    setEndOfResults(false);
    fetchPages(1, true);
  }, [city, country, fetchPages, dispatch]);


  // Load more pages when page changes
  useEffect(() => {
    if (currentPage > 1 && !isLoading) {
      fetchPages(currentPage, false);
    }
  }, [currentPage, fetchPages, isLoading]);

 

  // Handle scroll event to check if we need to load more and update button states
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading || isPaginationLoading) return;

    const container = bodyRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    updateScrollButtonStates();

    if (
      scrollLeft + clientWidth >= scrollWidth * 0.8 &&
      !isPaginationLoading &&
      hasMore
    ) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  }, [hasMore, isLoading, isPaginationLoading, updateScrollButtonStates, dispatch, currentPage]);


  // Add scroll event listener and check initial scroll states
  useEffect(() => {
    const currentRef = bodyRef.current;
    if (currentRef) {
      // Use proper function reference for event handler
      const scrollHandler = () => handleScroll();
      currentRef.addEventListener("scroll", scrollHandler);

      // Initial button state check
      setTimeout(updateScrollButtonStates, 300); // Longer delay to ensure content is rendered

      return () => {
        if (currentRef) {
          currentRef.removeEventListener("scroll", scrollHandler);
        }
      };
    }
  }, [handleScroll, updateScrollButtonStates]);

  // Recheck scroll button states when pages array changes
  useEffect(() => {
    // Only update after the array has been rendered
    setTimeout(updateScrollButtonStates, 300);
  }, [filteredPages, updateScrollButtonStates]);

  // Scroll handlers for the navigation buttons
  const handleScrollDirection = (direction: "left" | "right") => {
    if (!bodyRef.current) return;

    const container = bodyRef.current;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of visible width

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Update button states after scroll animation
    setTimeout(updateScrollButtonStates, 500);
  };
const t = useTranslations("web.pages")

  return (
    <>
      <Header
        tag={t("page")}
        path={t("addPage")}
        withFilter={false} // Enable filter
        setAddNew={setAddNew}
        image={pageLogo}
      >
        <div className={styles.pagesContainer}>
          {/* Navigation buttons - positioned absolutely, don't scroll with content */}
          <button
            onClick={() => handleScrollDirection("left")}
            disabled={!canScrollLeft}
            className={`${styles.navArrow} ${styles.leftArrow}`}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={() => handleScrollDirection("right")}
            disabled={!canScrollRight}
            className={`${styles.navArrow} ${styles.rightArrow}`}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>

          {/* Scrollable content area */}
          <div ref={bodyRef} className={styles.content}>
            <div className={styles.pagesR}>
              {filteredPages.map((pageI, index) => (
                <Item
                  key={pageI.id || index}
                  pageI={pageI}
                  page={currentPage}
                  setPage={(page) => dispatch(setCurrentPage(page))}
                  index={index}
                  length={filteredPages.length}
                  setPostId={setPostId}
                  deleteModal={deleteModal}
                  setDeleteModal={setDeleteModal}
                  reportModal={reportModal}
                  setReportModal={setReportModal}
                />
              ))}

              {/* Pagination loader or end message placed inline with cards */}
              {isPaginationLoading && (
                <div className={styles.paginationContainer}>
                  <div className={styles.paginationLoader}>
                    <LoadingTree />
                  </div>
                </div>
              )}

              {!isPaginationLoading && endOfResults && filteredPages.length > 0 && (
                <div className={styles.paginationContainer}>
                  <div className={styles.endMessage}>
                    {t("endOfResults")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Header>
      {addNew && <AddNewPage setAddNew={setAddNew} />}
      {deleteModal && (
        <DeleteModal postId={postId} setDoItModal={setDeleteModal} />
      )}
      {reportModal && (
        <Report
          report={reportModal}
          user=""
          reportedId={postId}
          setReport={setReportModal}
          reportedType="page"
        />
      )}
    </>
  );
}