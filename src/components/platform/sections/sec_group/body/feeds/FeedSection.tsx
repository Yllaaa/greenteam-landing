"use client";
import React, { useEffect, useState } from "react";
import PostCard from "../postCard/PostCard";
import styles from "./FeedSection.module.css";

import DoItModal from "../../../../modals/toDo/DoItModal";
import { CommentModal } from "./commentModal/CommentModal";
import { Comment } from "./TYPES/FeedTypes";

import { useParams } from "next/navigation";
import AddNewModal from "./modal/addNew/AddNewModal";
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
    </>
  );
}

export default FeedSection;
