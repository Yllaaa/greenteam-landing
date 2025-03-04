"use client";
import React, { useState } from "react";
import PostCard from "../POSTCARD/mainPost/PostCard";
import styles from "./FeedSection.module.css";

import DoItModal from "../../modals/toDo/DoItModal";
import CommentModal from "./commentModal/CommentModal";
import { Comment, TopicsData } from "./TYPES/FeedTypes";
import FeedsHeader from "./FeedHeader/FeedsHeader";

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

function FeedSection() {
  // Define state variables
  //modals
  const [doItModal, setDoItModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  //APIs Data

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

  return (
    <>
      <div className={styles.feeds}>
        {topics.map((topic, index) => (
          <div key={index} className={styles.container}>
            {/* Header */}
            <FeedsHeader
              topic={topic}
              selectedSubtopics={selectedSubtopics}
              setSelectedSubtopics={setSelectedSubtopics}
            />
            {/* posts */}
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
