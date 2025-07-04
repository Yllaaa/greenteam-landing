"use client";
import React, { useEffect, useState } from "react";
import PostCard from "../postCard/PostCard";
import styles from "./FeedSection.module.css";

import { CommentModal } from "./commentModal/CommentModal";
import { Comment } from "./TYPES/FeedTypes";
import DeleteModal from "./deleteModal/DeleteModal";

function FeedSection() {
  const [mounted, setMouted] = useState(false);
  useEffect(() => {
    if (window !== undefined) {
      setMouted(true);
    }
  }, []);
  // Define state variables
  //modals

  const [commentModal, setCommentModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
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
                  setCommentModal={setCommentModal}
                  setPostComments={setPostComments}
                  setPostId={setPostId}
                  setPostMedia={setPostMedia}
                  deleteModal={deleteModal}
                  setDeleteModal={setDeleteModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}

export default FeedSection;
