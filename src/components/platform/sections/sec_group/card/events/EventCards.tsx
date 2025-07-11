/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getEvents, Events } from "./eventsCard.data";
import { useParams, useRouter } from "next/navigation";
import styles from "./eventCards.module.scss";
import Image from "next/image";
import noPIc from "@/../public/ZPLATFORM/event/noPicjpg.jpg";
import { FaClock, FaLocationPin } from "react-icons/fa6";
import axios from "axios";
import { useLocale } from "next-intl";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function EventCards() {
  const params = useParams()
  const groupId = params && params.groupId;
  const locale = useLocale();
  const router = useRouter();

  // Get user token
  const localeS = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
  const accessToken = localeS ? JSON.parse(localeS).accessToken : null;

  // State for events and loading
  const [events, setEvents] = useState<Events>([]);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsList = await getEvents(groupId as string);
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [groupId]);

  // Handler for joining an event
  const handleJoinNow = async (eventId: string) => {
    if (!accessToken) {
      ToastNot("Please login to join events");
      return;
    }

    // Set loading state for this event
    setLoadingEventId(eventId);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${eventId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.data) {
        ToastNot(`${response.data.message}`);

        // Update the event's join status in the state
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === eventId
              ? { ...event, isJoined: true }
              : event
          )
        );
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        ToastNot(`You've already joined this event`);

        // Update the event's join status in the state
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === eventId
              ? { ...event, isJoined: true }
              : event
          )
        );
      } else {
        ToastNot(`Error joining event: ${error.response?.data?.message || 'Please try again'}`);
      }
      console.error("Error joining event:", error);
    } finally {
      // Clear loading state
      setLoadingEventId(null);
    }
  };

  // Handler for leaving an event
  const handleLeaveEvent = async (eventId: string) => {
    if (!accessToken) {
      ToastNot("Please login to manage your events");
      return;
    }

    // Set loading state for this event
    setLoadingEventId(eventId);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${eventId}/leave`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.data) {
        ToastNot(`${response.data.message}`);

        // Update the event's join status in the state
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === eventId
              ? { ...event, isJoined: false }
              : event
          )
        );
      }
    } catch (error: any) {
      ToastNot(`Error leaving event: ${error.response?.data?.message || 'Please try again'}`);
      console.error("Error leaving event:", error);
    } finally {
      // Clear loading state
      setLoadingEventId(null);
    }
  };

  // Handler for navigating to event details
  const handleEventDetails = useCallback((eventId: string) => {
    router.push(`/${locale}/event/${eventId}`);
  }, [locale, router]);

  // Date formatting functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getHour = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", hour12: true });
  };

  return (
    <div className={styles.sideEvents}>
      {events.map((event, index) => {
        const eventId = event.id || "";
        const isLoading = loadingEventId === eventId;

        return (
          <div
            key={index}
            className={styles.card}
            onClick={() => handleEventDetails(eventId)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.img}>
              <Image
                src={event?.posterUrl ? event?.posterUrl : noPIc}
                alt={`Event poster for ${event.title || "event"}`}
                className={styles.image}
                width={200}
                height={200}
                loading="lazy"
              />
            </div>
            <div className={styles.content}>
              <h2 className={styles.name}>
                {event.title ? event.title : "Community Beach Cleanup"}
              </h2>
              <p className={styles.details}>
                {event?.description ? event.description : "No Description!"}
              </p>
              <p className={styles.time}>
                <FaClock />{" "}
                {event?.startDate && event?.endDate
                  ? `${formatDate(event.startDate)} | ${getHour(
                    event.startDate
                  )} - ${getHour(event.endDate)}`
                  : "Not Selected"}
              </p>
              <p className={styles.location}>
                <FaLocationPin />{" "}
                {event?.location ? event.location : "Santa Monica Beach, CA"}
              </p>
              <p className={styles.hostedBy}>
                {event?.group
                  ? `Hosted by: ${event.group.name}`
                  : "Hosted by GreenTeam"}
              </p>
              <div className={styles.actions}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (event.isJoined) {
                      handleLeaveEvent(eventId);
                    } else {
                      handleJoinNow(eventId);
                    }
                  }}
                  className={styles.joinButton}
                  style={{
                    color: event.isJoined ? "red" : "",
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer"
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : event.isJoined ? "Leave" : "Join"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventDetails(eventId);
                  }}
                  className={styles.joinButton}
                >
                  See Details
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EventCards;