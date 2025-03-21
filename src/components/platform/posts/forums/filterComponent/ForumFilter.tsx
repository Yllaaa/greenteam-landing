import React from "react";
import styles from "./ForumFilter.module.css";
import { ForumFilterProps } from "./ForumTypes.data";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
// import AddNewEvent from "@/components/platform/community-modals/AddNewEvent";
function ForumFilter(props: ForumFilterProps) {
  const router = useRouter();
  const locale = useLocale();
  const { section, setPage, setSection } = props;
  //   const [show, setShow] = React.useState(false);
  const handleAddNew = () => {
    router.push(`/${locale}/personal/newForum`);
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>Forum</h3>
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
                section === "doubt"
                  ? { color: "#97B00F", opacity: 1 }
                  : { color: "" }
              }
              onClick={() => {
                setPage(1);
                setSection("doubt");
              }}
            >
              Doubt
            </li>
            <li
              style={
                section === "need"
                  ? { color: "#97B00F", opacity: 1 }
                  : { color: "" }
              }
              onClick={() => {
                setPage(1);
                setSection("need");
              }}
            >
              Need
            </li>
            <li
              style={
                section === "dream"
                  ? { color: "#97B00F", opacity: 1 }
                  : { color: "" }
              }
              onClick={() => {
                setPage(1);
                setSection("dream");
              }}
            >
              Dream
            </li>
          </ul>
        </div>
        <div className={styles.addBtn}>
          <button onClick={handleAddNew}>Add Forum</button>
        </div>
      </div>
      {/* <AddNewEvent show={show} onClose={() => setShow(false)} /> */}
    </>
  );
}

export default ForumFilter;
