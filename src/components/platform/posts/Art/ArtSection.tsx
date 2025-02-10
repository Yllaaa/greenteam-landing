"use client";
import React, { useState } from "react";
import PostCard from "../POSTCARD/mainPost/PostCard";
import styles from "./ArtSection.module.css";
import Image from "next/image";
import artIcon from "@/../public/ZPLATFORM/categories/art.svg";
import DoItModal from "../../modals/toDo/DoItModal";

function ArtSection() {
  const [doItModal, setDoItModal] = useState(false);
  const [filter, setFilter] = useState("all");
  return (
    <>
      <div>
        <div className={styles.title}>
          <h3>
            <span className={styles.titleIcon}>
              <Image src={artIcon} alt="artIcon" loading="lazy" />
            </span>{" "}
            <span className={styles.titleText}>Art</span>
          </h3>
          <ul>
            <li
              onClick={() => {
                setFilter("All");
              }}
              className={filter === "All" ? styles.active : ""}
            >
              <span>All</span>
            </li>
            <li
              onClick={() => {
                setFilter("subtopic1");
              }}
              className={filter === "subtopic1" ? styles.active : ""}
            >
              <span>subtopic1</span>
            </li>
            <li
              onClick={() => {
                setFilter("subtopic2");
              }}
              className={filter === "subtopic2" ? styles.active : ""}
            >
              <span>subtopic2</span>
            </li>
            <li
              onClick={() => {
                setFilter("subtopic3");
              }}
              className={filter === "subtopic3" ? styles.active : ""}
            >
              <span>subtopic3</span>
            </li>
          </ul>
        </div>
        <div className={styles.posts}>
          <div className={styles.postContainer}>
            <PostCard setDoItModal={setDoItModal} />
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
      {doItModal && <DoItModal setDoItModal={setDoItModal} />}
    </>
  );
}

export default ArtSection;
