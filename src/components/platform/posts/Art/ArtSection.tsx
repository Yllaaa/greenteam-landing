"use client";
import React from "react";
import PostCard from "../POSTCARD/withImage/PostCard";
import styles from "./ArtSection.module.css";
import Image from "next/image";
import artIcon from "@/../public/ZPLATFORM/categories/art.svg";

function ArtSection() {
  return (
    <>
      <div>
        <div className={styles.title}>
          <h3>
            <Image src={artIcon} alt="artIcon" loading="lazy" /> Art
          </h3>
          <ul>
            <li>Event 1</li>
            <li>Event 2</li>
            <li>Event 3</li>
            <li>Event 4</li>
          </ul>
        </div>
        <div className={styles.posts}>
          <div className={styles.postContainer}>
            <PostCard />
          </div>
          <div className={styles.postContainer}>
            <PostCard />
          </div>
          <div className={styles.postContainer}>
            <PostCard />
          </div>
          <div className={styles.postContainer}>
            <PostCard />
          </div>
          <div className={styles.postContainer}>
            <PostCard />
          </div>
          <div className={styles.postContainer}>
            <PostCard />
          </div>
        </div>
      </div>
    </>
  );
}

export default ArtSection;
