"use client";
import React from "react";
import axios from "axios";
import styles from "./EventCard.module.css";
import Image from "next/image";
import image from "@/../public/icons/foot.svg";
import clock from "@/../public/ZPLATFORM/event/clock.svg";
import locationIcon from "@/../public/ZPLATFORM/event/location.svg";

interface EventCardProps {
  id?: string;
  imageUrl?: string;
  name?: string;
  details?: string;
  time?: string;
  location?: string;
  hostedBy?: string;
  isFavorite?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  imageUrl,
  name,
  details,
  time,
  location,
  hostedBy,
  isFavorite,
}) => {
  const handleJoinNow = async () => {
    try {
      const response = await axios.post("/api/joinEvent", { eventId: id });
      console.log("Join response:", response.data);
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const handleToggleFavorite = () => {
    axios.post("/api/toggleFavorite", { eventId: id });
  };

  return (
    <div className={styles.card}>
      <Image
        src={imageUrl ? imageUrl : image}
        alt="image"
        className={styles.image}
      />
      <div className={styles.content}>
        <h2 className={styles.name}>
          {name ? name : "Community Beach Cleanup"}
        </h2>
        <p className={styles.details}>
          {details
            ? details
            : "Join us for a fun day of cleaning up Santa Monica Beach and protecting marine life. All supplies provided!"}
        </p>
        <p className={styles.time}>
          <Image src={clock} alt="clock" />{" "}
          {time ? time : "Sat, Jan 27, 2024 | 9:00 AM - 12:00 PM"}
        </p>
        <p className={styles.location}>
          <Image src={locationIcon} alt="location" />{" "}
          {location ? location : "Santa Monica Beach, CA"}
        </p>
        <p className={styles.hostedBy}>
          {hostedBy ? `Hosted by: ${hostedBy}` : "Hosted by GreenTeam"}
        </p>
        <button onClick={handleJoinNow} className={styles.joinButton}>
          Join Now
        </button>
      </div>
      <button onClick={handleToggleFavorite} className={styles.favoriteButton}>
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
};

export default EventCard;
