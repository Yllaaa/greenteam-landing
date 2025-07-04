"use client";
import React, { useEffect, useState } from "react";
import PostCard from "../postCard/PostCard";
import styles from "./FeedSection.module.css";

import { CommentModal } from "./commentModal/CommentModal";
import { Comment } from "./TYPES/FeedTypes";

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
    </>
  );
}

export default FeedSection;
