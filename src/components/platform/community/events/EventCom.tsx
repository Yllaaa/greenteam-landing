"use client";
import { getToken } from "@/Utils/userToken/LocalToken";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Event, EventCategory, EventMode, fetchEvents } from "./eventCom.data";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import styles from "./eventCom.module.scss";
import Header from "../header/Header";
import { useAppSelector } from "@/store/hooks";
import EventCards from "./Events/Card/EventCard";
import AddNewEvent from "./Events/modal/AddNewEvent";
import { useTranslations } from 'next-intl';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function EventCom() {
  const terror = useTranslations("web.errors");
  const { accessToken } = getToken() || { accessToken: null };
  const country = useAppSelector(
    (state) => state.currentCommunity.selectedCountry
  );
  const city = useAppSelector((state) => state.currentCommunity.selectedCity);
  const verified = useAppSelector(
    (state) => state.currentCommunity.verificationStatus
  );
  const eventMode = useAppSelector(
    (state) => state.currentCommunity.selectedCategory
  ) as EventMode;

  // State management
  const [addNew, setAddNew] = useState(false);
  const [section, setSection] = useState<EventCategory>("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Constants
  const LIMIT = 5;

  // Fetch events data
  const loadEvents = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        setIsLoading(true);
        const data = await fetchEvents({
          page: pageNum,
          limit: LIMIT,
          city: city !== undefined ? city : "",
          country: country !== undefined ? country : "",
          accessToken,
          category: section,
          eventMode: eventMode,
          verified: verified,
        });

        // Check if we've reached the end of available events
        if (data.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setEvents((prev) => {
          if (replace) {
            return data;
          }
          return [...prev, ...data];
        });

        // Check scroll states after data is loaded
        setTimeout(updateScrollButtonStates, 300);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setErrorMessage("An Error Occurred");
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken, city, country, section, eventMode, verified]
  );

  // Check scroll position to update navigation button states
  const updateScrollButtonStates = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setCanScrollLeft(scrollLeft > 10); // Add a small threshold
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // Add a small threshold
  }, []);

  // Handle scroll event to check if we need to load more and update button states
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !hasMore || isLoading) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Update scroll button states
    updateScrollButtonStates();

    // Load more when user has scrolled to 80% of the content
    if (
      scrollLeft + clientWidth >= scrollWidth * 0.8 &&
      !isLoading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoading, updateScrollButtonStates]);

  // Add scroll event listener
  useEffect(() => {
    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      const scrollHandler = () => handleScroll();
      currentRef.addEventListener("scroll", scrollHandler);

      // Initial check for scroll button states
      setTimeout(updateScrollButtonStates, 300);

      return () => {
        if (currentRef) {
          currentRef.removeEventListener("scroll", scrollHandler);
        }
      };
    }
  }, [handleScroll, updateScrollButtonStates]);

  // Load more events when page changes
  useEffect(() => {
    if (page > 1 && hasMore) {
      loadEvents(page, false);
    }
  }, [page, hasMore, loadEvents]);

  // Initial load and section change handler
  useEffect(() => {
    setPage(1);
    loadEvents(1, true);
  }, [loadEvents]);

  // Recheck scroll button states when events array changes
  useEffect(() => {
    // Only update after the array has been rendered
    setTimeout(updateScrollButtonStates, 300);
  }, [events, updateScrollButtonStates]);

  // Scroll handlers for the navigation buttons
  const handleScrollDirection = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of visible width

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Update button states after scroll animation
    setTimeout(updateScrollButtonStates, 500);
  };

  // Render loading state
  const renderLoading = () => (
    <div className={styles.emptyField}>
      <LoadingTree />
    </div>
  );

  // Render content based on state
  const renderContent = () => {
    if (isLoading && events.length === 0) {
      return renderLoading();
    }

    if (errorMessage && events.length === 0) {
      return (
        <div className={styles.emptyField}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className={styles.emptyField}>
          <p>{terror("notfound")}</p>
        </div>
      );
    }

    return (
      <Suspense fallback={renderLoading()}>
        <div className={styles.eventsContainer} ref={containerRef}>
          {/* Navigation Arrows */}
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

          <div className={styles.eventsContainerR} ref={scrollContainerRef}>
            {events.map((event, index) => (
              <EventCards
                key={event.id || index}
                limit={LIMIT}
                events={events}
                event={event}
                index={index}
                page={page}
                setPage={setPage}
              />
            ))}
            {isLoading && events.length > 0 && (
              <div className={styles.paginationContainer}>
                <div className={styles.loadingMore}>
                  <LoadingTree />
                </div>
              </div>
            )}
            {!isLoading && !hasMore && events.length > 0 && (
              <div className={styles.paginationContainer}>
                <div className={styles.endMessage}>
                  End of results
                </div>
              </div>
            )}
          </div>
        </div>
      </Suspense>
    );
  };

  return (
    <>
      <Header
        withFilter={true}
        tag="Events"
        path="Create new event"
        setSection={setSection}
        section={section}
        setPage={setPage}
        setAddNew={setAddNew}
      >
        <div>{renderContent()}</div>
      </Header>
      {addNew && <AddNewEvent setAddNew={setAddNew} userType="user" />}
    </>
  );
}

export default EventCom;