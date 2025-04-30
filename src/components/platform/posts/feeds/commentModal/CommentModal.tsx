/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./commentmodal.module.css";
import Image from "next/image";
import admin from "@/../public/auth/user.png";
import foot from "@/../public/logo/foot.png";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useInView } from "react-intersection-observer";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";
import { formatTimeDifference } from "./functions/CommentModal.data";

interface Author {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
}

interface Response {
  id: string;
  publicationId: string;
  content: string;
  mediaUrl: string | null;
  createdAt: string;
  author: Author;
  likeCount: string;
  dislikeCount: string;
  userReaction: string | null;
}

interface Reply {
  id: string;
  commentId: string;
  content: string;
  mediaUrl: string | null;
  createdAt: string;
  author: Author;
  likeCount: number;
  dislikeCount: number;
  userReaction: string | null;
}
type Props = {
  setCommentModal?: (value: boolean) => void;
  postComments: any;
  setPostComments?: any;
  setCommentsPage: (value: number) => void;
  commentsPage: number;
  repliesPage?: number;
  setRepliesPage?: (value: number) => void;
  rerender?: boolean;
  setRerender: (value: boolean) => void;
  postId?: string;
  postMedia?: any;
};
function PostComments(passProps: Props) {
  const accessToken = useAppSelector((state) => state.login.accessToken);

  const {
    setCommentModal,
    postComments,
    setCommentsPage,
    commentsPage,
    setPostComments,
    postId,
    postMedia,
  } = passProps;

  const modalRef = React.useRef<HTMLDivElement>(null);
  const preventScroll = (prevent: boolean) => {
    document.body.style.overflow = prevent ? "hidden" : "unset";
  };
  // POST SLIDER HANDLER
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
  // END SLIDER HANDLER

  // START CLICK OUTSIDE MODAL
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (setCommentModal) {
          setCommentModal(false);
          preventScroll(false); // Re-enable scrolling when modal closes
        }
      }
    };
    if (setCommentModal) {
      // Prevent scrolling when modal opens
      preventScroll(true);
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      preventScroll(false); // Re-enable scrolling when component unmounts
    };
  }, [modalRef, setCommentModal]);
  // END CLICK OUTSIDE MODAL
  ////////////////////////////
  //   PAGINATION
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const handlePages = React.useCallback(() => {
    setCommentsPage(postComments.length < 10 ? 1 : commentsPage + 1);
  }, [commentsPage]);

  React.useEffect(() => {
    if (inView) {
      handlePages();
    }
  }, [inView]);
  //   END PAGINATION
  //   ////////////////////////

  // REPLY COMMENT
  // State to track which comment's replies are open
  const [openReplies, setOpenReplies] = useState<{
    [commentId: string]: boolean;
  }>({});
  const [selectedReply, setSelectedReply] = useState<string>("");

  // Function to toggle replies visibility
  const toggleReplies = (commentId: string) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    setSelectedReply(commentId);
  };

  // Function to handle fetching replies
  const [postCommentReply, setPostCommentReply] = useState<{
    [key: string]: any[];
  }>({});

  const getReplies = async (postId: string, commentId: string) => {
    try {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postId}/comments/${commentId}/replies`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          setOpenReplies((prev) => ({
            [commentId]: prev[commentId],
          }));
          setPostCommentReply((prev) => ({
            ...prev,
            [commentId]: res.data,
          }));
          toggleReplies(commentId);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  // event get replies

  const getEventReplies = async (postId: string, commentId: string) => {
    try {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${postId}/comments/${commentId}/replies`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          setOpenReplies((prev) => ({
            [commentId]: prev[commentId],
          }));
          setPostCommentReply((prev) => ({
            ...prev,
            [commentId]: res.data,
          }));
          toggleReplies(commentId);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  // add comment and reply
  const {
    register: registerComment,
    handleSubmit: handleSubmitComment,
    reset: resetComment,
  } = useForm();
  const {
    register: registerReply,
    handleSubmit: handleSubmitReply,
    reset: resetReply,
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postId}/comment`,
          { content: data.comment },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        .then((res) => {
          const newComment = {
            ...res.data,
            likeCount: res.data.likeCount || "0", // Ensure likeCount is a string
            dislikeCount: res.data.dislikeCount || "0", // Ensure dislikeCount is a string
          };
          setPostComments((prev: Response[]) => [...prev, newComment]);
          // Initialize local like counts for the new comment
          setLocalLikeCounts((prev) => ({
            ...prev,
            [newComment.id]: parseInt(newComment.likeCount),
          }));
          // Initialize user reaction status
          setUserLikeStatus((prev) => ({
            ...prev,
            [newComment.id]: newComment.userReaction === "like",
          }));
        });

      resetComment();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };
  // event
  const onEvenctCommentSubmit = async (data: any) => {
    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${postId}/comment`,
          { content: data.comment },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        .then((res) => {
          const newComment = {
            ...res.data,
            likeCount: res.data.likeCount || "0", // Ensure likeCount is a string
            dislikeCount: res.data.dislikeCount || "0", // Ensure dislikeCount is a string
          };
          setPostComments((prev: Response[]) => [...prev, newComment]);
          // Initialize local like counts for the new comment
          setLocalLikeCounts((prev) => ({
            ...prev,
            [newComment.id]: parseInt(newComment.likeCount),
          }));
          // Initialize user reaction status
          setUserLikeStatus((prev) => ({
            ...prev,
            [newComment.id]: newComment.userReaction === "like",
          }));
        });

      resetComment();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };
  const onReplySubmit = (data: any) => {
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postComments[0].publicationId}/comments/${selectedReply}/reply`,
          {
            content: data.reply,
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
          setPostCommentReply((prev: { [key: string]: any[] }) => ({
            ...prev,
            [selectedReply]: [...(prev[selectedReply] || []), res.data],
          }));
        });
    } catch (err) {
      console.log(err);
    }

    resetReply();
  };
  // even reply
  const eventOnReplySubmit = (data: any) => {
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/${postComments[0].publicationId}/comments/${selectedReply}/reply`,
          {
            content: data.reply,
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
          setPostCommentReply((prev: { [key: string]: any[] }) => ({
            ...prev,
            [selectedReply]: [...(prev[selectedReply] || []), res.data],
          }));
        });
    } catch (err) {
      console.log(err);
    }

    resetReply();
  };

  // END add comment
  const [userLikeStatus, setUserLikeStatus] = useState<{
    [id: string]: boolean;
  }>({});

  // Track the accurate like counts
  const [localLikeCounts, setLocalLikeCounts] = useState<{
    [id: string]: number;
  }>({});

  // Initialize these states when comments/replies load
  useEffect(() => {
    // Initialize like status from API data
    if (postComments && postComments.length > 0) {
      const initialLikeStatus: { [id: string]: boolean } = {};
      const initialLikeCounts: { [id: string]: number } = {};

      postComments.forEach((comment: Response) => {
        initialLikeStatus[comment.id] = comment.userReaction === "like";
        initialLikeCounts[comment.id] = parseInt(comment.likeCount);
      });

      setUserLikeStatus(initialLikeStatus);
      setLocalLikeCounts(initialLikeCounts);
    }
  }, [postComments]);

  // Do the same for replies when they're loaded
  useEffect(() => {
    // For each comment ID that has replies
    Object.keys(postCommentReply).forEach((commentId) => {
      if (
        postCommentReply[commentId] &&
        postCommentReply[commentId].length > 0
      ) {
        const replies = postCommentReply[commentId];

        setUserLikeStatus((prev) => {
          const updated = { ...prev };
          replies.forEach((reply: Reply) => {
            updated[reply.id] = reply.userReaction === "like";
          });
          return updated;
        });

        setLocalLikeCounts((prev) => {
          const updated = { ...prev };
          replies.forEach((reply: Reply) => {
            updated[reply.id] = reply.likeCount;
          });
          return updated;
        });
      }
    });
  }, [postCommentReply]);
  // Function to toggle reactions
  const handleToggleReaction = ({
    commentId,
    postType,
    reactionType,
  }: {
    commentId: string;
    postType: string;
    reactionType: string;
  }) => {
    // Get current like status
    const isCurrentlyLiked = userLikeStatus[commentId] || false;

    // Calculate new like count (toggle once)
    const newLikeCount = isCurrentlyLiked
      ? (localLikeCounts[commentId] || 0) - 1
      : (localLikeCounts[commentId] || 0) + 1;

    // Update UI optimistically
    setUserLikeStatus((prev) => ({ ...prev, [commentId]: !isCurrentlyLiked }));
    setLocalLikeCounts((prev) => ({ ...prev, [commentId]: newLikeCount }));

    try {
      axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/reactions/toggle-reaction`,
        {
          reactionableType: postType,
          reactionableId: commentId,
          reactionType: reactionType,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  return {
    loaded,
    instanceRef,
    userLikeStatus,
    localLikeCounts,
    ref,
    handleToggleReaction,
    onReplySubmit,
    eventOnReplySubmit,
    postComments,
    postCommentReply,
    toggleReplies,
    openReplies,

    selectedReply,
    resetReply,
    resetComment,
    sliderRef,
    modalRef,
    currentSlide,
    getReplies,
    getEventReplies,
    handleSubmitReply,
    registerReply,
    handleSubmitComment,
    registerComment,
    onSubmit,
    onEvenctCommentSubmit,
    postMedia,
  };
}
export function CommentModal(props: Props) {
  const {
    loaded,
    instanceRef,
    ref,
    userLikeStatus,
    localLikeCounts,
    currentSlide,
    handleToggleReaction,
    onReplySubmit,
    postComments,
    postCommentReply,
    openReplies,
    sliderRef,
    modalRef,
    getReplies,
    handleSubmitReply,
    registerReply,
    handleSubmitComment,
    registerComment,
    onSubmit,
    postMedia,
  } = PostComments(props);

  console.log("postMedia", postMedia);

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontent}>
          <div className={styles.postImages}>
            {postMedia.length > 0 && (
              <div ref={sliderRef} className={`keen-slider`}>
                {postMedia.map((media: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`keen-slider__slide ${styles.postCard}`}
                    >
                      <div className={styles.image}>
                        <Image
                          src={media.mediaUrl}
                          alt="image"
                          loading="lazy"
                          width={1000}
                          height={1000}
                          className={styles.postImage}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {postMedia &&
              postMedia?.length > 0 &&
              loaded &&
              instanceRef.current && (
                <div className={styles.dots}>
                  {[
                    ...Array(
                      instanceRef.current.track.details.slides.length
                    ).keys(),
                  ].map((idx) => {
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          instanceRef.current?.moveToIdx(idx);
                        }}
                        className={` ${styles.dot} ${
                          currentSlide === idx ? styles.active : ""
                        }`}
                      ></button>
                    );
                  })}
                </div>
              )}
            {postMedia?.length === 0 && (
              <div className={styles.noMedia}>
                <Image
                  src={foot}
                  alt="image"
                  loading="lazy"
                  width={1000}
                  height={1000}
                  className={styles.postImage}
                />
              </div>
            )}
          </div>
          <div className={styles.commentsSection}>
            {postComments.length > 0 ? (
              postComments.map((comment: Response, index: number) => (
                <div
                  key={comment.id}
                  ref={index === postComments.length - 1 ? ref : null}
                  className={styles.comment}
                >
                  <div className={styles.mainCommentBody}>
                    <div className={styles.commentAvatar}>
                      <Image
                        src={
                          comment.author.avatar ? comment.author.avatar : admin
                        }
                        alt="avatar"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div className={styles.commentFooter}>
                      <div className={styles.upper}>
                        <p>
                          <span className={styles.username}>
                            {comment.author.username}
                          </span>
                          <span className={styles.commentText}>
                            {comment.content}
                          </span>
                        </p>
                      </div>
                      <div className={styles.lower}>
                        <p>{formatTimeDifference(comment.createdAt)}</p>
                        <p
                          style={{
                            color: userLikeStatus[comment.id]
                              ? "green"
                              : "#fff",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleToggleReaction({
                              commentId: comment.id,
                              postType: "comment",
                              reactionType: "like",
                            })
                          }
                        >
                          {localLikeCounts[comment.id] !== undefined
                            ? localLikeCounts[comment.id]
                            : parseInt(comment.likeCount)}{" "}
                          Like
                        </p>
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            getReplies(comment.publicationId, comment.id)
                          }
                        >
                          Reply
                        </p>
                      </div>
                    </div>
                  </div>
                  {openReplies[comment.id] &&
                  postCommentReply[comment.id]?.length > 0 ? (
                    <div key={Math.random()} className={styles.repliesSection}>
                      {postCommentReply[comment.id].map(
                        (reply: Reply, index: number) => (
                          <>
                            <div key={index} className={styles.reply}>
                              <div className={styles.replyAvatar}>
                                <Image
                                  src={
                                    reply.author.avatar
                                      ? reply.author.avatar
                                      : admin
                                  }
                                  alt="avatar"
                                  width={30}
                                  height={30}
                                />
                              </div>
                              <div className={styles.replyContent}>
                                <div className={styles.upper}>
                                  <p>
                                    <span className={styles.username}>
                                      {reply.author.fullName}
                                    </span>
                                    <span className={styles.commentText}>
                                      {reply.content}
                                    </span>
                                  </p>
                                </div>
                                <div className={styles.lower}>
                                  <p>
                                    {formatTimeDifference(comment.createdAt)}
                                  </p>
                                  <p
                                    style={{
                                      cursor: "pointer",
                                      color: userLikeStatus[reply.id]
                                        ? "green"
                                        : "#fff",
                                    }}
                                    onClick={() =>
                                      handleToggleReaction({
                                        commentId: reply.id,
                                        postType: "reply",
                                        reactionType: "like",
                                      })
                                    }
                                  >
                                    {localLikeCounts[reply.id] !== undefined
                                      ? localLikeCounts[reply.id]
                                      : reply.likeCount}{" "}
                                    Like
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      )}
                      <div className={styles.newReply}>
                        <div className={styles.newReplyContainer}>
                          <form onSubmit={handleSubmitReply(onReplySubmit)}>
                            <textarea
                              className={styles.commentTextArea}
                              placeholder="Add a reply"
                              {...registerReply("reply", {
                                required: true,
                              })}
                            />

                            <button type="submit">Add Reply</button>
                          </form>
                        </div>
                      </div>
                      {/*  */}
                    </div>
                  ) : (
                    openReplies[comment.id] &&
                    postCommentReply && (
                      <div className={styles.newReply}>
                        <div className={styles.newReplyContainer}>
                          <form onSubmit={handleSubmitReply(onReplySubmit)}>
                            <textarea
                              className={styles.commentTextArea}
                              placeholder="Add a reply"
                              {...registerReply("reply", { required: true })}
                            />

                            <button
                              onClick={() => {
                                console.log("clicked");
                              }}
                              type="submit"
                            >
                              Add Reply
                            </button>
                          </form>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))
            ) : (
              <div>
                <p>No comments yet</p>
              </div>
            )}
          </div>
          <div className={styles.newComment}>
            <div className={styles.newCommentContainer}>
              <form onSubmit={handleSubmitComment(onSubmit)}>
                <textarea
                  className={styles.commentTextArea}
                  placeholder="Add a comment"
                  {...registerComment("comment", { required: true })}
                />

                <button type="submit">Add Comments</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CommentSection(props: Props) {
  const {
    ref,
    userLikeStatus,
    localLikeCounts,
    handleToggleReaction,
    eventOnReplySubmit,
    postComments,
    postCommentReply,
    openReplies,
    getEventReplies,
    handleSubmitReply,
    registerReply,
    handleSubmitComment,
    registerComment,
    onEvenctCommentSubmit,
  } = PostComments(props);

  return (
    <>
      <div className={styles.Section}>
        <div className={styles.commentContent}>
          <div className={styles.commentsSection}>
            {postComments.length > 0 ? (
              postComments.map((comment: Response, index: number) => (
                <div
                  key={comment.id}
                  ref={index === postComments.length - 1 ? ref : null}
                  className={styles.comment}
                >
                  <div className={styles.mainCommentBody}>
                    <div className={styles.commentAvatar}>
                      <Image
                        src={
                          comment.author.avatar ? comment.author.avatar : admin
                        }
                        alt="avatar"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div className={styles.commentFooter}>
                      <div className={styles.upper}>
                        <p>
                          <span className={styles.username}>
                            {comment.author.username}
                          </span>
                          <span className={styles.commentText}>
                            {comment.content}
                          </span>
                        </p>
                      </div>
                      <div className={styles.lower}>
                        <p>{formatTimeDifference(comment.createdAt)}</p>
                        <p
                          style={{
                            color: userLikeStatus[comment.id]
                              ? "green"
                              : "#fff",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleToggleReaction({
                              commentId: comment.id,
                              postType: "comment",
                              reactionType: "like",
                            })
                          }
                        >
                          {localLikeCounts[comment.id] !== undefined
                            ? localLikeCounts[comment.id]
                            : parseInt(comment.likeCount)}{" "}
                          Like
                        </p>
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            getEventReplies(comment.publicationId, comment.id)
                          }
                        >
                          Reply
                        </p>
                      </div>
                    </div>
                  </div>
                  {openReplies[comment.id] &&
                  postCommentReply[comment.id]?.length > 0 ? (
                    <div key={Math.random()} className={styles.repliesSection}>
                      {postCommentReply[comment.id].map(
                        (reply: Reply, index: number) => (
                          <>
                            <div key={index} className={styles.reply}>
                              <div className={styles.replyAvatar}>
                                <Image
                                  src={
                                    reply.author.avatar
                                      ? reply.author.avatar
                                      : admin
                                  }
                                  alt="avatar"
                                  width={30}
                                  height={30}
                                />
                              </div>
                              <div className={styles.replyContent}>
                                <div className={styles.upper}>
                                  <p>
                                    <span className={styles.username}>
                                      {reply.author.fullName}
                                    </span>
                                    <span className={styles.commentText}>
                                      {reply.content}
                                    </span>
                                  </p>
                                </div>
                                <div className={styles.lower}>
                                  <p>
                                    {formatTimeDifference(comment.createdAt)}
                                  </p>
                                  <p
                                    style={{
                                      cursor: "pointer",
                                      color: userLikeStatus[reply.id]
                                        ? "green"
                                        : "#fff",
                                    }}
                                    onClick={() =>
                                      handleToggleReaction({
                                        commentId: reply.id,
                                        postType: "reply",
                                        reactionType: "like",
                                      })
                                    }
                                  >
                                    {localLikeCounts[reply.id] !== undefined
                                      ? localLikeCounts[reply.id]
                                      : reply.likeCount}{" "}
                                    Like
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      )}
                      <div className={styles.newReply}>
                        <div className={styles.newReplyContainer}>
                          <form
                            onSubmit={handleSubmitReply(eventOnReplySubmit)}
                          >
                            <textarea
                              className={styles.commentTextArea}
                              placeholder="Add a reply"
                              {...registerReply("reply", {
                                required: true,
                              })}
                            />

                            <button type="submit">Add Reply</button>
                          </form>
                        </div>
                      </div>
                      {/*  */}
                    </div>
                  ) : (
                    openReplies[comment.id] &&
                    postCommentReply && (
                      <div className={styles.newReply}>
                        <div className={styles.newReplyContainer}>
                          <form
                            onSubmit={handleSubmitReply(eventOnReplySubmit)}
                          >
                            <textarea
                              className={styles.commentTextArea}
                              placeholder="Add a reply"
                              {...registerReply("reply", { required: true })}
                            />

                            <button
                              onClick={() => {
                                console.log("clicked");
                              }}
                              type="submit"
                            >
                              Add Reply
                            </button>
                          </form>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))
            ) : (
              <div>
                <p>No comments yet</p>
              </div>
            )}
          </div>
          <div className={styles.newComment}>
            <div className={styles.newCommentContainer}>
              <form onSubmit={handleSubmitComment(onEvenctCommentSubmit)}>
                <textarea
                  className={styles.commentTextArea}
                  placeholder="Add a comment"
                  {...registerComment("comment", { required: true })}
                />

                <button type="submit">Add Comments</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export function PostCommentSection(props: Props) {
  const {
    ref,
    userLikeStatus,
    localLikeCounts,
    handleToggleReaction,
    onReplySubmit,
    postComments,
    postCommentReply,
    openReplies,
    getReplies,
    handleSubmitReply,
    registerReply,
    handleSubmitComment,
    registerComment,
    onSubmit,
  } = PostComments(props);

  return (
    <>
      <div className={styles.Section}>
        <div className={styles.commentContent}>
          <div className={styles.commentsSection}>
            {postComments.length > 0 ? (
              postComments.map((comment: Response, index: number) => (
                <div
                  key={comment.id}
                  ref={index === postComments.length - 1 ? ref : null}
                  className={styles.comment}
                >
                  <div className={styles.mainCommentBody}>
                    <div className={styles.commentAvatar}>
                      <Image
                        src={
                          comment.author.avatar ? comment.author.avatar : admin
                        }
                        alt="avatar"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div className={styles.commentFooter}>
                      <div className={styles.upper}>
                        <p>
                          <span className={styles.username}>
                            {comment.author.username}
                          </span>
                          <span className={styles.commentText}>
                            {comment.content}
                          </span>
                        </p>
                      </div>
                      <div className={styles.lower}>
                        <p>{formatTimeDifference(comment.createdAt)}</p>
                        <p
                          style={{
                            color: userLikeStatus[comment.id]
                              ? "green"
                              : "#fff",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleToggleReaction({
                              commentId: comment.id,
                              postType: "comment",
                              reactionType: "like",
                            })
                          }
                        >
                          {localLikeCounts[comment.id] !== undefined
                            ? localLikeCounts[comment.id]
                            : `${comment.likeCount}`}{" "}
                          Like
                        </p>
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            getReplies(comment.publicationId, comment.id)
                          }
                        >
                          Reply
                        </p>
                      </div>
                    </div>
                  </div>
                  {openReplies[comment.id] &&
                  postCommentReply[comment.id]?.length > 0 ? (
                    <div key={Math.random()} className={styles.repliesSection}>
                      {postCommentReply[comment.id].map(
                        (reply: Reply, index: number) => (
                          <>
                            <div key={index} className={styles.reply}>
                              <div className={styles.replyAvatar}>
                                <Image
                                  src={
                                    reply.author.avatar
                                      ? reply.author.avatar
                                      : admin
                                  }
                                  alt="avatar"
                                  width={30}
                                  height={30}
                                />
                              </div>
                              <div className={styles.replyContent}>
                                <div className={styles.upper}>
                                  <p>
                                    <span className={styles.username}>
                                      {reply.author.fullName}
                                    </span>
                                    <span className={styles.commentText}>
                                      {reply.content}
                                    </span>
                                  </p>
                                </div>
                                <div className={styles.lower}>
                                  <p>
                                    {formatTimeDifference(comment.createdAt)}
                                  </p>
                                  <p
                                    style={{
                                      cursor: "pointer",
                                      color: userLikeStatus[reply.id]
                                        ? "green"
                                        : "#fff",
                                    }}
                                    onClick={() =>
                                      handleToggleReaction({
                                        commentId: reply.id,
                                        postType: "reply",
                                        reactionType: "like",
                                      })
                                    }
                                  >
                                    {localLikeCounts[reply.id] !== undefined
                                      ? localLikeCounts[reply.id]
                                      : reply.likeCount}{" "}
                                    Like
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      )}
                      <div className={styles.newReply}>
                        <div className={styles.newReplyContainer}>
                          <form onSubmit={handleSubmitReply(onReplySubmit)}>
                            <textarea
                              className={styles.commentTextArea}
                              placeholder="Add a reply"
                              {...registerReply("reply", {
                                required: true,
                              })}
                            />

                            <button type="submit">Add Reply</button>
                          </form>
                        </div>
                      </div>
                      {/*  */}
                    </div>
                  ) : (
                    openReplies[comment.id] &&
                    postCommentReply && (
                      <div className={styles.newReply}>
                        <div className={styles.newReplyContainer}>
                          <form onSubmit={handleSubmitReply(onReplySubmit)}>
                            <textarea
                              className={styles.commentTextArea}
                              placeholder="Add a reply"
                              {...registerReply("reply", { required: true })}
                            />

                            <button
                              onClick={() => {
                                console.log("clicked");
                              }}
                              type="submit"
                            >
                              Add Reply
                            </button>
                          </form>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))
            ) : (
              <div>
                <p>No comments yet</p>
              </div>
            )}
          </div>
          <div className={styles.newComment}>
            <div className={styles.newCommentContainer}>
              <form onSubmit={handleSubmitComment(onSubmit)}>
                <textarea
                  className={styles.commentTextArea}
                  placeholder="Add a comment"
                  {...registerComment("comment", { required: true })}
                />

                <button type="submit">Add Comments</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
