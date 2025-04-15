/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./header.module.scss";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
// import AddNew from "./AddNew";

// import { useAppSelector } from "@/store/hooks";
import { getSinglePageItems, postFllow } from "./header.data";
import { PageItem } from "./header.data";
import AddNewProduct from "../body/products/modal/AddNewProduct";
import AddNewEvent from "../body/Events/modal/AddNewEvent";
import { useAppDispatch } from "@/store/hooks";
import { setCurrentPage } from "@/store/features/pageDetails/pageDetails";
import AddNewModal from "../body/feeds/modal/addNew/AddNewModal";
function Pageheader(props: { pageId: string }) {
  // const user = useAppSelector((state) => state.login.user);
  const dispatch = useAppDispatch();
  const { pageId } = props;
  const [data, setData] = React.useState<PageItem>({} as PageItem);
  const [initialFollow, setInitialFollow] = useState(false);
  useEffect(() => {
    getSinglePageItems(pageId).then((res) => {
      dispatch(setCurrentPage(res));

      setData(res);
      setInitialFollow(res.isFollowing);
    });
  }, []);
  const [addNewP, setAddNewP] = useState(false);
  const [addNewE, setAddNewE] = useState(false);
  const [addNewPost, setAddNewPost] = useState(false);

  const handleFollow = () => {
    postFllow(pageId).then((res) => {
      setInitialFollow(res.followed);
    });
  };

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
            <button
              onClick={() => setAddNewPost(!addNewPost)}
              className={styles.addPost}
            >
              Add Post
            </button>

            {data.isAdmin && (
              <button
                onClick={() => setAddNewP(!addNewP)}
                className={styles.addProduct}
              >
                Add Product
              </button>
            )}
            {data.isAdmin && (
              <button
                onClick={() => setAddNewE(!addNewE)}
                className={styles.addEvent}
              >
                Add Event
              </button>
            )}
          </div>
          <div className={styles.headerLike}>
            <button onClick={handleFollow} className={styles.likeBtn}>
              {initialFollow ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      </div>
      {/* <AddNew /> */}
      {addNewP && <AddNewProduct setAddNew={setAddNewP} userType="page" />}
      {addNewE && <AddNewEvent setAddNew={setAddNewE} userType="page" />}
      {addNewPost && (
        <AddNewModal
          setAddNew={setAddNewPost}
          addNew={addNewPost}
          slug={pageId}
        />
      )}
    </>
  );
}

export default Pageheader;
