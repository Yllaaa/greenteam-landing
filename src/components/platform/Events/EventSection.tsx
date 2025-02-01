import React from "react";
import EventCard from "./Card/EventCard";
import styles from "./EventSection.module.css";

function EventSection() {
  return (
    <>
      <div>
        <div className={styles.title}>
        <h3>Events</h3>
        <ul>
            <li>Event 1</li>
            <li>Event 2</li>
            <li>Event 3</li>
            <li>Event 4</li>
        </ul>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "25px",
            alignItems: "center",
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            paddingLeft:"20px"
          }}
        >
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
        </div>
      </div>
    </>
  );
}

export default EventSection;
