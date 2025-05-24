import React from "react";
import styles from "./newPost.module.css";
import AddNew from "@/components/platform/addNew/post/AddNew";

function page() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.addNew}>
          <AddNew  />
        </div>
      </div>
    </>
  );
}

export default page;
