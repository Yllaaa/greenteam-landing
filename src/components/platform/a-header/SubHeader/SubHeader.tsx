"use client";
import React from "react";
import styles from "./SubHeader.module.css";

import SubHeaderWeb from "./Body/Web/SubHeaderWeb";
import SubHeaderRes from "./Body/Responsive/SubHeaderRes";
import { CommentModal } from "@/components/platform/posts/feeds/commentModal/CommentModal";
function SubHeader() {
  const [commentModal, setCommentModal] = React.useState(false);
  const [postComments, setPostComments] = React.useState([]);
  const [postId, setPostId] = React.useState("");
  const [commentPage, setCommentPage] = React.useState(1);
  const [repliesPage, setRepliesPage] = React.useState(1);
  const [rerender, setRerender] = React.useState(false);

  return (
    <>
      {/* web */}
      <div className={styles.container}>
        <SubHeaderWeb
          commentModal={commentModal}
          setCommentModal={setCommentModal}
          postComments={postComments}
          setPostComments={setPostComments}
          postId={postId}
          setCommentPage={setCommentPage}
          commentPage={commentPage}
          setRepliesPage={setRepliesPage}
          repliesPage={repliesPage}
          setRerender={setRerender}
          rerender={rerender}
          setPostId={setPostId}
        />
      </div>
      {/* responsive */}
      <div className={styles.ResponsiveContainer}>
        <SubHeaderRes
          commentModal={commentModal}
          setCommentModal={setCommentModal}
          postComments={postComments}
          setPostComments={setPostComments}
          postId={postId}
          setCommentPage={setCommentPage}
          commentPage={commentPage}
          setRepliesPage={setRepliesPage}
          repliesPage={repliesPage}
          setRerender={setRerender}
          rerender={rerender}
          setPostId={setPostId}
        />
      </div>
      {commentModal && (
        <CommentModal
          setCommentModal={setCommentModal}
          postComments={postComments}
          setPostComments={setPostComments}
          postId={postId}
          setCommentsPage={setCommentPage}
          commentsPage={commentPage}
          setRepliesPage={setRepliesPage}
          repliesPage={repliesPage}
          setRerender={setRerender}
          rerender={rerender}
        />
      )}
    </>
  );
}

export default SubHeader;
