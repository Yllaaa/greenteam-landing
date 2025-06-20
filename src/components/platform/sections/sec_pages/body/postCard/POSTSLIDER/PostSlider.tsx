/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import styles from "./PostSlider.module.css";
import Image from "next/image";
import { FaCheckSquare } from "react-icons/fa";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa6";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useLocale } from "next-intl";
import { ReactionType, Props } from "./types/postSlider.data";
import { useAppDispatch } from "@/store/hooks";
import { setUpdateState } from "@/store/features/update/updateSlice";
import attached from "@/../public/ZPLATFORM/post/attach.jpg";
import foot from "@/../public/logo/foot.png";
import { useTranslations } from "next-intl";
// Define better types for better type safety

function PostSlider(props: Props) {
  const router = useRouter();
  const locale = useLocale();
  const {
    media,
    content,
    commentPage,
    setCommentPage,
    setCommentModal,
    setPostComments,
    likes,
    comments,
    dislikes,
    userReactionType,
    hasDoReaction,
    postId,
    setPostId,
    setPostMedia,
  } = props;
  const t = useTranslations("web.main.feeds");
  const localS = getToken();
  const accessToken = localS ? localS.accessToken : null;

  // slider handler
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slides: { perView: 1 },

    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  const navigateToPost = useCallback(
    (postId: string) => {
      router.push(`/${locale}/feeds/posts/${postId}`);
    },
    [router, locale]
  );

  // Static state for like/dislike UI
  const [likeCount, setLikeCount] = useState(parseInt(likes));
  const [dislikeCount, setDislikeCount] = useState(parseInt(dislikes));
  const [userLiked, setUserLiked] = useState(userReactionType === "like");
  const [userDisliked, setUserDisliked] = useState(
    userReactionType === "dislike"
  );
  const [userDo, setUserDo] = useState(hasDoReaction);
  // API base URL constant
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKENDAPI;

  const uniqueMedia = useMemo(
    () =>
      media && media.length > 0
        ? media.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        )
        : [],
    [media]
  );
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
        setPostMedia(uniqueMedia);
        return response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
    },
    [API_BASE_URL, accessToken, setPostComments, setPostMedia, uniqueMedia]
  );

  // Load comments when page changes
  useEffect(() => {
    if (commentPage > 1) {
      fetchComments(postId, commentPage);
    }
  }, [commentPage, postId, fetchComments]);

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
        );
      } catch (error) {
        console.error("Error toggling reaction:", error);
        // Revert UI state on error
        if (reactionType === "like") {
          setUserLiked(userReactionType === "like");
          setLikeCount(parseInt(likes) || 0);
        } else if (reactionType === "dislike") {
          setUserDisliked(userReactionType === "dislike");
          setDislikeCount(parseInt(dislikes) || 0);
        } else if (reactionType === "do") {
          setUserDo(hasDoReaction);
        }
      }
    },
    [
      accessToken,
      API_BASE_URL,
      postId,
      userReactionType,
      likes,
      dislikes,
      hasDoReaction,
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
  // Handle dislike button click with optimistic UI update
  const dispatch = useAppDispatch();

  const handleDo = () => {
    dispatch(setUpdateState());
    handleToggleReaction("do");
    // If already do
    if (hasDoReaction) {
      setUserDo(!userDo);
    }
    // If liked, remove do
    else if (userDo) {
      setUserDo(false);
    }
    // Otherwise, add do
    else {
      setUserDo(true);
    }
  };
  /////////////////
  // Navigate to full post
  const handleNavigatePost = (postId: string) => {
    router.push(`/${locale}/feeds/posts/${postId}`);
  };

  // Filter out duplicate media entries by ID

  // Render media slider or text content
  const renderContent = () => {
    if (uniqueMedia.length > 0) {
      return (
        <div className={styles.navigationWrapper}>
          <div ref={sliderRef} className="keen-slider">
            {uniqueMedia.map((imageUrl, index) => (
              <div
                key={imageUrl.id || index}
                className={`keen-slider__slide ${styles.postCard}`}
              >
                <div className={styles.image}>
                  <div className={styles.overlay}></div>
                  <Image
                    src={
                      imageUrl.mediaType === "image"
                        ? imageUrl.mediaUrl
                        : imageUrl.mediaType === "document"
                          ? attached
                          : foot
                    }
                    alt={`Post image ${index + 1}`}
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className={styles.postImage}
                  />
                </div>
              </div>
            ))}
          </div>

          {loaded && instanceRef.current && uniqueMedia.length > 1 && (
            <div className={styles.dots}>
              {[
                ...Array(
                  instanceRef.current.track.details.slides.length
                ).keys(),
              ].map((idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`${styles.dot} ${currentSlide === idx ? styles.active : ""
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div onClick={() => navigateToPost(postId)} className={styles.textPost}>
        <p>
          {content.slice(0, 100)}
          {content.length > 100 && (
            <span
              onClick={() => handleNavigatePost(postId)}
              className={styles.readMore}
            >
              {" "}{t("readMore")}
            </span>
          )}
        </p>
      </div>
    );
  };

  // Render reaction buttons
  const renderReactionButtons = () => (
    <div className={styles.reactionBtns}>
      <button onClick={handleDo} className={styles.btn} aria-label="Do It">
        <FaCheckSquare style={{ fill: userDo ? "#006633" : "#97B00F" }} />
        <p>
          <span>{t("do")}</span>
        </p>
      </button>

      <button className={styles.btn} onClick={handleLike} aria-label="Like">
        <AiFillLike style={{ fill: userLiked ? "#006633" : "#97B00F" }} />
        <p>
          <span>
            {likeCount} {likeCount !== 1 ? "s" : ""}
          </span>
        </p>
      </button>

      <button
        onClick={handleDislike}
        className={styles.btn}
        aria-label="Unlike"
      >
        <AiFillDislike style={{ fill: userDisliked ? "#006633" : "#97B00F" }} />
        <p>
          <span>
            {dislikeCount} {dislikeCount !== 1 ? "s" : ""}
          </span>
        </p>
      </button>

      <button
        onClick={() => handleComment(postId)}
        className={styles.btn}
        aria-label="Comment"
      >
        <FaComment style={{ fill: "#97B00F" }} />
        <p>
          <span>
            {comments}
          </span>
        </p>
      </button>
    </div>
  );

  return (
    <>
      {renderContent()}
      {renderReactionButtons()}
    </>
  );
}

export default PostSlider;
