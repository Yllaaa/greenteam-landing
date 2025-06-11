/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import PostCard from "../postCard/PostCard";
import styles from "./FeedSection.module.css";

import DoItModal from "../../../../modals/toDo/DoItModal";
import { CommentModal } from "./commentModal/CommentModal";
import { Comment } from "./TYPES/FeedTypes";
import FeedsHeader from "./FeedHeader/FeedsHeader";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { getSinglePageItems, PageItem } from "../../header/header.data";
import AddNewModal from "./modal/addNew/AddNewModal";
import DeleteModal from "./deleteModal/DeleteModal";
import Report from "./reportModal/Report";
// import { getAccessToken } from "@/Utils/backendEndpoints/backend-requests";

// topics and subtopics

function FeedSection() {
  const locale = useLocale();
  const params = useParams();
  const slug = params.pageId;
  const [pageItem, setPageItem] = useState<PageItem>({} as PageItem);
  const [topic, setTopic] = useState<any>();
  const [mounted, setMouted] = useState(false);
  useEffect(() => {
    if (typeof slug === "string") {
      getSinglePageItems(slug, locale).then((res) => {
        setPageItem(res);
      });
    }
  }, [slug, locale]);
  useEffect(() => {
    if (pageItem.id) {
      console.log(pageItem);

      setTopic(pageItem.topic);
      setMouted(true);
    }
  }, [pageItem]);

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

  const [addNewPost, setAddNewPost] = useState(false);

  return (
    <>
      <div className={styles.feeds}>
        {/* {topics.map((topic, index) => ( */}
        <div className={styles.container}>
          {/* Header */}
          {mounted && (
            <FeedsHeader
              topic={topic}
              selectedSubtopics={selectedSubtopics}
              setSelectedSubtopics={setSelectedSubtopics}
              addNewPost={addNewPost}
              setAddNewPost={setAddNewPost}
            />
          )}
          {/* posts */}
          <div className={styles.posts}>
            <div className={styles.postContainer}>
              {mounted && (
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
              )}
            </div>
          </div>
        </div>
        {/* ))} */}
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
      {addNewPost && (
        <AddNewModal
          setAddNew={setAddNewPost}
          addNew={addNewPost}
          slug={slug}

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
