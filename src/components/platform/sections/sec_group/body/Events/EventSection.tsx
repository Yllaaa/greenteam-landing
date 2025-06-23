/**
 * src/features/events/components/EventSection.tsx
 */
"use client";

import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import toRight from "@/../public/ZPLATFORM/A-iconsAndBtns/ToRights.svg";

// Services and Utils
import { getToken } from "@/Utils/userToken/LocalToken";
import { fetchEvents } from "./functions/eventService";

// Components
import LoadingTree from "@/components/zaLoader/LoadingTree";
const EventCard = lazy(() => import("./Card/EventCard"));

// Modals
import AddNewEvent from "./modal/AddNewEvent";

// Types
import { Event } from "./types/eventTypes.data";

// Styles
import styles from "./EventSection.module.css";
import Image from "next/image";
import { useParams } from "next/navigation";
import EventFilter from "./filterComponent/EventFilter";

function EventSection() {
  // Authentication
  const { accessToken } = getToken() || { accessToken: null };
  const groupID = useParams();
  console.log("Group ID:", groupID.groupId);
  

  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load

  // Constants
  const LIMIT = 5;
  const bodyRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false); // Prevent duplicate requests

  // Fetch events data
  const loadEvents = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      // Prevent duplicate requests
      if (loadingRef.current && !replace) return;

      try {
        loadingRef.current = true;
        setIsLoading(true);
        setErrorMessage(""); // Clear any previous errors

        // Validate required data
        if (!groupID) {
          setErrorMessage("Group ID is required");
          return;
        }

        if (!accessToken) {
          setErrorMessage("Authentication required");
          return;
        }

        const data = await fetchEvents({
          page: pageNum,
          limit: LIMIT,
          accessToken,
          groupId: groupID.groupId as string, // Ensure groupId is a string
        });

        console.log("Fetched Events:", data);

        // Validate response
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

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
          // Prevent duplicates
          const existingIds = new Set(prev.map(event => event.id));
          const newEvents = data.filter(event => !existingIds.has(event.id));
          return [...prev, ...newEvents];
        });

        setIsInitialLoad(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load events. Please try again."
        );
        setHasMore(false); // Stop trying to load more on error
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    [LIMIT, accessToken, groupID]
  );

  // Initial load and refresh when dependencies change
  useEffect(() => {
    if (groupID && accessToken) {
      setPage(1);
      setEvents([]); // Clear existing events
      setHasMore(true); // Reset pagination
      loadEvents(1, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupID, accessToken]); // Remove loadEvents from dependencies to prevent loops

  // Scroll event handler for infinite scrolling
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading || loadingRef.current) return;

    const container = bodyRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Load more when user has scrolled to 80% of the content
    if (scrollLeft + clientWidth >= scrollWidth * 0.8) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoading]);

  // Load more events when page changes
  useEffect(() => {
    if (page > 1 && !loadingRef.current) {
      loadEvents(page, false);
    }
  }, [page, loadEvents]);

  // Add scroll event listener
  useEffect(() => {
    const currentRef = bodyRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  // Client-side only effects
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Manual scroll handlers for arrow buttons
  const handleManualScroll = (direction: "left" | "right") => {
    if (!bodyRef.current) return;

    bodyRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  // Retry loading events
  const handleRetry = () => {
    setErrorMessage("");
    setPage(1);
    loadEvents(1, true);
  };

  // Render loading state
  const renderLoading = () => (
    <div className={styles.noPosts}>
      <LoadingTree />
    </div>
  );

  // Render content based on state
  const renderContent = () => {
    // Show loading on initial load
    if (isInitialLoad && isLoading) {
      return renderLoading();
    }

    // Show error with retry option
    if (errorMessage && events.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>{errorMessage}</p>
          <button onClick={handleRetry} className={styles.retryButton}>
            Retry
          </button>
        </div>
      );
    }

    // Show empty state
    if (!isLoading && events.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>No events found</p>
          <button onClick={() => setAddNew(true)} className={styles.createButton}>
            Create First Event
          </button>
        </div>
      );
    }

    // Show events
    return (
      <Suspense fallback={renderLoading()}>
        {events.map((event, index) => (
          <EventCard
            key={event.id || `event-${index}`}
            limit={LIMIT}
            events={events}
            event={event}
            index={index}
            page={page}
            setPage={setPage}
          />
        ))}
        {isLoading && events.length > 0 && (
          <div className={styles.loadingMore}>
            <LoadingTree />
          </div>
        )}
      </Suspense>
    );
  };

  // Don't render until we have required data
  if (!groupID.groupId || !accessToken) {
    return (
      <div className={styles.container}>
        <div className={styles.noPosts}>
          <p>Unable to load events. Missing required information.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <EventFilter setAddNew={setAddNew} />
        {isMounted && events.length > 0 && (
          <div className={styles.sliderBtns}>
            <div
              className={`${styles.arrow}`}
              onClick={() => handleManualScroll("left")}
            >
              <Image
                src={toRight}
                alt="left arrow"
                width={100}
                height={100}
                style={{ transform: "rotateY(180deg)" }}
              />
            </div>
            <div
              className={`${styles.arrow}`}
              onClick={() => handleManualScroll("right")}
            >
              <Image src={toRight} alt="right arrow" width={100} height={100} />
            </div>
          </div>
        )}

        <div ref={bodyRef} className={styles.body}>
          {renderContent()}
        </div>
      </div>
      {addNew && <AddNewEvent setAddNew={setAddNew} userType="user" />}
    </>
  );
}

export default EventSection;