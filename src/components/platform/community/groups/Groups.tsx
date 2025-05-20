"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CommunityGroups } from "./groups.data";
import styles from "./groups.module.scss";
import Item from "./Item";
import { getToken } from "@/Utils/userToken/LocalToken";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import axios from "axios";
import Header from "../header/Header";
import { useAppSelector } from "@/store/hooks";
import AddNewGroup from "./AddGroup/AddNewGroup";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Groups() {
  const city = useAppSelector(
    (state) => state.currentCommunity.selectedCity
  )?.toString();
  const country = useAppSelector(
    (state) => state.currentCommunity.selectedCountry
  )?.toString();
  const [groupsArray, setGroupsArray] = useState<CommunityGroups>([]);

  // pagination
  const limit = 5;
  const [addNew, setAddNew] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [endOfResults, setEndOfResults] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        console.log(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/community/groups?limit=${limit}&page=${pageNum}${countryParam}${cityParam}`
        );

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/community/groups?limit=${limit}&page=${pageNum}${countryParam}${cityParam}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

        const data = response.data;

        // Check if we've reached the end of available GroupArray
        if (data.length < limit) {
          setHasMore(false);
          if (data.length === 0 && pageNum > 1) {
            setEndOfResults(true);
          }
        } else {
          setHasMore(true);
        }

        setGroupsArray((prev) => {
          if (replace) {
            return data;
          }
          return [...prev, ...data];
        });

        // Check scroll states after data is loaded
        setTimeout(updateScrollButtonStates, 300);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle scroll event to check if we need to load more and update button states
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading || isPaginationLoading) return;

    const container = bodyRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Update scroll button states
    updateScrollButtonStates();

    // Load more when user has scrolled to 80% of the content
    if (
      scrollLeft + clientWidth >= scrollWidth * 0.8 &&
      !isPaginationLoading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoading, isPaginationLoading, updateScrollButtonStates]);

  // Add scroll event listener and check initial scroll states
  useEffect(() => {
    const currentRef = bodyRef.current;
    if (currentRef) {
      // Use proper function reference for event handler
      const scrollHandler = () => handleScroll();
      currentRef.addEventListener("scroll", scrollHandler);

      // Initial button state check
      setTimeout(updateScrollButtonStates, 300); // Delay to ensure content is rendered

      return () => {
        if (currentRef) {
          currentRef.removeEventListener("scroll", scrollHandler);
        }
      };
    }
  }, [handleScroll, updateScrollButtonStates]);

  // Recheck scroll button states when groups array changes
  useEffect(() => {
    // Only update after the array has been rendered
    setTimeout(updateScrollButtonStates, 300);
  }, [groupsArray, updateScrollButtonStates]);

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

  // Render content based on state
  const renderContent = () => {
    if (isLoading && groupsArray.length === 0) {
      return (
        <div className={styles.emptyField}>
          <LoadingTree />
        </div>
      );
    }

    if (errorMessage && groupsArray.length === 0) {
      return (
        <div className={styles.emptyField}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (groupsArray.length === 0) {
      return (
        <div className={styles.emptyField}>
          <p>No groups found</p>
        </div>
      );
    }

    return (
      <div className={styles.groups}>
        {groupsArray.map((group, index) => (
          <Item
            key={index}
            group={group}
            page={page}
            setPage={setPage}
            index={index}
            length={groupsArray.length}
          />
        ))}

        {/* Add pagination loader or end message inline with cards */}
        {isPaginationLoading && (
          <div className={styles.paginationContainer}>
            <div className={styles.paginationLoader}>
              <LoadingTree />
            </div>
          </div>
        )}

        {!isPaginationLoading && endOfResults && groupsArray.length > 0 && (
          <div className={styles.paginationContainer}>
            <div className={styles.endMessage}>
              End of results
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Header
        tag="Groups"
        setPage={setPage}
        path={"Create new group"}
        withFilter={false}
        setAddNew={setAddNew}
      >
        <div ref={containerRef} className={styles.groupsContainer}>
          {/* Navigation Arrows - Outside the scrollable area */}
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
            {renderContent()}
          </div>
        </div>
      </Header>
      {addNew && <AddNewGroup setAddNew={setAddNew} />}
    </>
  );
}

export default Groups;