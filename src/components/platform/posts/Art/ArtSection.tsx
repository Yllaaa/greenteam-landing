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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "25px",
            alignItems: "center",
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            paddingLeft: "34px",
          }}
        >
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </div>
      </div>
    </>
  );
}

export default ArtSection;
