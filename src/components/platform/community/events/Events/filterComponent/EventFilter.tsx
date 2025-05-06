import React from "react";
import styles from "./EventFilter.module.css";
import { eventFilterProps } from "./eventFilterTypes.data";
import { useTranslations } from "next-intl";
// import AddNewEvent from "@/components/platform/community-modals/AddNewEvent";
function EventFilter(props: eventFilterProps) {
  const t = useTranslations("web.event.header");
  const { section, setPage, setSection, setAddNew } = props;

  const handleAddNew = () => {
    setAddNew(true);
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>{t("event")}</h3>
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
              {t("all")}
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
              {t("social")}
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
              {t("volunteering")}
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
              {t("talks")}
            </li>
          </ul>
        </div>
        <div className={styles.addBtn}>
          <button onClick={handleAddNew}>{t("addEvent")}</button>
        </div>
      </div>
      {/* <AddNewEvent show={show} onClose={() => setShow(false)} /> */}
    </>
  );
}

export default EventFilter;
