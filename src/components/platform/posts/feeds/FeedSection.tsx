"use client";
import React, { useState } from "react";
import PostCard from "../POSTCARD/mainPost/PostCard";
import styles from "./FeedSection.module.css";
import Image from "next/image";
import artIcon from "@/../public/ZPLATFORM/categories/art.svg";
import community from "@/../public/ZPLATFORM/categories/community.svg";
import eco from "@/../public/ZPLATFORM/categories/eco.svg";
import food from "@/../public/ZPLATFORM/categories/food.svg";
import know from "@/../public/ZPLATFORM/categories/know.svg";
import physical from "@/../public/ZPLATFORM/categories/physical.svg";
import DoItModal from "../../modals/toDo/DoItModal";
import CommentModal from "./commentModal/CommentModal";

//Topics types
type Subtopic = {
  id: string;
  name: string;
};

type Topic = {
  id: string;
  name: string;
  subtopics: Subtopic[];
};

type TopicsData = Topic[];

interface Author {
  id: string;
  fullName: string;
  avatar: string | null;
  username: string;
}

//Comment types
type Comment = {
  id: string;
  publicationId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  author: Author;
};

function FeedSection() {
  // Define state variables
  //modals
  const [doItModal, setDoItModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  //APIs Data
  // topics and subtopics
  const topics: TopicsData = ([] = [
    {
      id: "1",
      name: "Food and health",
      subtopics: [
        {
          id: "7",
          name: "Cultivate",
        },
        {
          id: "8",
          name: "Cook",
        },
        {
          id: "9",
          name: "Keep",
        },
        {
          id: "10",
          name: "Natural Medicine",
        },
        {
          id: "11",
          name: "Nutrition",
        },
        {
          id: "12",
          name: "Hygiene",
        },
      ],
    },
    {
      id: "2",
      name: "Knowledge and values",
      subtopics: [
        {
          id: "13",
          name: "Philosophy",
        },
        {
          id: "14",
          name: "Astronomy",
        },
        {
          id: "15",
          name: "Biology",
        },
        {
          id: "16",
          name: "Geology",
        },
        {
          id: "17",
          name: "History",
        },
        {
          id: "18",
          name: "Psychology",
        },
        {
          id: "19",
          name: "Culture",
        },
        {
          id: "20",
          name: "Others",
        },
      ],
    },
    {
      id: "3",
      name: "Physical and mental exercise",
      subtopics: [
        {
          id: "21",
          name: "Sports and games",
        },
        {
          id: "22",
          name: "Active meditation",
        },
        {
          id: "23",
          name: "Passive meditation",
        },
      ],
    },
    {
      id: "4",
      name: "Community and Nature",
      subtopics: [
        {
          id: "24",
          name: "Together",
        },
        {
          id: "25",
          name: "Nature",
        },
        {
          id: "26",
          name: "Volunteering",
        },
        {
          id: "27",
          name: "Ecotourism",
        },
        {
          id: "28",
          name: "Notifications",
        },
      ],
    },
    {
      id: " 5",
      name: "Art",
      subtopics: [
        {
          id: "29",
          name: "Crafts",
        },
        {
          id: "30",
          name: "Music",
        },
        {
          id: "31",
          name: "Show",
        },
      ],
    },
    {
      id: "6",
      name: "Ecotechnics and bioconstruction",
      subtopics: [
        {
          id: "32",
          name: "EcoDesign / Permaculture",
        },
        {
          id: "33",
          name: "Water and energy",
        },
        {
          id: "34",
          name: "Durable tools",
        },
      ],
    },
  ]);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [postId, setPostId] = useState<string>("");

  //pagination
  const [commentsPage, setCommentsPage] = useState(1);

  // request rerender comments
  const [rerender, setRerender] = useState(false);
  // State to track the selected subtopic for each topic
  const [selectedSubtopics, setSelectedSubtopics] = useState<{
    [key: number]: string;
  }>({
    1: "all",
    2: "all",
    3: "all",
    4: "all",
    5: "all",
    6: "all",
  });

  // Get all topics icons
  const topicLogo: { id: number; logo: string }[] = [
    { id: 1, logo: artIcon },
    { id: 2, logo: food },
    { id: 3, logo: physical },
    { id: 4, logo: eco },
    { id: 5, logo: community },
    { id: 6, logo: know },
  ];

  // Handle subtopic selection for a specific topic
  const handleSubTopicChange = (topicId: number, subtopicId: string) => {
    setSelectedSubtopics((prev) => ({
      ...prev,
      [topicId]: subtopicId,
    }));
  };

  return (
    <>
      <div className={styles.feeds}>
        {topics.map((topic, index) => (
          <div key={index} className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.title}>
                <h3>
                  <span className={styles.titleIcon}>
                    <Image
                      src={topicLogo[Number(topic.id) - 1]?.logo}
                      alt="artIcon"
                      loading="lazy"
                      className={styles.titleIcon}
                      width={30}
                      height={30}
                    />
                  </span>{" "}
                  <span className={styles.titleText}>{topic.name}</span>
                </h3>
              </div>
              <div className={styles.filterSection}>
                <ul>
                  <li
                    style={
                      selectedSubtopics[Number(topic.id)] === "all"
                        ? { color: "#97B00F" }
                        : { color: "" }
                    }
                    onClick={() =>
                      handleSubTopicChange(Number(topic.id), "all")
                    }
                  >
                    all
                  </li>
                  {topic.subtopics.map((subtopic, index) => (
                    <li
                      key={index}
                      style={
                        selectedSubtopics[Number(topic.id)] ===
                        subtopic.id.toString()
                          ? { color: "#97B00F" }
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
            </div>

            <div className={styles.posts}>
              <div className={styles.postContainer}>
                <PostCard
                  commentsPage={commentsPage}
                  setCommentsPage={setCommentsPage}
                  rerender={rerender}
                  mainTopic={topic}
                  subTopic={selectedSubtopics}
                  setDoItModal={setDoItModal}
                  setCommentModal={setCommentModal}
                  setPostComments={setPostComments}
                  setPostId={setPostId}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {doItModal && <DoItModal setDoItModal={setDoItModal} />}
      {commentModal && (
        <CommentModal
          commentsPage={commentsPage}
          setCommentsPage={setCommentsPage}
          setCommentModal={setCommentModal}
          postComments={postComments}
          rerender={rerender}
          setRerender={setRerender}
          setPostComments={setPostComments}
          postId={postId}
        />
      )}
    </>
  );
}

export default FeedSection;
