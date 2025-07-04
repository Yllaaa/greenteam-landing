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
import EventFilter from "./filterComponent/EventFilter";
const EventCard = lazy(() => import("./Card/EventCard"));

// Modals
import AddNewEvent from "./modal/AddNewEvent";

// Types
import { Event, EventCategory } from "./types/eventTypes.data";

// Styles
import styles from "./EventSection.module.css";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ProfileResponse } from '../../all/all.data';

function EventSection(props: { user: ProfileResponse }) {
  const { user } = props
  // Authentication
  const { accessToken } = getToken() || { accessToken: null };
  const params = useParams()


  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [section, setSection] = useState<EventCategory>("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Constants
  const LIMIT = 5;
  const bodyRef = useRef<HTMLDivElement>(null);

  // Fetch events data
  const loadEvents = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        setIsLoading(true);
        const data = await fetchEvents({
          page: pageNum,
          limit: LIMIT,
          category: section !== "all" ? section : undefined,
          accessToken,
          username: params?.username as string
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
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setErrorMessage("An Error Occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [section, accessToken, params?.username]
  );

  // Initial load and section change handler
  useEffect(() => {
    setPage(1);
    loadEvents(1, true);
  }, [section, loadEvents]);

  // Scroll event handler for infinite scrolling
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading) return;

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
    if (page > 1) {
      loadEvents(page, false);
    }
  }, [page, loadEvents]);

  // Add scroll event listener
  useEffect(() => {
    const currentRef = bodyRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
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
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  // Render loading state
  const renderLoading = () => (
    <div className={styles.noPosts}>
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
        <div className={styles.noPosts}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>No events found</p>
        </div>
      );
    }

    return (
      <Suspense fallback={renderLoading()}>
        {events.map((event, index) => (
          <EventCard
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
          <div className={styles.loadingMore}>
            <LoadingTree />
          </div>
        )}
      </Suspense>
    );
  };

  return (
    <>
      <div className={styles.container}>
        {/* {user.isMyProfile &&  */}
        <EventFilter
          section={section}
          setPage={setPage}
          setSection={setSection}
          setAddNew={setAddNew}
          admin={user.isMyProfile}
        />


        {isMounted && (
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
