"use client";
import { getToken } from "@/Utils/userToken/LocalToken";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Event, EventCategory, fetchEvents } from "./eventCom.data";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import styles from "./eventCom.module.scss";
import EventCard from "./EventCard";
import Header from "../header/Header";
import { useAppSelector } from "@/store/hooks";
import EventCards from "./Events/Card/EventCard";
import AddNewEvent from "./Events/modal/AddNewEvent";
import { useTranslations } from 'next-intl';

function EventCom() {
  const terror = useTranslations("web.errors")
  const { accessToken } = getToken() || { accessToken: null };
  const country = useAppSelector(
    (state) => state.currentCommunity.selectedCountry
  );
  const city = useAppSelector((state) => state.currentCommunity.selectedCity);

  // State management
  const [addNew, setAddNew] = useState(false);
  const [section, setSection] = useState<EventCategory>("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasMore, setHasMore] = useState(true);

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
    [accessToken, city, country, section]
  );

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

  // Handle load more - triggered by the last EventCard's inView
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
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
        <div className={styles.eventsContainerW}>
          {events.map((event, index) => (
            <EventCard
              key={event.id || index}
              limit={LIMIT}
              events={events}
              event={event}
              index={index}
              page={page}
              setPage={setPage}
              onLastItemVisible={handleLoadMore}
              isLastItem={index === events.length - 1}
              hasMore={hasMore}
            />
          ))}
          {isLoading && events.length > 0 && (
            <div className={styles.loadingMore}>
              <LoadingTree />
            </div>
          )}
        </div>
        <div className={styles.eventsContainerR}>
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
            <div className={styles.loadingMore}>
              <LoadingTree />
            </div>
          )}
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
