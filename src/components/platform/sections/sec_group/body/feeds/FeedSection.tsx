"use client";
import React, { useCallback, useEffect, useState } from "react";
import PostCard from "../postCard/PostCard";
import styles from "./FeedSection.module.css";
import DoItModal from "../../../../modals/toDo/DoItModal";
import { CommentModal } from "./commentModal/CommentModal";
import { Comment } from "./TYPES/FeedTypes";
import { useParams } from "next/navigation";
import AddNewModal from "./modal/addNew/AddNewModal";
import ConfirmationModal from "@/components/platform/modals/confirmModal/ConfirmationModal";
import ReportModal from "@/components/platform/modals/reportModal/ReportModal";
import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function FeedSection() {
  const params = useParams();
  const id = params && params.pageId;

  const [mounted, setMounted] = useState(false);

  // Token for API calls
  const token = getToken();
  const accessToken = token ? token.accessToken : null;

  useEffect(() => {
    if (window !== undefined) {
      setMounted(true);
    }
  }, []);

  // Define state variables
  //modals
  const [doItModal, setDoItModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [addNewPost, setAddNewPost] = useState(false);

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

  // Handler for deleting posts
  const handleDeletePost = useCallback(async () => {
    if (!postId || !accessToken) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        ToastNot("Post deleted successfully");
        // Trigger a rerender to refresh the post list
        setRerender(prev => !prev);
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      ToastNot("Error occurred while deleting post");
    }
  }, [postId, accessToken]);

  // Handle successful report submission
  const handleReportSuccess = useCallback(() => {
    ToastNot("Thank you for your report. Our team will review it.");
  }, []);

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
                  deleteModal={isDeleteModalOpen}
                  setDeleteModal={setIsDeleteModalOpen}
                  reportModal={isReportModalOpen}
                  setReportModal={setIsReportModalOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      {/* Enhanced Delete Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => setRerender(prev => !prev)}
        title="Are you sure you want to delete this post?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        customAction={handleDeletePost}
        successMessage="Post deleted successfully"
        errorMessage="Error occurred while deleting post"
      />

      {/* Enhanced Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedId={postId}
        reportedType="post"
        title="Tell us why you're reporting this post"
        successCallback={handleReportSuccess}
      />
    </>
  );
}

export default FeedSection;