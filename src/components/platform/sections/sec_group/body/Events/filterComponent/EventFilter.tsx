import React from "react";
import styles from "./EventFilter.module.css";
import { eventFilterProps } from "./eventFilterTypes.data";
// import AddNewEvent from "@/components/platform/community-modals/AddNewEvent";
function EventFilter(props: eventFilterProps) {
  const { setAddNew } = props;
  //   const [show, setShow] = React.useState(false);
  const handleAddNew = () => {
    setAddNew(true);
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>Your Events</h3>
        </div>

        <div className={styles.addBtn}>
          <button onClick={handleAddNew}>Add Event</button>
        </div>
      </div>
      {/* <AddNewEvent show={show} onClose={() => setShow(false)} /> */}
    </>
  );
}

export default EventFilter;
