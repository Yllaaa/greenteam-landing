/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./ForumCard.module.css";
import Image from "next/image";
import dream from "@/../public/ZPLATFORM/forum/dreem.png";
import need from "@/../public/ZPLATFORM/forum/need.png";
import question from "@/../public/ZPLATFORM/forum/question.png";
import comment from "@/../public/ZPLATFORM/post/comment.svg";
import { useInView } from "react-intersection-observer";
import { FaCameraRetro } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import axios from "axios";
import { ReactionType } from "../../postCard/POSTSLIDER/types/postSlider.data";
import { getToken } from "@/Utils/userToken/LocalToken";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { FaCheckSquare } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

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

type Discussion = {
  post: {
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
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  section: string;
  index: number;
  length: number;
  commentPage: number;
  setCommentPage: Dispatch<SetStateAction<number>>;
  setPostId: Dispatch<SetStateAction<string>>;
  setCommentModal: Dispatch<SetStateAction<boolean>>;
  setPostComments: Dispatch<SetStateAction<Comment[]>>;
  // Add these for options menu functionality
  setDeleteModal?: Dispatch<SetStateAction<boolean>>;
  deleteModal?: boolean;
  setReportModal?: Dispatch<SetStateAction<boolean>>;
  reportModal?: boolean;
  isAuthor?: boolean;
  onActionSelect?: (postId: string, type: "delete" | "report") => void;
};

function ForumCard(props: Discussion) {
  const token = getToken();
  const user = useAppSelector((state) => state.login.user?.user)?.id;
  const accessToken = token ? token.accessToken : null;
  const {
    post,
    setPage,
    page,
    index,
    length,
    setPostId,
    setCommentModal,
    setPostComments,
    commentPage,
    setCommentPage,
    setDeleteModal,
    // deleteModal,
    setReportModal,
    // reportModal,
    isAuthor = post.author.id === user, // Default check for author
    onActionSelect
  } = props;

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const [commentSection, setCommentSection] = React.useState("");
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the options menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setOptionsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOptionsMenu = () => {
    setOptionsMenuOpen(!optionsMenuOpen);
  };

  const handleAction = (actionType: 'delete' | 'report') => {
    if (onActionSelect) {
      onActionSelect(post.id, actionType);
    } else {
      // Fallback to original implementation if onActionSelect not provided
      if (actionType === 'delete' && setDeleteModal) {
        setPostId(post.id);
        setDeleteModal(true);
      } else if (actionType === 'report' && setReportModal) {
        setPostId(post.id);
        setReportModal(true);
      }
    }
    setOptionsMenuOpen(false); // Close the menu after action
  };

  const handlePages = React.useCallback(() => {
    setPage(length < 5 ? 1 : page + 1);
  }, [page]);

  React.useEffect(() => {
    if (inView) {
      handlePages();
    }
  }, [inView]);

  //
  // Static state for like/dislike UI
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [dislikeCount, setDislikeCount] = useState(post.dislikeCount);

  const [userSignCount, setUserSignCount] = useState(post.signCount);
  const [userLiked, setUserLiked] = useState(post.userReaction === "like");
  const [userDisliked, setUserDisliked] = useState(
    post.userReaction === "dislike"
  );
  const [userSigned, setUserSigned] = useState(post.userReaction === "sign");
  // API base URL constant
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKENDAPI;

  // Fetch comments with error handling and loading state
  const fetchComments = useCallback(
    async (postId: string, page: number) => {
      const limit = 10;
      if (!accessToken || !postId || !setPostComments) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/posts/${postId}/comments?page=${page}&limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

        setPostComments((prev: any) => {
          if (page === 1) return response.data;
          return [...prev, ...response.data];
        });

        return response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
    },
    [API_BASE_URL, accessToken, setPostComments]
  );

  // Load comments when page changes
  useEffect(() => {
    if (commentPage > 1) {
      fetchComments(post.id, commentPage);
    }
  }, [commentPage, post.id, fetchComments]);

  // Handle comment button click
  const handleComment = async (postId: string) => {
    if (!setPostId || !setCommentModal || !setPostComments) return;
    setPostComments([]);
    setPostId(postId);
    setCommentPage(1);

    try {
      const comments = await fetchComments(postId, 1);
      if (comments) {
        setCommentModal(true);
      }
    } catch (error) {
      console.error("Error handling comment:", error);
    }
  };

  // Handle reaction API calls
  const handleToggleReaction = useCallback(
    async (reactionType: ReactionType) => {
      if (!accessToken) return;

      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/forum/reactions/toggle-reaction`,
          {
            reactionableType: "forum_publication",
            reactionableId: post.id,
            reactionType,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } catch (error) {
        console.error("Error toggling reaction:", error);
        // Revert UI state on error
        if (reactionType === "like") {
          setUserLiked(post.userReaction === "like");
          setLikeCount(post.likeCount || 0);
        } else if (reactionType === "dislike") {
          setUserDisliked(post.userReaction === "dislike");
          setDislikeCount(post.dislikeCount || 0);
        } else if (reactionType === "sign") {
          setUserSigned(post.userReaction === "sign");
          setUserSignCount(post.signCount || 0);
        }
      }
    },
    [
      accessToken,
      API_BASE_URL,
      post.id,
      post.userReaction,
      post.likeCount,
      post.dislikeCount,
      post.signCount,
    ]
  );

  // Handle like button click with optimistic UI update
  const handleLike = () => {
    handleToggleReaction("like");
    // If already liked, remove like
    if (userLiked) {
      setLikeCount((prevCount) => Math.max(0, prevCount - 1));
      setUserLiked(false);
    }
    // If disliked, remove dislike and add like
    else if (userDisliked) {
      setDislikeCount((prevCount) => Math.max(0, prevCount - 1));
      setLikeCount((prevCount) => prevCount + 1);
      setUserDisliked(false);
      setUserLiked(true);
    }
    // Otherwise, add like
    else {
      setLikeCount((prevCount) => prevCount + 1);
      setUserLiked(true);
    }
  };

  // Handle dislike button click with optimistic UI update
  const handleDislike = () => {
    handleToggleReaction("dislike");
    // If already disliked, remove dislike
    if (userDisliked) {
      setDislikeCount((prevCount) => Math.max(0, prevCount - 1));
      setUserDisliked(false);
    }
    // If liked, remove like and add dislike
    else if (userLiked) {
      setLikeCount((prevCount) => Math.max(0, prevCount - 1));
      setDislikeCount((prevCount) => prevCount + 1);
      setUserLiked(false);
      setUserDisliked(true);
    }
    // Otherwise, add dislike
    else {
      setDislikeCount((prevCount) => prevCount + 1);
      setUserDisliked(true);
    }
  };
  // /////////////////
  // Handle sign button click with optimistic UI update
  const handleSign = () => {
    handleToggleReaction("sign");
    // If already signed, remove sign
    if (userSigned) {
      setUserSignCount((prevCount) => Math.max(0, prevCount - 1));
      setUserSigned(false);
    }
    // Otherwise, add sign
    else {
      setUserSignCount((prevCount) => Math.max(0, prevCount + 1));
      setUserSigned(true);
    }
  };
  const router = useRouter()
  const locale = useLocale()
  const navigateToProfile = () => {
    if (post.author.username) {
      router.push(`/${locale}/profile/${post.author.username}`);
    }
  }

  return (
    <>
      <div
        ref={index === length - 1 ? ref : null}
        key={index}
        className={styles.container}
      >
        <div className={styles.options}>
          <div
            onClick={toggleOptionsMenu}
            className={styles.optionsIcon}
          >
            <PiDotsThreeCircleLight fill="#006633" />
          </div>

          {optionsMenuOpen && (
            <div ref={optionsMenuRef} className={styles.optionsMenu}>
              {isAuthor && (
                <div
                  onClick={() => handleAction('delete')}
                  className={styles.optionItem}
                >
                  <FaTrash /> <span>Delete Post</span>
                </div>
              )}
              <div
                onClick={() => handleAction('report')}
                className={styles.optionItem}
              >
                <MdOutlineReportProblem /> <span>Report Post</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.header}>
          <div className={styles.user}>
            <div className={styles.avatar}>
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt="image"
                  loading="lazy"
                  width={400}
                  height={300}
                />
              ) : (
                <div className={styles.noAvatar}></div>
              )}
            </div>
            <div className={styles.data}>
              <div className={styles.username}>
                <p onClick={navigateToProfile} style={{ cursor: "pointer" }}>{post.author.username}</p> {" . "}
                {/* <span>Add friend</span> */}
              </div>
              <div className={styles.job}>{post.author.fullName}</div>
            </div>
          </div>
          <div className={styles.logo}>
            <Image
              src={
                post.section === "need"
                  ? need
                  : post.section === "dream"
                    ? dream
                    : question
              }
              alt="image"
              loading="lazy"
              width={400}
              height={300}
            />
          </div>
        </div>
        <div className={styles.scrollable}>
          <div className={styles.body}>
            <div className={styles.title}>{post.headline}</div>
            <div className={styles.post}>{post.content}</div>
          </div>

          {post.media.length > 0 && post.media[0].mediaUrl && (
            <div className={styles.image}>
              <Image
                src={post.media[0].mediaUrl}
                alt="Post image"
                layout="responsive"
                width={400}
                height={300}
                loading="lazy"
                objectFit="cover"
              />
            </div>
          )}
        </div>
        <div className={styles.reactionBtns}>
          {post.section === "need" && (
            <div className={styles.btn} onClick={handleSign}>
              <FaCheckSquare
                style={{ fill: userSigned ? "#006633" : "#97B00F" }}
              />

              <p>
                <span>{userSignCount} Sign</span>
              </p>
            </div>
          )}
          {post.section !== "need" && (
            <div className={styles.btn} onClick={handleLike}>
              <AiFillLike style={{ fill: userLiked ? "#006633" : "#97B00F" }} />
              <p data-count={likeCount}>
                <span>{likeCount} Like</span>
              </p>
            </div>
          )}
          <div className={styles.btn} onClick={handleDislike}>
            <AiFillDislike
              style={{ fill: userDisliked ? "#006633" : "#97B00F" }}
            />
            <p>
              <span>{dislikeCount} Unlike</span>
            </p>
          </div>
          <div
            onClick={() => {
              handleComment(post.id);
            }}
            className={styles.btn}
          >
            <Image src={comment} alt="comment" />
            <p>
              <span>{post.commentCount} Comment</span>
            </p>
          </div>
        </div>

        <div
          id={post.id}
          className={`${commentSection === post.id
            ? styles.showCommentSection
            : styles.hideCommentSection
            } ${styles.commentSection}`}
        >
          <div className={styles.commentContainer}>
            <p
              onClick={() => setCommentSection("")}
              style={{ cursor: "pointer" }}
            >
              X
            </p>
            <div className={styles.currentComments}></div>
            <div className={styles.newComment}>
              <textarea
                className={styles.commentTextArea}
                placeholder={"newComment"}
              // onChange={(e) => setNewComment(e.target.value)}
              />
              <div className={styles.addImage}>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                // onChange={(e) => setNewCommentImage(e.target.files[0])}
                />
                <label htmlFor="image">
                  <FaCameraRetro />
                </label>
              </div>
              <button className={styles.commentBtn}>Comment</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForumCard;