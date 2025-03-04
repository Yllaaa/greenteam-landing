import React from "react";
import styles from "./newPost.module.css";
import AddNew from "@/components/platform/addNew/post/AddNew";
<<<<<<< HEAD
=======
import Forums from "@/components/platform/addNew/forums/Forum";
>>>>>>> db2d0d82ce1732d0ee38271beba110cca6d1bf48

function page() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.addNew}>
          <AddNew />
        </div>
      </div>
    </>
  );
}

export default page;
