"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "../postCard/PostCard";
import styles from "./FeedSection.module.css";
import DoItModal from "../../modals/toDo/DoItModal";
import { CommentModal } from "./commentModal/CommentModal";
import { Comment } from "./TYPES/FeedTypes";
import FeedsHeader from "./FeedHeader/FeedsHeader";
import { Topics } from "@/components/Assets/topics/Topics.data";
import ConfirmationModal from "@/components/platform/modals/confirmModal/ConfirmationModal"; // Import reusable modal
import ReportModal from "@/components/platform/modals/reportModal/ReportModal"; // Import reusable modal
import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

// topics and subtopics
const topics = Topics;

function FeedSection() {
  // Get search parameters from URL
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const subcategoryId = searchParams.get('subcategory');
  
  // References for scrolling to sections
  const topicRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement | null> }>({});

  // Define state variables
  //modals
  const [doItModal, setDoItModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Renamed for clarity
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // Renamed for clarity

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
  
  // Token for API calls
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  
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

  // Initialize refs for each topic
  useEffect(() => {
    topics.forEach(topic => {
      topicRefs.current[topic.id] = React.createRef();
    });
  }, []);

  // Handle URL parameters on component mount
  useEffect(() => {
    if (categoryId) {
      // If there's a category ID in the URL, find it in the topics
      const categoryIdNum = Number(categoryId);
      const foundTopic = topics.find(topic => topic.id === categoryIdNum);
      
      if (foundTopic) {
        // If subcategory is provided, select it
        if (subcategoryId) {
          setSelectedSubtopics(prev => ({
            ...prev,
            [categoryIdNum]: subcategoryId
          }));
        }
        
        // Scroll to the section after a short delay to ensure rendering
        setTimeout(() => {
          if (topicRefs.current[categoryIdNum]?.current) {
            topicRefs.current[categoryIdNum].current?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start' 
            });
          }
        }, 300);
      }
    }
  }, [categoryId, subcategoryId]);
  
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
        {topics.map((topic, index) => (
          <div 
            key={index} 
            className={styles.container}
            ref={topicRefs.current[topic.id]}
            id={`topic-${topic.id}`}
          >
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
                  deleteModal={isDeleteModalOpen}
                  setDeleteModal={setIsDeleteModalOpen}
                  reportModal={isReportModalOpen}
                  setReportModal={setIsReportModalOpen}
                />
              </div>
            </div>
          </div>
        ))}
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