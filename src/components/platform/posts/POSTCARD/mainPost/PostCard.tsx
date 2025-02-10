"use client";
import React from "react";
import styles from "./postCard.module.css";
import PostSlider from "./POSTSLIDER/PostSlider";

type Props = {
  setDoItModal?: (value: boolean) => void;
};
function PostCard(props: Props) {
  const { setDoItModal } = props;

  const postContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Lorem, ipsum dolor sit amet consectetur adipisicing elit.";

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.userAvatar}></div>
          <div className={styles.details}>
            <div className={styles.userName}>
              <p>
                John Doe <span>@JohnDoe</span>
                <span>{" . "}23S</span>
              </p>
            </div>
            <div className={styles.post}>
              {postContent.length > 50 ? (
                <p>
                  {postContent.slice(0, 40)} <span>Read More... </span>
                </p>
              ) : (
                <p>{postContent.slice(0, 50)}</p>
              )}
            </div>
          </div>
        </div>
        <div className={styles.image}>
          <div className={styles.postslider}>
            <PostSlider setDoItModal={setDoItModal} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;
