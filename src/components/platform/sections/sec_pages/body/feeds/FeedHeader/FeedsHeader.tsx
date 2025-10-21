/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import styles from "./FeedsHeader.module.css";
import { SingleTopicsData } from "../TYPES/FeedTypes";
import artIcon from "@/../public/ZPLATFORM/categories/art.svg";
import community from "@/../public/ZPLATFORM/categories/community.svg";
import eco from "@/../public/ZPLATFORM/categories/eco.svg";
import food from "@/../public/ZPLATFORM/categories/food.svg";
import physical from "@/../public/ZPLATFORM/categories/know.svg";
import know from "@/../public/ZPLATFORM/categories/physical.svg";
import { Topics } from "@/components/Assets/topics/Topics.data";
import { useAppSelector } from "@/store/hooks";

function FeedsHeader(props: {
  topic?: SingleTopicsData | any;
  setSelectedSubtopics: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >;
  selectedSubtopics: { [key: number]: string };
  addNewPost?: boolean;
  setAddNewPost?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    topic,
    setSelectedSubtopics,
    selectedSubtopics,
    addNewPost,
    setAddNewPost,
  } = props;
  const pageStatus = useAppSelector((state) => state.pageState);
  const allMainTopics = Topics;
  const topicDetails =
    topic.id !== 0 && allMainTopics.find((item) => item.id === topic.id);

  const topicLogo: { id: number; logo: string }[] = [
    { id: 1, logo: artIcon },
    { id: 2, logo: food },
    { id: 3, logo: physical },
    { id: 4, logo: eco },
    { id: 5, logo: community },
    { id: 6, logo: know },
  ];

  const handleSubTopicChange = (topicId: number, subtopicId: string) => {
    setSelectedSubtopics((prev) => ({
      ...prev,
      [topicId]: subtopicId,
    }));
  };

  const toggleAddNewPost = () => {
    if (!addNewPost && setAddNewPost) setAddNewPost(true);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>
            <span className={styles.titleIcon}>
              <Image
                src={topicLogo[Number(topic?.id) - 1]?.logo}
                alt="artIcon"
                loading="lazy"
                className={styles.titleIcon}
                width={30}
                height={30}
              />
            </span>{" "}
            <span className={styles.titleText}>{topic?.name}</span>
          </h3>
        </div>
        <div className={styles.filterSection}>
          <ul>
            <li
              style={
                selectedSubtopics[Number(topic?.id)] === "all"
                  ? { color: "#97B00F", opacity: 1 }
                  : { color: "" }
              }
              onClick={() => handleSubTopicChange(Number(topic?.id), "all")}
            >
              all
            </li>
            {topic.id !== 0 &&
              topicDetails &&
              topicDetails?.subtopics?.map((subtopic: any, index: number) => (
                <li
                  key={index}
                  style={
                    selectedSubtopics[Number(topic.id)] ===
                      subtopic.id.toString()
                      ? { color: "#97B00F", opacity: 1 }
                      : { color: "" }
                  }
                  onClick={() =>
                    handleSubTopicChange(
                      Number(topic.id),
                      subtopic.id.toString()
                    )
                  }
                >
                  {subtopic.name}
                </li>
              ))}
          </ul>
        </div>
        {pageStatus && pageStatus.isAdmin && (
          <div className={styles.addPost}>
            <button
              onClick={() => {
                toggleAddNewPost();
              }}
            >
              Add Post
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default FeedsHeader;
