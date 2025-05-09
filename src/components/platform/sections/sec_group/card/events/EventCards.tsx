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
  const groupId = useParams().groupId;
  const locale = useLocale();
  const router = useRouter();

  // Get user token
  const localeS = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
  const accessToken = localeS ? JSON.parse(localeS).accessToken : null;

  // Track join status for each event using a Map with event IDs as keys
  const [joinedEvents, setJoinedEvents] = useState<Map<string, boolean>>(new Map());
  const [loadingEvents, setLoadingEvents] = useState<Map<string, boolean>>(new Map());
  const [events, setEvents] = useState<Events>([]);

  // Fetch events and check joining status
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsList = await getEvents(groupId);
        setEvents(eventsList);

        // Check if user is joined to each event if logged in
        if (accessToken) {
          const joinStatusMap = new Map<string, boolean>();

          // For each event, check if the user has joined
          for (const event of eventsList) {
            if (event.id) {
              try {
                const response = await axios.get(
                  `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${event.id}/check-join`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      "Access-Control-Allow-Origin": "*",
                    },
                  }
                );
                joinStatusMap.set(event.id, response.data.isJoined);
              } catch (error) {
                joinStatusMap.set(event.id, false);
                console.error(`Error checking join status for event ${event.id}:`, error);
              }
            }
          }

          setJoinedEvents(joinStatusMap);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [groupId, accessToken]);

  // Handler for joining an event
  const handleJoinNow = async (eventId: string) => {
    if (!accessToken) {
      ToastNot("Please login to join events");
      return;
    }

    // Set loading state for this event
    setLoadingEvents(prev => new Map(prev).set(eventId, true));

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

        // Update join status for this event
        setJoinedEvents(prev => new Map(prev).set(eventId, true));
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        ToastNot(`You've already joined this event`);
        setJoinedEvents(prev => new Map(prev).set(eventId, true));
      } else {
        ToastNot(`Error joining event: ${error.response?.data?.message || 'Please try again'}`);
      }
      console.error("Error joining event:", error);
    } finally {
      // Clear loading state
      setLoadingEvents(prev => {
        const updated = new Map(prev);
        updated.delete(eventId);
        return updated;
      });
    }
  };

  // Handler for leaving an event
  const handleLeaveEvent = async (eventId: string) => {
    if (!accessToken) {
      ToastNot("Please login to manage your events");
      return;
    }

    // Set loading state for this event
    setLoadingEvents(prev => new Map(prev).set(eventId, true));

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

        // Update join status for this event
        setJoinedEvents(prev => {
          const updated = new Map(prev);
          updated.set(eventId, false);
          return updated;
        });
      }
    } catch (error: any) {
      ToastNot(`Error leaving event: ${error.response?.data?.message || 'Please try again'}`);
      console.error("Error leaving event:", error);
    } finally {
      // Clear loading state
      setLoadingEvents(prev => {
        const updated = new Map(prev);
        updated.delete(eventId);
        return updated;
      });
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
        const isEventJoined = joinedEvents.get(eventId) || false;
        const isLoading = loadingEvents.get(eventId) || false;

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
                    if (isEventJoined) {
                      handleLeaveEvent(eventId);
                    } else {
                      handleJoinNow(eventId);
                    }
                  }}
                  className={styles.joinButton}
                  style={{
                    color: isEventJoined ? "red" : "",
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer"
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : isEventJoined ? "Leave" : "Join"}
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