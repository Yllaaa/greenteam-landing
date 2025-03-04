import React from "react";
import styles from "./newPost.module.css";
import AddNew from "@/components/platform/addNew/post/AddNew";
import Forums from "@/components/platform/addNew/forums/Forum";

function page() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.forum}>
          <Forums />
        </div>
        <div className={styles.addNew}>
          <AddNew/>
        </div>
      </div>
    </>
  );
}

export default page;
