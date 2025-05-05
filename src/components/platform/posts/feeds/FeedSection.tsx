"use client";
import React, { useState } from "react";
import PostCard from "../postCard/PostCard";
import styles from "./FeedSection.module.css";

import DoItModal from "../../modals/toDo/DoItModal";
import { CommentModal } from "./commentModal/CommentModal";
import { Comment } from "./TYPES/FeedTypes";
import FeedsHeader from "./FeedHeader/FeedsHeader";
import { Topics } from "@/components/Assets/topics/Topics.data";
import DeleteModal from "./deleteModal/DeleteModal";
import Report from "./reportModal/Report";

// topics and subtopics
const topics = Topics;

function FeedSection() {
  // Define state variables
  //modals
  const [doItModal, setDoItModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  //APIs Data

  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [postId, setPostId] = useState<string>("");
  const [postMedia, setPostMedia] = useState<
    {
      id: string;
      mediaUrl: string;
      mediaType: string;
    }[]
  >([]);

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
                  setPostMedia={setPostMedia}
                  deleteModal={deleteModal}
                  setDeleteModal={setDeleteModal}
                  reportModal={reportModal}
                  setReportModal={setReportModal}
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
          postMedia={postMedia}
        />
      )}
      {deleteModal && (
        <DeleteModal postId={postId} setDoItModal={setDeleteModal} />
      )}
      {reportModal && (
        <Report report={reportModal} user="" reportedId={postId} setReport={setReportModal} reportedType="post" />
      )}
    </>
  );
}

export default FeedSection;
