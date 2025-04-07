/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./SingleEventPage.module.css";
import singleBanner from "@/../public/ZPLATFORM/event/single/singleEvent.jpg";
import Image from "next/image";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { FaCalendar, FaLocationPin } from "react-icons/fa6";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { CommentSection } from "../../../ ../../../../posts/feeds/commentModal/CommentModal";
import { getToken } from "@/Utils/userToken/LocalToken";
import { FaComment } from "react-icons/fa";

type Props = {
  id: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: string;
  poster: string | null;
  hostedBy: string;
  isJoined: boolean;
  hostName: string;
};
function SingleEventPage(props: Props) {
  const { id } = props;

  //APIs Data

  const [postComments, setPostComments] = useState<Comment[]>([]);

  //pagination
  const [commentsPage, setCommentsPage] = useState(1);

  //local Join Status
  const [isJoined, setIsJoined] = useState(false);

  // request rerender comments
  const [rerender, setRerender] = useState(false);

  const localeS = getToken();
  const accessToken = localeS ? localeS.accessToken : null;
  console.log(accessToken);

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
          console.log(res.data.isJoined);
          setEvent(res.data);
          setIsJoined(res.data.isJoined);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const handleJoinEvent = async () => {
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
      if (response.status === 200) {
        setIsJoined(!isJoined);
        ToastNot("joined");
      }
    } catch (error) {
      const err = error as { status: number };
      console.error("Error joining event:", error);
      if (err?.status === 409) {
        ToastNot("Already joined");
      }
    }
  };
  const handleLeaveEvent = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${id}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response.status === 200) {
        setIsJoined(!isJoined);
        ToastNot("You left the event");
      }
    } catch (error) {
      const err = error as { status: number };
      console.error("Error joining event:", error);
      if (err?.status === 409) {
        ToastNot("Already joined");
      }
    }
  };

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

  // get comments

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${id}/comments?page=${commentsPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setPostComments(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

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
              Hosted by: <span>{event?.hostedBy}</span>
            </p>
          </div>
          <div className={styles.name}>
            <h3>{event?.title}</h3>
          </div>
          {/* <div className={styles.members}>
            <p>
              Members: <span>{event?.} members will join</span>
            </p>
          </div> */}
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
              <p className={styles.username}>{event?.hostName}</p>
              <p className={styles.usernameTitle}>Organizer</p>
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.action}
              onClick={isJoined ? handleLeaveEvent : handleJoinEvent}
            >
              {isJoined ? "Leave" : "Join Event"}
            </button>
            <button className={styles.action}>Invite</button>
          </div>
        </div>
        <div className={styles.about}>
          <h3>About Event</h3>
          <p>{event?.description}</p>
        </div>
      </div>
      <div className={styles.bar}>
        <p>
          <FaComment style={{ fill: "#97B00F" }} />
          <span>Comments</span>
        </p>
      </div>
      <div className={styles.comments}>
        <CommentSection
          commentsPage={commentsPage}
          setCommentsPage={setCommentsPage}
          postComments={postComments}
          rerender={rerender}
          setRerender={setRerender}
          setPostComments={setPostComments}
          postId={id}
        />
      </div>
    </>
  );
}

export default SingleEventPage;
