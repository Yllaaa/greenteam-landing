/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./SingleEventPage.module.css";
import singleBanner from "@/../public/ZPLATFORM/event/single/singleEvent.jpg";
import Image from "next/image";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { FaCalendar, FaLocationPin } from "react-icons/fa6";

type Props = {
  id: string;
};
type CreatorType = "user" | "admin" | "moderator"; // Adjust based on possible values

type Topic = {
  id: number;
  name: string;
  parentId: number | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type UserCreator = {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
  bio: string | null;
};

type Event = {
  id: string;
  creatorId: string;
  creatorType: CreatorType;
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  category: string; // Consider defining specific category types if known
  poster: string | null; // Nullable image URL
  priority: number;
  topicId: number;
  createdAt: string; // ISO date string
  joinedCount: number;
  topic: Topic;
  userCreator: UserCreator;
};
function SingleEventPage(props: Props) {
  const { id } = props;
  const localeS = localStorage.getItem("user");
  const accessToken = localeS ? JSON.parse(localeS).accessToken : null;
  const [event, setEvent] = useState<Event>();
  useEffect(() => {
    try {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          setEvent(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    // Define month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Extract day, month, and year
    const day = date.getUTCDate();
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    // Return formatted date
    return `${day} ${month}, ${year}`;
  }

  //   handling performence

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.banner}>
          {!imageLoaded && (
            <div className={styles.loading}>
              <LoadingTree />
            </div>
          )}
          <Image
            className={styles.image}
            src={event?.poster ? event?.poster : singleBanner}
            alt="Single Event Banner"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.hostedBy}>
            <p>
              Hosted by: <span>{event?.creatorType}</span>
            </p>
          </div>
          <div className={styles.name}>
            <h3>{event?.title}</h3>
          </div>
          <div className={styles.members}>
            <p>
              Members: <span>{event?.joinedCount} members will join</span>
            </p>
          </div>
          <div className={styles.date}>
            <p>
              <span className={styles.icon}>
                <FaCalendar />
              </span>
              <span className={styles.line}>
                <span>{event && formatDate(event?.startDate)}</span> to{" "}
                <span>{event && formatDate(event?.endDate)}</span>
              </span>
            </p>
          </div>
          <div className={styles.location}>
            <p>
              <span className={styles.icon}>
                <FaLocationPin />
              </span>
              <span className={styles.line}>{event && event?.location}</span>
            </p>
          </div>
          <div className={styles.organizer}>
            <div className={styles.img}></div>
            <div className={styles.text}>
              <p className={styles.username}>{event?.userCreator.username}</p>
              <p className={styles.usernameTitle}>Organizer</p>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles.action}>Join Group</button>
            <button className={styles.action}>Invite</button>
          </div>
        </div>
        <div className={styles.about}>
          <h3>About Event</h3>
          <p>{event?.description}</p>
        </div>
      </div>
    </>
  );
}

export default SingleEventPage;
