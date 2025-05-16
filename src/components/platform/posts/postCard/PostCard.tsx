"use client";
import React, {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import styles from "./postCard.module.css";
import Image from "next/image";
import admin from "@/../public/auth/user.png";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { getToken } from "@/Utils/userToken/LocalToken";
import { PostsData, Props } from "./types/postTypes.data";
import { fetchPosts } from "./functions/postFunc.data";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaTrash } from "react-icons/fa6";
import { MdOutlineReportProblem } from "react-icons/md";
import { PiDotsThreeCircleLight } from "react-icons/pi";

const PostSlider = lazy(() => import("./POSTSLIDER/PostSlider"));

const LoadingState = () => (
  <div className={styles.postContainer}>
    <div className={styles.body}>
      <div className={styles.noPosts}>
        <LoadingTree />
      </div>
    </div>
  </div>
);

function PostCard(props: Props) {
  const {
    commentsPage,
    setCommentsPage,
    setDoItModal,
    mainTopic,
    subTopic,
    setCommentModal,
    setPostComments,
    rerender,
    setPostId,
    setPostMedia,
    deleteModal,
    setDeleteModal,
    reportModal,
    setReportModal,
  } = props;

  const router = useRouter();
  const locale = useLocale();

  // State management
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [postContent, setPostContent] = useState<PostsData>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeOptionsPost, setActiveOptionsPost] = useState<string | null>(null);

  // Refs
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const limit = 5;

  // Click outside handler for options menu
  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setActiveOptionsPost(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMounted]);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Token management
  const accessToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    const localS = getToken();
    return localS ? localS.accessToken : null;
  }, []);

  // Scroll handlers
  const prevSlide = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, []);

  // Options menu handlers
  const toggleOptionsMenu = useCallback((postId: string) => {
    setActiveOptionsPost((prev) => (prev === postId ? null : postId));
  }, []);

  const handleActionDelete = useCallback(
    (postId: string) => {
      if (setDeleteModal && setPostId) {
        setPostId(postId);
        setDeleteModal(!deleteModal);
      }
      setActiveOptionsPost(null);
    },
    [deleteModal, setDeleteModal, setPostId]
  );

  const handleActionReport = useCallback(
    (postId: string) => {
      if (setReportModal && setPostId) {
        setPostId(postId);
        setReportModal(!reportModal);
      }
      setActiveOptionsPost(null);
    },
    [reportModal, setPostId, setReportModal]
  );

  // Data fetching
  useEffect(() => {
    if (!isMounted || !mainTopic) {
      if (!mainTopic) setIsLoading(false);
      return;
    }

    fetchPosts(
      subTopic,
      mainTopic,
      page,
      limit,
      setPostContent,
      setErrorMessage,
      accessToken,
      setIsLoading
    );
  }, [subTopic, page, mainTopic, isMounted, accessToken]);

  // Infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const handlePages = useCallback(() => {
    setPage((prevPage) => (postContent.length < 4 ? 1 : prevPage + 1));
  }, [postContent.length]);

  useEffect(() => {
    if (inView && isMounted) {
      handlePages();
    }
  }, [inView, handlePages, isMounted]);

  // Time formatter
  const formatTimeDifference = useCallback(
    (targetDate: string): string => {
      if (!isMounted) return "";

      const target = new Date(targetDate);
      const now = new Date();
      const differenceInMs = now.getTime() - target.getTime();
      const differenceInSeconds = Math.floor(differenceInMs / 1000);

      if (differenceInSeconds < 60) return `${differenceInSeconds}S`;
      if (differenceInSeconds < 3600) return `${Math.floor(differenceInSeconds / 60)}m`;
      if (differenceInSeconds < 86400) return `${Math.floor(differenceInSeconds / 3600)}hr`;
      return `${Math.floor(differenceInSeconds / 86400)}D`;
    },
    [isMounted]
  );

  // Navigation handlers
  const navigateToProfile = useCallback(
    (authorId: string, type: string) => {
      const path = type === "page" ? "pages" : "profile";
      router.push(`/${locale}/${path}/${authorId}`);
    },
    [router, locale]
  );

  const navigateToPost = useCallback(
    (postId: string) => {
      router.push(`/${locale}/feeds/posts/${postId}`);
    },
    [router, locale]
  );

  // Content renderer
  const renderPostContent = useMemo(() => {
    if (!isMounted || isLoading) {
      return <LoadingState />;
    }

    if (errorMessage) {
      return (
        <div className={styles.noPosts}>
          <p>Error Loading posts</p>
        </div>
      );
    }

    if (postContent.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>No posts found</p>
        </div>
      );
    }

    return (
      <Suspense fallback={<LoadingState />}>
        {postContent.map((post, index) => (
          <div
            key={post.post.id}
            ref={index === postContent.length - 1 ? ref : null}
            className={styles.container}
          >
            {/* Post content structure */}
            <div className={styles.options}>
              <div
                onClick={() => toggleOptionsMenu(post.post.id)}
                className={styles.optionsIcon}
                aria-label="Post options"
              >
                <PiDotsThreeCircleLight />
              </div>

              {activeOptionsPost === post.post.id && (
                <div ref={optionsMenuRef} className={styles.optionsMenu}>
                  {post.isAuthor && (
                    <div
                      onClick={() => handleActionDelete(post.post.id)}
                      className={`${styles.optionItem} ${styles.deleteOption}`}
                    >
                      <FaTrash className={styles.deleteIcon} />
                      <span>Delete Post</span>
                    </div>
                  )}
                  <div
                    onClick={() => handleActionReport(post.post.id)}
                    className={`${styles.optionItem} ${styles.reportOption}`}
                  >
                    <MdOutlineReportProblem className={styles.reportIcon} />
                    <span>Report Post</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.header}>
              <div
                onClick={() =>
                  navigateToProfile(post.author.username, post.author.type)
                }
                className={styles.userAvatar}
              >
                <Image
                  src={post.author.avatar || admin}
                  alt={`${post.author.username}'s avatar`}
                  width={40}
                  height={40}
                  priority={index < 3}
                />
              </div>

              <div className={styles.details}>
                <div
                  onClick={() =>
                    navigateToProfile(post.author.username, post.author.type)
                  }
                  className={styles.userName}
                  style={{ cursor: "pointer" }}
                >
                  <p>
                    {post.author.name || post.author.username} <span>@{post.author.username}</span>
                    <span> . {formatTimeDifference(post.post.createdAt)}</span>
                  </p>
                </div>

                {post.media.length > 0 && (
                  <div
                    onClick={() => navigateToPost(post.post.id)}
                    className={styles.post}
                  >
                    {post.post.content.length > 50 ? (
                      <p>
                        {post.post.content.slice(0, 40)}{" "}
                        <span>Read More... </span>
                      </p>
                    ) : (
                      <p>{post.post.content}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.media}>
              <div className={styles.postslider}>
                <PostSlider
                  media={post.media}
                  content={post.post.content}
                  commentPage={commentsPage}
                  setCommentPage={setCommentsPage}
                  likes={post.likeCount}
                  dislikes={post.dislikeCount}
                  comments={post.commentCount}
                  userReactionType={post.userReactionType}
                  hasDoReaction={post.hasDoReaction}
                  setDoItModal={setDoItModal}
                  setCommentModal={setCommentModal}
                  setPostComments={setPostComments}
                  postId={post.post.id}
                  rerender={rerender}
                  setPostId={setPostId}
                  setPostMedia={setPostMedia}
                />
              </div>
            </div>
          </div>
        ))}
      </Suspense>
    );
  }, [
    isMounted,
    isLoading,
    errorMessage,
    postContent,
    activeOptionsPost,
    commentsPage,
    setCommentsPage,
    setDoItModal,
    setCommentModal,
    setPostComments,
    rerender,
    setPostId,
    setPostMedia,
    ref,
    formatTimeDifference,
    navigateToProfile,
    navigateToPost,
    toggleOptionsMenu,
    handleActionDelete,
    handleActionReport,
  ]);

  // Initial server-side render
  if (!isMounted) {
    return <LoadingState />;
  }

  return (
    <div className={styles.postContainer}>
      {isMounted && (
        <div className={styles.sliderBtns}>
          <div className={styles.arrow} onClick={prevSlide}>
            <IoIosArrowBack />
          </div>
          <div className={styles.arrow} onClick={nextSlide}>
            <IoIosArrowForward />
          </div>
        </div>
      )}
      <div ref={bodyRef} className={styles.body}>
        {renderPostContent}
      </div>
    </div>
  );
}

export default React.memo(PostCard);