import React from "react";
import styles from "./newForum.module.css";
// import AddNew from "@/components/platform/addNewPost/addNew/AddNew";
import Forums from "@/components/platform/addNew/forums/Forum";

function page() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.forum}>
          <Forums />
        </div>
      </div>
    </>
  );
}

export default page;
