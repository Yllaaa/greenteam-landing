"use client";
import React, { useEffect, useState } from "react";
import PostCard from "../POSTCARD/mainPost/PostCard";
import styles from "./ArtSection.module.css";
import Image from "next/image";
import artIcon from "@/../public/ZPLATFORM/categories/art.svg";
import community from "@/../public/ZPLATFORM/categories/community.svg";
import eco from "@/../public/ZPLATFORM/categories/eco.svg";
import food from "@/../public/ZPLATFORM/categories/food.svg";
import know from "@/../public/ZPLATFORM/categories/know.svg";
import physical from "@/../public/ZPLATFORM/categories/physical.svg";
import DoItModal from "../../modals/toDo/DoItModal";
import axios from "axios";
import CommentModal from "./commentModal/CommentModal";

type Subtopic = {
  id: number;
  name: string;
};

type Topic = {
  id: number;
  name: string;
  subtopics: Subtopic[];
};

// Define the type for the entire data structure
type TopicsData = Topic[];

type Author = {
  id: string;
  fullName: string;
  username: string;
  avatar?: string | null;
};

type Comment = {
  id: string;
  publicationId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  author: Author;
};

function ArtSection() {
  const [doItModal, setDoItModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);

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

  // Get all topics and filter them
  const topicLogo: { id: number; logo: string }[] = [
    { id: 1, logo: artIcon },
    { id: 2, logo: food },
    { id: 3, logo: physical },
    { id: 4, logo: eco },
    { id: 5, logo: community },
    { id: 6, logo: know },
  ];

  const [topics, setTopics] = useState<TopicsData>([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/topics?tree=true`
      )
      .then((res) => setTopics(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle subtopic selection for a specific topic
  const handleSubTopicChange = (topicId: number, subtopicId: string) => {
    setSelectedSubtopics((prev) => ({
      ...prev,
      [topicId]: subtopicId,
    }));
  };

  const [commentPage, setCommentPage] = useState(1);
  // const limit = 5;

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
                      src={topicLogo[topic?.id - 1]?.logo}
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
                      selectedSubtopics[topic.id] === "all"
                        ? { color: "#97B00F" }
                        : { color: "" }
                    }
                    onClick={() => handleSubTopicChange(topic.id, "all")}
                  >
                    all
                  </li>
                  {topic.subtopics.map((subtopic, index) => (
                    <li
                      key={index}
                      style={
                        selectedSubtopics[topic.id] === subtopic.id.toString()
                          ? { color: "#97B00F" }
                          : { color: "" }
                      }
                      onClick={() =>
                        handleSubTopicChange(topic.id, subtopic.id.toString())
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
                  commentPage={commentPage}
                  setCommentPage={setCommentPage}
                  mainTopic={topic}
                  subTopic={selectedSubtopics}
                  setDoItModal={setDoItModal}
                  setCommentModal={setCommentModal}
                  setPostComments={setPostComments}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {doItModal && <DoItModal setDoItModal={setDoItModal} />}
      {commentModal && (
        <CommentModal
          commentPage={commentPage}
          setCommentPage={setCommentPage}
          setCommentModal={setCommentModal}
          postComments={postComments && postComments}
        />
      )}
    </>
  );
}

export default ArtSection;
