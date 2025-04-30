"use client";
import React, {
  useEffect,
  lazy,
  Suspense,
  useState,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import styles from "./PostForum.module.css";
import { useQueryClient } from "@tanstack/react-query";

import LoadingTree from "@/components/zaLoader/LoadingTree";
import { getToken } from "@/Utils/userToken/LocalToken";
import ForumFilter from "./filterComponent/ForumFilter";
import { CommentModal } from "../feeds/commentModal/CommentModal";
import toRight from "@/../public/ZPLATFORM/A-iconsAndBtns/ToRights.svg";
import Image from "next/image";
import DeleteModal from "./deleteModal/DeleteModal";
import Report from "./reportModal/Report";
const ForumCard = lazy(() => import("./ForumsCard/ForumCard"));

type Author = {
  id: string;
  fullName: string;
  avatar: string | null;
  username: string;
};
type media = {
  id: string;
  mediaUrl: string;
  mediaType: "image";
};

type Post = {
  id: string;
  headline: string;
  content: string;
  mediaUrl: string | null;
  createdAt: string;
  author: Author;
  media: media[];
  commentCount: number;
  userReaction: "like" | "dislike" | "sign" | null;
  dislikeCount: number;
  section: string;
  likeCount: number;
  signCount: number;
};

function PostForums() {
  const localeS = getToken();
  const accessToken = localeS ? localeS.accessToken : null;
  const queryClient = useQueryClient();

  const [forums, setForums] = useState<Post[]>([]);
  // Modals and state
  const [commentModal, setCommentModal] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [postId, setPostId] = useState<string>("");
  const [commentsPage, setCommentsPage] = useState(1);
  const [rerender, setRerender] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  const [section, setSection] = useState<"doubt" | "need" | "dream" | "all">(
    "all"
  );
  const limit = 5;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [endOfResults, setEndOfResults] = useState(false);

  // Refs and scroll state
  const bodyRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Handle section change properly
  const handleSectionChange = (
    newSection: "doubt" | "need" | "dream" | "all"
  ) => {
    if (newSection !== section) {
      setForums([]);
      setSection(newSection);
      setPage(1);
      setHasMore(true);
      setEndOfResults(false);

      // Reset scroll position when changing sections
      if (bodyRef.current) {
        bodyRef.current.scrollLeft = 0;
      }

      // Invalidate queries to force a refetch with new section
      queryClient.invalidateQueries({
        queryKey: ["forums", newSection, 1, limit],
      });
    }
  };

  // Fetch forums data
  const fetchForums = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        // Use different loading state for initial vs pagination loading
        if (replace) {
          setIsLoading(true);
          setEndOfResults(false);
        } else {
          setIsPaginationLoading(true);
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/forum?limit=${limit}&${
            section === "all" ? "" : `section=${section}`
          }&page=${pageNum}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

        const data = response.data;

        // Check if we've reached the end of available forums
        if (data.length < limit) {
          setHasMore(false);
          if (data.length === 0 && pageNum > 1) {
            setEndOfResults(true);
          }
        } else {
          setHasMore(true);
        }

        setForums((prev) => {
          if (replace) {
            return data;
          }
          return [...prev, ...data];
        });

        return data;
      } catch (error) {
        console.error("Failed to fetch forums:", error);
        setErrorMessage("An Error Occurred");
        throw error;
      } finally {
        setIsLoading(false);
        setIsPaginationLoading(false);
      }
    },
    [section, limit, accessToken]
  );

  // Initial load and section change handler
  useEffect(() => {
    fetchForums(1, true);
  }, [section, fetchForums]);

  // Load more forums when page changes
  useEffect(() => {
    if (page > 1) {
      fetchForums(page, false);
    }
  }, [page, fetchForums]);

  // Scroll event handler for infinite scrolling and scroll button state
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading || isPaginationLoading)
      return;

    const container = bodyRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Update scroll button states
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);

    // Load more when user has scrolled to 80% of the content
    if (scrollLeft + clientWidth >= scrollWidth * 0.8) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoading, isPaginationLoading]);

  // Add scroll event listener
  useEffect(() => {
    const currentRef = bodyRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);

      // Initial scroll state check
      const scrollWidth = currentRef.scrollWidth;
      const clientWidth = currentRef.clientWidth;
      setCanScrollRight(scrollWidth > clientWidth);

      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  // Manual scroll handlers for arrow buttons
  const handleManualScroll = (direction: "left" | "right") => {
    if (!bodyRef.current) return;

    bodyRef.current.scrollBy({
      left: direction === "left" ? -300 : +300,
      behavior: "smooth",
    });
  };

  // Render loading state
  const renderLoading = () => {
    return (
      <div className={styles.noPosts}>
        <LoadingTree />
      </div>
    );
  };

  // Render content based on state
  const renderContent = () => {
    if (isLoading && forums.length === 0) {
      return renderLoading();
    }

    if (errorMessage && forums.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (forums.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>No posts found</p>
        </div>
      );
    }

    return (
      <>
        <Suspense fallback={renderLoading()}>
          {forums.map((post: Post, index: number) => (
            <div key={`${post.id}-${index}`} className={styles.postContainer}>
              <ForumCard
                section={section}
                post={post}
                index={index}
                page={page}
                setPage={setPage}
                length={forums.length}
                commentPage={commentsPage}
                setCommentPage={setCommentsPage}
                setCommentModal={setCommentModal}
                setPostComments={setPostComments}
                setPostId={setPostId}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                reportModal={reportModal}
                setReportModal={setReportModal}
              />
            </div>
          ))}

          {/* Pagination loading indicator */}
          {isPaginationLoading && (
            <div className={styles.loadingMore}>
              <LoadingTree />
            </div>
          )}

          {/* End of results message */}
          {endOfResults && (
            <div className={styles.endOfResults}>
              <p>No more posts to show</p>
            </div>
          )}

          {/* Message when there are no more posts but not showing loading */}
          {!hasMore &&
            !isPaginationLoading &&
            !endOfResults &&
            forums.length > 0 && (
              <div className={styles.endOfResults}>
                <p>{`You've reached the end of the posts`}</p>
              </div>
            )}
        </Suspense>
      </>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <ForumFilter
          section={section}
          setPage={setPage}
          setSection={handleSectionChange}
        />
        <div className={styles.body}>
          {forums.length > 0 && (
            <div className={styles.sliderBtns}>
              <div
                className={`${styles.arrow} ${
                  !canScrollLeft ? styles.disabled : ""
                }`}
                onClick={() => handleManualScroll("left")}
              >
                <Image
                  src={toRight}
                  alt="left arrow"
                  width={100}
                  height={100}
                  style={{ transform: "rotateY(180deg)" }}
                />
              </div>
              <div
                className={`${styles.arrow} ${
                  !canScrollRight ? styles.disabled : ""
                }`}
                onClick={() => handleManualScroll("right")}
              >
                <Image
                  src={toRight}
                  alt="right arrow"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          )}
          <div ref={bodyRef} className={styles.content}>
            {renderContent()}
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
          postMedia={forums.find((post) => post.id === postId)?.media || []}
        />
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
          reportedType="forum_publication"
        />
      )}
    </>
  );
}

export default PostForums;
