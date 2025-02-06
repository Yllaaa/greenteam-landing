"use client";
import React, { useEffect, useState } from "react";
import styles from "./postCard.module.css";
import Image from "next/image";
import foot from "@/../public/goals/9af82d040ad31191bd7b42312d18fff3.jpeg";
import doIcon from "@/../public/ZPLATFORM/post/do.svg";
import like from "@/../public/ZPLATFORM/post/like.svg";
import unlike from "@/../public/ZPLATFORM/post/unlike.svg";
import comment from "@/../public/ZPLATFORM/post/comment.svg";
function PostCard() {
  const [textColor, setTextColor] = useState("black"); // Default text color

  useEffect(() => {
    const img = new window.Image();
    img.src = foot.src;
    img.crossOrigin = "Anonymous"; // Enable cross-origin access if needed

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = foot.width;
      canvas.height = foot.height;

      // Draw the image on the canvas
      ctx?.drawImage(img, 0, 0, foot.width, foot.height);

      // Get the average color of the image
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData?.data;

      let r = 0,
        g = 0,
        b = 0;

      if (data) {
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
        }

        r = Math.floor(r / (data.length / 4));
        g = Math.floor(g / (data.length / 4));
        b = Math.floor(b / (data.length / 4));

        // Calculate the brightness of the average color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        console.log(brightness);
        // Set the text color based on the brightness
        if (brightness > 128) {
          setTextColor("black");
        } else {
          setTextColor("white");
        }
      }
    };
  }, []);

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
          <Image src={foot} alt="image" className={styles.postImage} />
          <div style={{ color: textColor }} className={styles.reactionBtns}>
            <div className={styles.btn}>
              <Image src={doIcon} alt="do" />
              <p>
                <span>Do</span>
              </p>
            </div>
            <div className={styles.btn}>
              <Image src={like} alt="like" />
              <p>
                <span>Like</span>
              </p>
            </div>
            <div className={styles.btn}>
              <Image src={unlike} alt="unlike" />
              <p>
                <span>Unlike</span>
              </p>
            </div>
            <div className={styles.btn}>
              <Image src={comment} alt="comment" />
              <p>
                <span>Comment</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;
