/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Item from "./Item";
import { PageItem } from "./pages.data";
import styles from "./pages.module.scss";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { useAppSelector } from "@/store/hooks";
import { useLocale } from "next-intl";

export default function Pages() {
  const [pagesArray, setPagesArray] = useState<PageItem[]>([]);
  const user = useAppSelector(state => state.login.user?.user);
const locale=useLocale()
  // pagination
  const limit = 5;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [endOfResults, setEndOfResults] = useState(false);

  // Refs for scrolling and navigation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // const [canScrollLeft, setCanScrollLeft] = useState(false);
  // const [canScrollRight, setCanScrollRight] = useState(false);

  // Get token only once
  const localeS = useRef(getToken());
  const accessToken = localeS.current ? localeS.current.accessToken : null;

  // Request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPages = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      // Return early if username is not available
      if (!user?.username) {
        console.log("Username not available yet");
        return;
      }

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        // Use different loading state for initial vs pagination loading
        if (replace) {
          setIsLoading(true);
          setEndOfResults(false);
        } else {
          setIsPaginationLoading(true);
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${user.username}/pages?limit=${limit}&page=${pageNum}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
              "Accept-Language": locale
            },
            signal: abortControllerRef.current.signal
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
      } catch (error: any) {
        // Don't set error message if it was a canceled request
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch pages:", error);
          setErrorMessage(error.response?.data?.message || "An Error Occurred");
        }
      } finally {
        setIsLoading(false);
        setIsPaginationLoading(false);
      }
    },
    [accessToken, user?.username, limit,locale]
  );

  // Reset and fetch when user changes
  useEffect(() => {
    const initialFetch = async () => {
      if (user?.username) {
        // Reset pagination state
        setPage(1);
        setHasMore(true);
        setEndOfResults(false);
        setErrorMessage("");

        // Fetch first page
        await fetchPages(1, true);
      }
    };

    initialFetch();

    // Cleanup function to cancel any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchPages, user?.username]);

  // Load more pages when page changes
  useEffect(() => {
    // Skip the initial page load since we handle that separately
    if (page > 1 && !isLoading) {
      fetchPages(page, false);
    }
  }, [page, fetchPages, isLoading]);

  // Function to update scroll button states
  // const updateScrollButtonsState = useCallback(() => {
  //   if (!scrollContainerRef.current) return;

  //   const container = scrollContainerRef.current;
  //   const scrollLeft = container.scrollLeft;
  //   const scrollWidth = container.scrollWidth;
  //   const clientWidth = container.clientWidth;

  //   // A small threshold to ensure the left button appears when there's some scrolling
  //   const leftThreshold = 10;

  //   // setCanScrollLeft(scrollLeft > leftThreshold);
  //   // setCanScrollRight(scrollLeft + clientWidth < scrollWidth - leftThreshold);
  // }, []);

  // Scroll event handler for infinite scrolling and scroll button state
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !hasMore || isLoading || isPaginationLoading)
      return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Update scroll button states
    // updateScrollButtonsState();

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
    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      // Add direct event listener without debounce for accurate state
      // currentRef.addEventListener("scroll");

      // Debounce function for the performance-heavy operations
      let timeoutId: NodeJS.Timeout;
      const debouncedScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleScroll, 100);
      };

      currentRef.addEventListener("scroll", debouncedScroll);



      return () => {
        // currentRef.removeEventListener("scroll", updateScrollButtonsState);
        clearTimeout(timeoutId);
        currentRef.removeEventListener("scroll", debouncedScroll);
      };
    }
  }, [handleScroll]);

  // Manual scroll handlers for arrow buttons with forced state update
  // const handleManualScroll = (direction: "left" | "right") => {
  //   if (!scrollContainerRef.current) return;

  //   const container = scrollContainerRef.current;
  //   const scrollAmount = direction === "left" ? -300 : 300;

  //   container.scrollBy({
  //     left: scrollAmount,
  //     behavior: "smooth",
  //   });

  //   // Force update the scroll button states after scrolling
  //   // Use setTimeout to wait for the smooth scroll to complete
  //   setTimeout(() => {
  //     updateScrollButtonsState();
  //   }, 500);
  // };

  // Render content based on state
  const renderContent = () => {
    if (isLoading && pagesArray.length === 0) {
      return (
        <div className={styles.noPosts}>
          <LoadingTree />
        </div>
      );
    }

    if (errorMessage && pagesArray.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (pagesArray.length === 0 && !isLoading) {
      return (
        <div className={styles.noPosts}>
          <p>No pages found</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.pagesWrapper}>
      <div className={styles.pagesContainer}>
        {/* Left arrow navigation button - outside the scrollable area */}


        {/* Scrollable container for items only */}
        <div
          ref={scrollContainerRef}
          className={styles.scrollContainer}
        // onScroll={updateScrollButtonsState} // Add direct onScroll handler for immediate updates
        >
          <div className={styles.pages}>
            {pagesArray.map((pageI, index) => (
              <Item
                key={pageI.id || `page-${index}`}
                pageI={pageI}
                page={page}
                setPage={setPage}
                index={index}
                length={pagesArray.length}
              />
            ))}

            {isPaginationLoading && (
              <div className={styles.paginationIndicator}>
                <LoadingTree />
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={bodyRef} className={styles.content}>
        {renderContent()}
        {endOfResults && pagesArray.length > 0 && (
          <p className={styles.endMessage}>
            End of results
          </p>
        )}
      </div>
    </div>
  );
}