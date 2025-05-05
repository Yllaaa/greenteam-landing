import React from "react";
import Notes from "../card/notes/Notes";
import AboutGroup from "../card/aboutGrp/AboutGroup";
import EventCards from "../card/events/EventCards";

function GroupSides() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} >
        <Notes />
        <AboutGroup />
        <EventCards />
      </div>
    </>
  );
}

export default GroupSides;
