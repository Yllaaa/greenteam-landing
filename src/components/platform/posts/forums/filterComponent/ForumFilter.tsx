import React from "react";
import styles from "./ForumFilter.module.css";
import { ForumFilterProps } from "./ForumTypes.data";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

function ForumFilter(props: ForumFilterProps) {
  const router = useRouter();
  const locale = useLocale();
  const { section, setPage, setSection } = props;
  const t = useTranslations("web.main.forums");
  const handleAddNew = () => {
    router.push(`/${locale}/addNew/newForum`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{t("forum")}</h3>
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
                {item === "all" ? t("all") : t(item)}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.addBtnWrapper}>
          <button
            className={styles.addBtn}
            onClick={handleAddNew}
          >
            {t("addNew")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForumFilter;