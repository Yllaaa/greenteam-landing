import React from "react";
import styles from "./EventFilter.module.css";
import { eventFilterProps } from "./eventFilterTypes.data";
// import AddNewEvent from "@/components/platform/community-modals/AddNewEvent";
function EventFilter(props: eventFilterProps) {
  const { section, setPage, setSection } = props;
//   const [show, setShow] = React.useState(false);
  // const handleAddNew = () => {
  //   setAddNew(true);
  // };
  return (
    <>
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
        {/* <div className={styles.addBtn}>
          <button onClick={handleAddNew}>Add Event</button>
        </div> */}
      </div>
      {/* <AddNewEvent show={show} onClose={() => setShow(false)} /> */}
    </>
  );
}

export default EventFilter;
