"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Item from "./Item";
import { PageItem } from "./pages.data";
import styles from "./pages.module.scss";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { FaPlus } from "react-icons/fa"; // Import plus icon
import AddNewPage from "@/components/AA-NEW/MODALS/ADD_PAGE/AddNewPage";
import { ProfileResponse } from "../all/all.data";
export default function Pages(props: { username: string, user: ProfileResponse }) {
  const { username, user } = props;
  const [pagesArray, setPagesArray] = useState<PageItem[]>([]);
  const [showAddNewPage, setShowAddNewPage] = useState(false); // State for controlling modal visibility

  // pagination
  const limit = 5;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [endOfResults, setEndOfResults] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Get token only once
  const localeS = useRef(getToken());
  const accessToken = localeS.current ? localeS.current.accessToken : null;

  const fetchPages = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        // Use different loading state for initial vs pagination loading
        if (replace) {
          setIsLoading(true);
          setEndOfResults(false);
        } else {
          setIsPaginationLoading(true);
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${username}/pages?limit=${limit}&page=${pageNum}`,
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
    [accessToken, username] // Only include accessToken in dependencies
  );

  // Initial load - use a ref to ensure this only runs once
  const initialFetchRef = useRef(false);

  useEffect(() => {
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchPages(1, true);
    }
  }, [fetchPages]);

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

    if (pagesArray.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>No posts found</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.pagesMainContainer}>
      {/* Header with Create Page button */}
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Pages</h2>
        {user.isMyProfile && (

          <button
            className={styles.createPageButton}
            onClick={() => setShowAddNewPage(true)}
          >
            <FaPlus /> Create Page
          </button>
        )}
      </div>

      <div className={styles.pagesContainer}>
        <div className={styles.pages}>
          {pagesArray.map((pageI, index) => (
            <Item
              key={pageI.id || index} // Use ID if available for more stable keys
              pageI={pageI}
              page={page}
              setPage={setPage}
              index={index}
              length={pagesArray.length}
            />
          ))}
        </div>

        {/* Scroll navigation buttons */}
        <div className={styles.scrollControls}>
          <button
            onClick={() => handleManualScroll("left")}
            disabled={!canScrollLeft}
            className={`${styles.scrollButton} ${canScrollLeft ? styles.active : ""
              }`}
            aria-label="Scroll left"
          >
            &larr;
          </button>
          <button
            onClick={() => handleManualScroll("right")}
            disabled={!canScrollRight}
            className={`${styles.scrollButton} ${canScrollRight ? styles.active : ""
              }`}
            aria-label="Scroll right"
          >
            &rarr;
          </button>
        </div>

        <div ref={bodyRef} className={styles.content}>
          {renderContent()}
          {/* {isPaginationLoading && <div className={styles.paginationLoader}><LoadingTree /></div>} */}
          {endOfResults && (
            <p style={{ display: "none" }} className={styles.endMessage}>
              End of results
            </p>
          )}
        </div>
      </div>

      {/* Modal for creating new page */}
      {showAddNewPage && (
        <AddNewPage setAddNew={setShowAddNewPage} />
      )}
    </div>
  );
}