"use client";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import styles from "./eventCom.module.scss";
import Image from "next/image";

import noPIc from "@/../public/ZPLATFORM/event/noPicjpg.jpg";
import clock from "@/../public/ZPLATFORM/event/clock.svg";
import locationIcon from "@/../public/ZPLATFORM/event/location.svg";

type Props = {
  events: {
    id?: string;
    creatorId?: string;
    creatorType?: string;
    title?: string;
    description?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    poster?: string | null;
    priority?: number;
    topicId?: number;
    createdAt?: string;
    posterUrl?: string | null;
  }[];
  event: {
    id?: string;
    creatorId?: string;
    creatorType?: string;
    title?: string;
    description?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    poster?: string | null;
    priority?: number;
    topicId?: number;
    createdAt?: string;
    posterUrl?: string | null;
    isJoined: boolean;
  };
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  limit: number;
  onLastItemVisible: () => void;
  isLastItem: boolean;
  hasMore: boolean;
};

function EventCard(props: Props) {
  const locale = useLocale();
  const localeS = localStorage.getItem("user");
  const accessToken = localeS ? JSON.parse(localeS).accessToken : null;
  const { event, index, isLastItem, onLastItemVisible, hasMore } = props;

  // Set up intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Call onLastItemVisible when the last item comes into view
  useEffect(() => {
    if (inView && isLastItem && hasMore) {
      onLastItemVisible();
    }
  }, [inView, isLastItem, onLastItemVisible, hasMore]);

  // Local Join Status
  const [isJoined, setIsJoined] = useState(event.isJoined);

  const handleJoinNow = async (id: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${id}/join`,
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
        setIsJoined(true);
      }
    } catch (error) {
      const err = error as { status: number };
      if (err.status === 409) {
        ToastNot(`Joined before`);
      }
      console.error("Error joining event:", error);
    }
  };

  const handleLeaveEvent = async (id: string) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${id}/leave`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response.data) {
        ToastNot(`${response.data.message}`);
        setIsJoined(false);
      }
    } catch (error) {
      console.error("Error leaving event:", error);
    }
  };

  // Handle dates
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
    <div ref={isLastItem ? ref : undefined} key={index} className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.name}>
          {event.title ? event?.title : "Community Beach Cleanup"}
        </h2>
        <p className={styles.details}>
          {event?.description ? event?.description : "No Description!"}
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
          {event?.creatorType
            ? `Hosted by: ${event?.creatorType}`
            : "Hosted by GreenTeam"}
        </p>
      </div>
      <div className={styles.img}>
        <div className={styles.overlay}></div>
        <Image
        unoptimized
          src={event?.posterUrl ? event?.posterUrl : noPIc}
          alt="image"
          className={styles.image}
          width={200}
          height={200}
        />
      </div>
      <div className={styles.actions}>
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
        <button onClick={handleEventDetails} className={styles.joinButton}>
          See Details
        </button>
      </div>
    </div>
  );
}

export default EventCard;
