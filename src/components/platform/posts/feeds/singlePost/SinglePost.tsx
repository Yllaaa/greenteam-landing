/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./singlePost.module.css";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useRouter } from "next/navigation";
import Image from "next/image";
import admin from "@/../public/auth/user.png";
import { useLocale, useTranslations } from "next-intl";
import { PostWithDetails } from "./types/singlePosttype.data";
import { PostCommentSection } from "../commentModal/CommentModal";
import { ReactionType } from "../../postCard/POSTSLIDER/types/postSlider.data";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaCheckSquare } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";
import attached from "@/../public/ZPLATFORM/post/attach.jpg";
import foot from "@/../public/logo/foot.png";
import linkifyText from "@/Utils/textFormatting/linkify";
import linkifyStyles from "@/Utils/textFormatting/linkify.module.css";

type Props = {
  postId: string;
};

function SinglePost(props: Props) {
  const localS = getToken();
  const accessToken = localS ? localS.accessToken : null;
  const locale = useLocale();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  //pagination
  const [commentsPage, setCommentsPage] = useState(1);
  //APIs Data
  const [postComments, setPostComments] = useState<Comment[]>([]);

  // request rerender comments
  const [rerender, setRerender] = useState(false);
  const { postId } = props;

  const [post, setPost] = React.useState<PostWithDetails>();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setIsMounted(true);
        console.log(response.data);
        setPost(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [postId, accessToken]);

  const formatTimeDifference = useCallback(
    (targetDate: string): string => {
      if (!isMounted) return "";

      const target = new Date(targetDate);
      const now = new Date();
      const differenceInMs = now.getTime() - target.getTime();
      const differenceInSeconds = Math.floor(differenceInMs / 1000);

      if (differenceInSeconds < 60) {
        return `${differenceInSeconds}S`;
      } else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes}m`;
      } else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours}hr`;
      } else {
        const days = Math.floor(differenceInSeconds / 86400);
        return `${days}D`;
      }
    },
    [isMounted]
  );

  // Navigate to profile helper
  const navigateToProfile = useCallback(
    (authorId: string, type: string) => {
      if (type === "user") {
        router.push(`/${locale}/profile/${authorId}`);
      } else if (type === "page") {
        router.push(`/${locale}/pages/${authorId}`);
      } else {
        router.push(`/${locale}/profile/${authorId}`);
      }
    },
    [router, locale]
  );

  const t = useTranslations("web.main.feeds");
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [userDisliked, setUserDisliked] = useState<boolean>(false);
  const [userDo, setUserDo] = useState<boolean>(false);

  useEffect(() => {
    if (post && isMounted) {
      setLikeCount(parseInt(post?.likeCount));
      setDislikeCount(parseInt(post?.dislikeCount));
      setUserLiked(post?.userReactionType === "like");
      setUserDisliked(post?.userReactionType === "dislike");
      setUserDo(post?.hasDoReaction);
    }
  }, [isMounted, post]);

  useEffect(() => {
    if (post) {
      setLikeCount(parseInt(post.likeCount));
      setDislikeCount(parseInt(post.dislikeCount));
    }
  }, [post]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKENDAPI;

  // Handle reaction API calls
  const handleToggleReaction = useCallback(
    async (reactionType: ReactionType) => {
      if (!accessToken) return;

      try {
        await axios
          .post(
            `${API_BASE_URL}/api/v1/posts/reactions/toggle-reaction`,
            {
              reactionableType: "post",
              reactionableId: postId,
              reactionType,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "Access-Control-Allow-Origin": "*",
              },
            }
          )
          .then((res) => {
            console.log(res.data);
          });
      } catch (error) {
        console.error("Error toggling reaction:", error);
        if (post)
          if (reactionType === "like") {
            setUserLiked(post?.userReactionType === "like");
            setLikeCount(parseInt(post.likeCount) || 0);
          } else if (reactionType === "dislike") {
            setUserDisliked(post?.userReactionType === "dislike");
            setDislikeCount(parseInt(post.dislikeCount) || 0);
          } else if (reactionType === "do") {
            setUserDo(post?.hasDoReaction);
          }
      }
    },
    [accessToken, API_BASE_URL, postId, post]
  );

  // Handle like button click with optimistic UI update
  const handleLike = () => {
    handleToggleReaction("like");
    if (userLiked) {
      setLikeCount((prevCount) => Math.max(0, prevCount - 1));
      setUserLiked(false);
    } else if (userDisliked) {
      setDislikeCount((prevCount) => Math.max(0, prevCount - 1));
      setLikeCount((prevCount) => prevCount + 1);
      setUserDisliked(false);
      setUserLiked(true);
    } else {
      setLikeCount((prevCount) => prevCount + 1);
      setUserLiked(true);
    }
  };

  // Handle dislike button click with optimistic UI update
  const handleDislike = () => {
    handleToggleReaction("dislike");
    if (userDisliked) {
      setDislikeCount((prevCount) => Math.max(0, prevCount - 1));
      setUserDisliked(false);
    } else if (userLiked) {
      setLikeCount((prevCount) => Math.max(0, prevCount - 1));
      setDislikeCount((prevCount) => prevCount + 1);
      setUserLiked(false);
      setUserDisliked(true);
    } else {
      setDislikeCount((prevCount) => prevCount + 1);
      setUserDisliked(true);
    }
  };

  // Handle do button click with optimistic UI update
  const handleDo = () => {
    handleToggleReaction("do");
    if (userDo) {
      setUserDo(false);
    } else {
      setUserDo(true);
    }
  };

  // get comments
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postId}/comments?page=${commentsPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setPostComments(res.data);
      })
      .catch((err) => console.log(err));
  }, [postId, commentsPage, accessToken]);

  const uniqueImages = post?.media.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  const [fullscreenImage, setFullscreenImage] = useState(null);
  const openFullscreen = (media: any) => {
    setFullscreenImage(media);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = "auto";
  };

  const downloadPdf = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <>
      {post && (
        <div className={styles.container}>
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
                className={styles.avatarImage}
              />
            </div>
            <div className={styles.details}>
              <div
                onClick={() =>
                  navigateToProfile(post.author.username, post.author.type)
                }
                className={styles.userName}
              >
                <p>
                  <span className={styles.fullName}>
                    {post.author.fullName || post.author.username}
                  </span>
                  <span className={styles.usernameTime}>
                    @{post.author.username} · {formatTimeDifference(post.post.createdAt)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.postContent}>
            <p>{linkifyText(post.post.content, {
              className: linkifyStyles['content-link'],
              target: "_blank",
            })}</p>
          </div>

          {post.media.length > 0 && (
            <div className={styles.postImages}>
              <div
                className={
                  uniqueImages?.length === 1
                    ? styles.singleGrid
                    : uniqueImages?.length === 2
                      ? styles.doubleGrid
                      : styles.grid
                }
              >
                {uniqueImages &&
                  uniqueImages.map((media) => (
                    <div key={media.id} className={styles.imageWrapper}>
                      <Image
                        src={
                          media.mediaType === "image"
                            ? media.mediaUrl
                            : media.mediaType === "document"
                              ? attached
                              : foot
                        }
                        alt="Post Media"
                        width={300}
                        height={300}
                        loading="lazy"
                        className={styles.image}
                        onClick={() =>
                          media.mediaType === "image"
                            ? openFullscreen(media.mediaUrl)
                            : media.mediaType === "document"
                              ? downloadPdf(media.mediaUrl)
                              : null
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Fullscreen overlay */}
          <div
            className={`${styles.fullscreenOverlay} ${fullscreenImage ? styles.active : ""}`}
            onClick={closeFullscreen}
          >
            {fullscreenImage && (
              <>
                <Image
                  src={fullscreenImage}
                  alt="Fullscreen Media"
                  width={1200}
                  height={1200}
                  className={styles.fullscreenImage}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className={styles.closeButton}
                  onClick={closeFullscreen}
                  aria-label="Close fullscreen"
                >
                  ✕
                </button>
              </>
            )}
          </div>

          <div className={styles.reactionBtns}>
            <button
              className={styles.btn}
              onClick={handleDo}
              aria-label="Do It"
            >
              <FaCheckSquare style={{ fill: userDo ? "#006633" : "#97B00F" }} />
              <span className={styles.btnText}>{t("do")}</span>
            </button>

            <button
              className={styles.btn}
              onClick={handleLike}
              aria-label="Like"
            >
              <AiFillLike style={{ fill: userLiked ? "#006633" : "#97B00F" }} />
              <span className={styles.btnText}>{likeCount || 0}</span>
            </button>

            <button
              onClick={handleDislike}
              className={styles.btn}
              aria-label="Unlike"
            >
              <AiFillDislike
                style={{ fill: userDisliked ? "#006633" : "#97B00F" }}
              />
              <span className={styles.btnText}>{dislikeCount || 0}</span>
            </button>

            <button className={styles.btn} aria-label="Comment">
              <FaComment style={{ fill: "#97B00F" }} />
              <span className={styles.btnText}>{post.commentCount || 0}</span>
            </button>
          </div>

          <div className={styles.postComments}>
            {postId && (
              <PostCommentSection
                commentsPage={commentsPage}
                setCommentsPage={setCommentsPage}
                postComments={postComments}
                rerender={rerender}
                setRerender={setRerender}
                setPostComments={setPostComments}
                postId={postId}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SinglePost;