"use client";
import React, { useState } from "react";
import PostCard from "../postCard/PostCard";
import styles from "./FeedSection.module.css";

import DoItModal from "../../../modals/toDo/DoItModal";
import { CommentModal } from "./commentModal/CommentModal";
import { Comment } from "./TYPES/FeedTypes";
import { Topics } from "@/components/Assets/topics/Topics.data";
import { FaComment } from "react-icons/fa6";
import {useTranslations} from "next-intl"

// topics and subtopics
const topics = Topics;

function FeedSection() {
  // Define state variables
    const t = useTranslations("web.header.topics");
  
  //modals
  const [doItModal, setDoItModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
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

  const [selectedTopics, setSelectedTopics] = useState(0);

  return (
    <>
      <div className={styles.feeds}>
        <div className={styles.topicHeader}>
        <h2 className={styles.topicTitle}><span><FaComment/> </span> Comments</h2>
        <div className={styles.topicFilter}>
                  <p
                    style={{
                      color: selectedTopics === 0 ? "#97B00F" : "#FEFEFE99",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedTopics(0)}
                  >
                    {t("all")}
                  </p>
                  {topics.map((topic, index) => (
                    <p
                      key={index}
                      style={{
                        color: selectedTopics === topic.id ? "#97B00F" : "#FEFEFE99",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedTopics(topic.id)}
                    >
                      {t(topic.name)}
                    </p>
                  ))}
                </div>
                </div>

        <div className={styles.container}>
          {/* Header */}

          {/* posts */}
          <div className={styles.posts}>
            <div className={styles.postContainer}>
              <PostCard
                commentsPage={commentsPage}
                setCommentsPage={setCommentsPage}
                rerender={rerender}
                mainTopic={selectedTopics}
                setDoItModal={setDoItModal}
                setCommentModal={setCommentModal}
                setPostComments={setPostComments}
                setPostId={setPostId}
                setPostMedia={setPostMedia}
              />
            </div>
          </div>
        </div>
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
    </>
  );
}

export default FeedSection;
