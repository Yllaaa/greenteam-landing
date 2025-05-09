/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import axios from "axios";
import styles from "./EventCard.module.css";
import Image from "next/image";
import noPIc from "@/../public/ZPLATFORM/event/noPicjpg.jpg";
import clock from "@/../public/ZPLATFORM/event/clock.svg";
import locationIcon from "@/../public/ZPLATFORM/event/location.svg";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
// import { getToken } from "@/Utils/userToken/LocalToken";

type Props = {
  events: {
    id: string;
    title: string;
    description: string;
    location: string;
    startDate: string; // ISO 8601 date string
    endDate: string; // ISO 8601 date string
    category: string;
    posterUrl: string | null;
    hostedBy: string | null;
    isJoined: boolean;
    hostName: string;
  }[];
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    startDate: string; // ISO 8601 date string
    endDate: string; // ISO 8601 date string
    category: string;
    posterUrl: string | null;
    hostedBy: string | null;
    isJoined: boolean;
    hostName: string;
  };
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  limit: number;
};
function EventCard(props: Props) {
  const locale = useLocale();
  // const token = getToken();
  const localeS = localStorage.getItem("user");
  const accessToken = localeS ? JSON.parse(localeS).accessToken : null;

  const { page, setPage, events, event, index } = props;
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const handlePages = React.useCallback(() => {
    setPage(events.length < 5 ? 1 : page + 1);
  }, [page]);

  React.useEffect(() => {
    if (inView) {
      handlePages();
    }
  }, [inView]);
  const handleJoinNow = async (id: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${id}/join`,
        {},
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log("Join response:", await response.data);
      if (response.data) {
        ToastNot(`${response.data.message}`);
      }
    } catch (error) {
      const err = error as { status: number };
      if (err.status === 409) {
        ToastNot(`Joined before`);
      }
      console.error("Error joining event:", error);
    }
  };

  const handleToggleFavorite = () => {
    // axios.post("/api/toggleFavorite", { eventId: id });
  };
  // handle dates:
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
  const router = useRouter();
  const handleEventDetails = () => {
    router.push(`/${locale}/event/${event?.id}`);
  };
  

  return (
    <>
      <div
        ref={index === events.length - 1 ? ref : null}
        key={index}
        className={styles.card}
      >
        <div className={styles.img}>
          <Image
            src={event?.posterUrl ? event?.posterUrl : noPIc}
            alt="image"
            className={styles.image}
            width={500}
            height={500}
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.name}>
            {event.title ? event?.title : "Community Beach Cleanup"}
          </h2>
          <p className={styles.details}>
            {event?.description ? event.description.length > 30 ? event?.description.slice(0, 30) + "..." : event?.description : "JNo Description!"}
          </p>
          <p className={styles.time}>
            <Image src={clock} alt="clock" />{" "}
            {event?.startDate && event?.endDate
              ? `${formatDate(event?.startDate)} | ${getHour(
                  event?.startDate
                )} - ${getHour(event?.endDate)}
                `
              : "Not Selected"}
          </p>
          <p className={styles.location}>
            <Image src={locationIcon} alt="location" />{" "}
            {event?.location ? event?.location : "Santa Monica Beach, CA"}
          </p>
          <p className={styles.hostedBy}>
            {event?.hostedBy
              ? `Hosted by: ${event?.hostedBy}`
              : "Hosted by GreenTeam"}
          </p>
          <div className={styles.actions}>
            <button
              onClick={() => handleJoinNow(`${event?.id}`)}
              className={styles.joinButton}
            >
              {event.isJoined ? "Join event" : "Joined"}
            </button>
            <button onClick={handleEventDetails} className={styles.joinButton}>
              See Details
            </button>
          </div>
        </div>
        <button
          onClick={handleToggleFavorite}
          className={styles.favoriteButton}
        >
          x
        </button>
      </div>
    </>
  );
}

export default EventCard;
