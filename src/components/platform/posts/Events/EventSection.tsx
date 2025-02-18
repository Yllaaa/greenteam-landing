/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { lazy, Suspense } from "react";
const EventCard = lazy(() => import("./Card/EventCard")); // "./Card/EventCard";
import styles from "./EventSection.module.css";
import axios from "axios";
import LoadingTree from "@/components/zaLoader/LoadingTree";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

function EventSection() {
  const localeS = localStorage.getItem("user");
  const accessToken = localeS ? JSON.parse(localeS).accessToken : null;

  const [events, setEvents] = React.useState<any[]>([]);
  const [section, setSection] = React.useState<
    "social" | "volunteering%26work" | "talks%26workshops" | "all"
  >("all");
  const limit = 5;
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [prevPage, setPrevPage] = React.useState(page);

  React.useEffect(() => {
    axios
      .get(
        `${
          process.env.NEXT_PUBLIC_BACKENDAPI
        }/api/v1/events?page=${page}&limit=${limit}
        ${section === "all" ? "" : `&category=${section}`}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setEvents((prev) => {
          // If page changed, append data
          if (prevPage !== page && page !== 1) {
            return [...prev, ...res.data];
          }
          // If section or mainTopicId changed, replace data
          return res.data;
        });

        setPrevPage(page); // Store the previous page for comparison
      })
      .catch((err) => {
        setErrorMessage("An Error Occurred");
        setIsLoading(false);
        console.log(err);
      });
  }, [section, page, accessToken]);

  const bodyRef = React.useRef<HTMLDivElement>(null);

  const prevSlide = () => {
    // if (instanceRef.current) instanceRef.current.prev();
    if (bodyRef.current) {
      bodyRef.current.scrollBy({
        left: +300,
        behavior: "smooth",
      });
    }
  };

  // Go to Next Slide
  const nextSlide = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div>
        <div className={styles.header}>
          <div className={styles.title}>
            <h3>Events</h3>
          </div>
          <div className={styles.filterSection}>
            <ul>
              <li
                style={
                  section === "all"
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() => {
                  setPage(1);
                  setSection("all");
                }}
              >
                all
              </li>
              <li
                style={
                  section === "social"
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() => {
                  setPage(1);
                  setSection("social");
                }}
              >
                social
              </li>
              <li
                style={
                  section === "volunteering%26work"
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() => {
                  setPage(1);
                  setSection("volunteering%26work");
                }}
              >
                volunteering & work
              </li>
              <li
                style={
                  section === "talks%26workshops"
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() => {
                  setPage(1);
                  setSection("talks%26workshops");
                }}
              >
                talks & workshops
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.sliderBtns}>
          <div className="arrow left" onClick={prevSlide}>
            <FaArrowLeft />
          </div>
          <div className="arrow right" onClick={nextSlide}>
            <FaArrowRight />
          </div>
        </div>
        <div ref={bodyRef} className={styles.body}>
          {isLoading ? (
            <div className={styles.noPosts}>
              <LoadingTree />
            </div>
          ) : errorMessage === "" ? (
            events.length === 0 ? (
              <div className={styles.noPosts}>
                <p>No events found</p>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className={styles.noPosts}>
                    <LoadingTree />
                  </div>
                }
              >
                {events.map((event, index) => (
                  <EventCard
                    limit={limit}
                    key={index}
                    events={events}
                    event={event}
                    index={index}
                    page={page}
                    setPage={setPage}
                  />
                ))}
              </Suspense>
            )
          ) : (
            <div className={styles.noPosts}>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EventSection;
