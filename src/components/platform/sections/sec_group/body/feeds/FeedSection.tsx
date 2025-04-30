"use client";
import React, { useEffect, useState } from "react";
import PostCard from "../postCard/PostCard";
import styles from "./FeedSection.module.css";

import DoItModal from "../../../../modals/toDo/DoItModal";
import { CommentModal } from "./commentModal/CommentModal";
import { Comment } from "./TYPES/FeedTypes";

import { useParams } from "next/navigation";
import AddNewModal from "./modal/addNew/AddNewModal";
import DeleteModal from "./deleteModal/DeleteModal";
import Report from "./reportModal/Report";
// import { getAccessToken } from "@/Utils/backendEndpoints/backend-requests";

// topics and subtopics

function FeedSection() {
  const params = useParams();
  const id = params.pageId;

  const [mounted, setMouted] = useState(false);
  useEffect(() => {
    if (window !== undefined) {
      setMouted(true);
    }
  }, []);
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

  const [addNewPost, setAddNewPost] = useState(false);

  return (
    <>
      <div className={styles.feeds}>
        <div className={styles.container}>
          {/* posts */}
          <div className={styles.posts}>
            <div className={styles.postContainer}>
              {mounted && (
                <PostCard
                  commentsPage={commentsPage}
                  setCommentsPage={setCommentsPage}
                  rerender={rerender}
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
        <AddNewModal setAddNew={setAddNewPost} addNew={addNewPost} id={id} />
      )}
      {deleteModal && (
        <DeleteModal postId={postId} setDoItModal={setDeleteModal} />
      )}
      {reportModal && (
        <Report
          report={reportModal}
          user=""
          reportedId={postId}
          setReport={setReportModal}
          reportedType="post"
        />
      )}
    </>
  );
}

export default FeedSection;
