"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Item from "./Item";
import { PageItem } from "./pages.data";
import styles from "./pages.module.scss";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import Header from "../header/Header";
import { useAppSelector } from "@/store/hooks";
// import LongItem from "./LongItem";
import AddNewPage from "./AddPage/AddNewPage";
import DeleteModal from "./deleteModal/DeleteModal";
import Report from "./reportModal/Report";

export default function Pages() {
  const city = useAppSelector(
    (state) => state.currentCommunity.selectedCity
  )?.toString();
  const country = useAppSelector(
    (state) => state.currentCommunity.selectedCountry
  )?.toString();
  const [pagesArray, setPagesArray] = useState<PageItem[]>([]);
  // pagination
  const limit = 5;
  const [addNew, setAddNew] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [endOfResults, setEndOfResults] = useState(false);
const [deleteModal, setDeleteModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
const [postId, setPostId] = useState<string>("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Get token only once
  const localeS = useRef(getToken());
  const accessToken = localeS.current ? localeS.current.accessToken : null;

  const fetchPages = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        const countryParam =
          country !== "" && country ? `&countryId=${country}` : "";
        const cityParam = city !== "" && city ? `&cityId=${city}` : "";
        // Use different loading state for initial vs pagination loading
        if (replace) {
          setIsLoading(true);
          setEndOfResults(false);
        } else {
          setIsPaginationLoading(true);
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/community/pages?limit=${limit}&page=${pageNum}${countryParam}${cityParam}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

        const data = response.data;

        // Check if we've reached the end of available pagesArray
        if (data.length < limit) {
          setHasMore(false);
          if (data.length === 0 && pageNum > 1) {
            setEndOfResults(true);
          }
        } else {
          setHasMore(true);
        }

        setPagesArray((prev) => {
          if (replace) {
            return data;
          }
          return [...prev, ...data];
        });

        return data;
      } catch (error) {
        console.error("Failed to fetch forums:", error);
        setErrorMessage("An Error Occurred");
        throw error;
      } finally {
        setIsLoading(false);
        setIsPaginationLoading(false);
      }
    },
    [accessToken, city, country]
  );

  // Initial load
  useEffect(() => {
    fetchPages(1, true);
  }, [fetchPages]);

  // Reset and refetch when city or country changes
  useEffect(() => {
    // Reset pagination state
    setPage(1);
    setHasMore(true);
    setEndOfResults(false);
    setErrorMessage("");

    // Fetch new data with the updated location
    fetchPages(1, true);
  }, [city, country, fetchPages]);

  // Load more pages when page changes
  useEffect(() => {
    // Skip the initial page load since we handle that separately
    if (page > 1 && !isLoading) {
      fetchPages(page, false);
    }
  }, [page, fetchPages, isLoading]);

  // Scroll event handler for infinite scrolling and scroll button state
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading || isPaginationLoading)
      return;

    const container = bodyRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Update scroll button states
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);

    // Load more when user has scrolled to 80% of the content
    if (
      scrollLeft + clientWidth >= scrollWidth * 0.8 &&
      !isPaginationLoading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoading, isPaginationLoading]);

  // Add scroll event listener
  useEffect(() => {
    const currentRef = bodyRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);

      // Initial scroll state check
      const scrollWidth = currentRef.scrollWidth;
      const clientWidth = currentRef.clientWidth;
      setCanScrollRight(scrollWidth > clientWidth);

      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  // Manual scroll handlers for arrow buttons
  const handleManualScroll = (direction: "left" | "right") => {
    if (!bodyRef.current) return;

    bodyRef.current.scrollBy({
      left: direction === "left" ? -300 : +300,
      behavior: "smooth",
    });
  };

  // Render content based on state
  const renderContent = () => {
    if (isLoading && pagesArray.length === 0) {
      return (
        <div className={styles.emptyField}>
          <LoadingTree />
        </div>
      );
    }

    if (errorMessage && pagesArray.length === 0) {
      return (
        <div className={styles.emptyField}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (pagesArray.length === 0) {
      return (
        <div className={styles.emptyField}>
          <p>No posts found</p>
        </div>
      );
    }

    return (
      <>
        <div className={styles.pagesContainer}>
          <div className={styles.pagesR}>
            {pagesArray.map((pageI, index) => (
              <Item
                key={pageI.id || index} 
                pageI={pageI}
                page={page}
                setPage={setPage}
                index={index}
                length={pagesArray.length}
                setPostId={setPostId}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                reportModal={reportModal}
                setReportModal={setReportModal}
              />
            ))}
          </div>
          {/* <div className={styles.pagesL}>
            {pagesArray.map((pageI, index) => (
              <LongItem
                key={pageI.id || index} 
                pageI={pageI}
                page={page}
                setPage={setPage}
                index={index}
                length={pagesArray.length}
              />
            ))}
          </div> */}

          {/* Scroll navigation buttons */}
          <div className={styles.scrollControls}>
            <button
              onClick={() => handleManualScroll("left")}
              disabled={!canScrollLeft}
              className={`${styles.scrollButton} ${
                canScrollLeft ? styles.active : ""
              }`}
              aria-label="Scroll left"
            >
              &larr;
            </button>
            <button
              onClick={() => handleManualScroll("right")}
              disabled={!canScrollRight}
              className={`${styles.scrollButton} ${
                canScrollRight ? styles.active : ""
              }`}
              aria-label="Scroll right"
            >
              &rarr;
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Header
        tag="Pages"
        setPage={setPage}
        path={"Create new page"}
        withFilter={false}
        setAddNew={setAddNew}
      >
        <div ref={bodyRef} className={styles.content}>
          {renderContent()}
          {/* {isPaginationLoading && <div className={styles.paginationLoader}><LoadingTree /></div>} */}
          {endOfResults && (
            <p style={{ display: "none" }} className={styles.endMessage}>
              End of results
            </p>
          )}
        </div>
      </Header>
      {addNew && <AddNewPage setAddNew={setAddNew} />}
      {deleteModal && (
        <DeleteModal postId={postId} setDoItModal={setDeleteModal} />
      )}
      {reportModal && (
        <Report report={reportModal} user="" reportedId={postId} setReport={setReportModal} reportedType="page" />
      )}
    </>
  );
}
