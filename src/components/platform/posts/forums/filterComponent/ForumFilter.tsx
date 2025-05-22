import React from "react";
import styles from "./ForumFilter.module.css";
import { ForumFilterProps } from "./ForumTypes.data";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

function ForumFilter(props: ForumFilterProps) {
  const router = useRouter();
  const locale = useLocale();
  const { section, setPage, setSection } = props;

  const handleAddNew = () => {
    router.push(`/${locale}/addNew/newForum`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>Forum</h3>
        </div>

        <div className={styles.filterSection}>
          <ul className={styles.filterList}>
            {["all", "doubt", "need", "dream"].map((item) => (
              <li
                key={item}
                className={`${styles.filterItem} ${section === item ? styles.active : ""}`}
                onClick={() => {
                  setPage(1);
                  setSection(item);
                }}
              >
                {item === "all" ? "All" : item.charAt(0).toUpperCase() + item.slice(1)}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.addBtnWrapper}>
          <button
            className={styles.addBtn}
            onClick={handleAddNew}
          >
            Add Forum
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForumFilter;