/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./header.module.scss";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
// import AddNew from "./AddNew";

// import { useAppSelector } from "@/store/hooks";
import { getSinglePageItems } from "./header.data";
import { PageItem } from "./header.data";
import AddNewProduct from "../body/products/modal/AddNewProduct";

function Pageheader(props: { pageId: string }) {
  // const user = useAppSelector((state) => state.login.user);

  const { pageId } = props;
  const [data, setData] = React.useState<PageItem>({} as PageItem);
  useEffect(() => {
    getSinglePageItems(pageId).then((res) => {
      setData(res);
    });
  }, []);
  const [addNew, setAddNew] = useState(false);
  return (
    <>
      <div className={styles.cover}>
        <div className={styles.coverSection}>
          <Image
            src={data.cover ? data.cover : cover}
            alt={"cover"}
            className={styles.coverImg}
            width={1000}
            height={1000}
            loading="lazy"
          />
        </div>
        <div className={styles.pageInfo}>
          <div className={styles.image}>
            <Image
              src={data.avatar ? data.avatar : cover}
              alt={"cover"}
              className={styles.coverImg}
              loading="lazy"
              width={135}
              height={135}
            />
          </div>
          <div className={styles.name}>
            <p>{data.name}</p>
          </div>
        </div>
      </div>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerWhy}>
            <h5>Why:</h5>
            <h6>{data.why}</h6>
          </div>
          <div className={styles.headerHow}>
            <h5>How:</h5>
            <h6>{data.how}</h6>
          </div>
          <div className={styles.headerWhat}>
            <h5>What:</h5>
            <h6>{data.what}</h6>
          </div>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.headerAddBtns}>
            <button className={styles.addPost}>Add Post</button>
            <button
              onClick={() => setAddNew(!addNew)}
              className={styles.addProduct}
            >
              Add Product
            </button>
            <button className={styles.addEvent}>Add Event</button>
          </div>
          <div className={styles.headerLike}>
            <button className={styles.likeBtn}>Like</button>
          </div>
        </div>
      </div>
      {/* <AddNew /> */}
      {addNew && <AddNewProduct setAddNew={setAddNew} userType="page" />}
    </>
  );
}

export default Pageheader;
