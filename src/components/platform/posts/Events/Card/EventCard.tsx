/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState } from "react";
import axios from "axios";
import styles from "./EventCard.module.css";
import Image from "next/image";
import noPIc from "@/../public/ZPLATFORM/event/noPicjpg.jpg";
import clock from "@/../public/ZPLATFORM/event/clock.svg";
import locationIcon from "@/../public/ZPLATFORM/event/location.svg";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
// import { FaStar } from "react-icons/fa6";

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
    createdAt?: string;
    posterUrl?: string | null;
    isJoined: boolean;
  };
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  limit: number;
};
function EventCard(props: Props) {
  const locale = useLocale();
  const t = useTranslations("web.event.card");
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

  //local Join Status
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

  // const handleToggleFavorite = () => {
  //   ToastNot("Added to favorites!");
  // };
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

  // const handleToggleFavorite = (id: string) => {
  //   axios
  //     .post(
  //       `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${id}/toggle-favorite`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Access-Control-Allow-Origin": "*",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response.data) {
  //         ToastNot("Added to favorites!");
  //       }
  //     })
  //     .catch((error) => {
  //       const err = error as { status: number };
  //       if (err.status === 409) {
  //         ToastNot("Already in favorites!");
  //       }
  //       console.error("Error toggling favorite:", error);
  //     });
  // };

  return (
    <>
      {/* {events.map((event, index) => ( */}
      <div
        ref={index === events.length - 1 ? ref : null}
        key={index}
        className={styles.card}
        onClick={handleEventDetails}
        style={{ cursor: 'pointer' }}
      >
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
          <div className={styles.actions}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isJoined) {
                  handleLeaveEvent(`${event?.id}`)
                } else {

                  handleJoinNow(`${event?.id}`)
                }
              }}
              className={styles.joinButton}
              style={{
                color: isJoined ? "red" : "",
              }}
            >
              {isJoined ? t("leave") : t("join")}
            </button>
            <button onClick={(e) => {
              e.stopPropagation()
              handleEventDetails()
            }}
              className={styles.joinButton}>
              {t("details")}
            </button>
          </div>
        </div>
        {/* <div
          onClick={() => handleToggleFavorite(`${event?.id}`)}
          className={styles.favorite}
        >
          <FaStar fill="#FFD700" />
        </div> */}
      </div>
    </>
  );
}

export default EventCard;
