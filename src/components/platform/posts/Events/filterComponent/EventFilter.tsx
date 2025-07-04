import React from "react";
import styles from "./EventFilter.module.css";
import { eventFilterProps } from "./eventFilterTypes.data";
import { useTranslations } from "next-intl";

function EventFilter(props: eventFilterProps) {
  const t = useTranslations("web.event.header");
  const { section, setPage, setSection, setAddNew } = props;
  
  const handleAddNew = () => {
    setAddNew(true);
  };
  
  // Filter options array for cleaner rendering
  const filterOptions = [
    { id: "all", label: t("all") },
    { id: "social", label: t("social") },
    { id: "volunteering%26work", label: t("volunteering") },
    { id: "talks%26workshops", label: t("talks") }
  ];
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{t("event")}</h3>
        </div>
        
        <div className={styles.filterSection}>
          <ul className={styles.filterList}>
            {filterOptions.map((option) => (
              <li
                key={option.id}
                className={`${styles.filterItem} ${section === option.id ? styles.active : ""}`}
                onClick={() => {
                  setPage(1);
                  setSection(option.id);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.addBtnWrapper}>
          <button 
            className={styles.addBtn}
            onClick={handleAddNew}
          >
            {t("addEvent")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventFilter;