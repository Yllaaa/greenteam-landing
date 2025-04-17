/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { getEvents, Events } from "./eventsCard.data";
import { useParams } from "next/navigation";
import styles from "./eventCards.module.scss";
import Image from "next/image";
import noPIc from "@/../public/ZPLATFORM/event/noPicjpg.jpg";

import { FaClock, FaLocationPin } from "react-icons/fa6";

function EventCards() {
  const groupId = useParams().groupId;

  const [events, setEvents] = React.useState<Events>([]);
  useEffect(() => {
    getEvents(groupId).then((res) => setEvents(res));
  }, []);

  console.log(events);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  }
  function getHour(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", hour12: true });
  }

  return (
    <>
      <div className={styles.sideEvents}>
        {events.map((event, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.img}>
              <Image
                src={event?.posterUrl ? event?.posterUrl : noPIc}
                alt="image"
                className={styles.image}
                width={200}
                height={200}
              />
            </div>
            <div className={styles.content}>
              <h2 className={styles.name}>
                {event.title ? event?.title : "Community Beach Cleanup"}
              </h2>
              <p className={styles.details}>
                {event?.description ? event?.description : "JNo Description!"}
              </p>
              <p className={styles.time}>
                <FaClock />{" "}
                {event?.startDate && event?.endDate
                  ? `${formatDate(event?.startDate)} | ${getHour(
                      event?.startDate
                    )} - ${getHour(event?.endDate)}
                `
                  : "Not Selected"}
              </p>
              <p className={styles.location}>
                <FaLocationPin />{" "}
                {event?.location ? event?.location : "Santa Monica Beach, CA"}
              </p>
              <p className={styles.hostedBy}>
                {event?.group
                  ? `Hosted by: ${event?.group.name}`
                  : "Hosted by GreenTeam"}
              </p>
              {/* <div className={styles.actions}>
              <button
                onClick={() =>
                  isJoined
                    ? handleLeaveEvent(`${event?.id}`)
                    : handleJoinNow(`${event?.id}`)
                }
                className={styles.joinButton}
              >
                {isJoined ? "Leave" : "Join"}
              </button>
              <button
                onClick={handleEventDetails}
                className={styles.joinButton}
              >
                See Details
              </button>
            </div> */}
            </div>
            {/* <button
          onClick={handleToggleFavorite}
          className={styles.favoriteButton}
        >
          <FaStar />
        </button> */}
          </div>
        ))}
      </div>
    </>
  );
}

export default EventCards;
