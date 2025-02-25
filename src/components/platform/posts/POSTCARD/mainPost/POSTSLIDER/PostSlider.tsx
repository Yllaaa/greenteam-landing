/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import styles from "./PostSlider.module.css";
import Image from "next/image";
import foot from "@/../public/goals/9af82d040ad31191bd7b42312d18fff3.jpeg";
import { FaCheckSquare } from "react-icons/fa";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa6";
import axios from "axios";

type Props = {
  setDoItModal?: (value: boolean) => void;
  setCommentModal?: any;
  setPostComments?: any;
  likes: string;
  comments: string;
  dislikes: string;
  postId: string;
  userReactionType: any;
  hasDoReaction: boolean;
  commentPage: number;
  setCommentPage: (value: number) => void;
  rerender: boolean;
  setPostId?: any;
};
function PostSlider(props: Props) {
  const {
    commentPage,
    setDoItModal,
    setCommentModal,
    setPostComments,
    likes,
    comments,
    dislikes,
    userReactionType,
    hasDoReaction,
    postId,
    setPostId,
  } = props;

  const localS = localStorage.getItem("user");
  const accessToken = localS ? JSON.parse(localS).accessToken : null;

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

  const localeS = localStorage.getItem("user");
  const userInfo = localeS ? JSON.parse(localeS) : null;

  //get comments
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postId}/comments?page=${commentPage}&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setPostComments((prev: any) => {
          if (res.data.length >= 0 && commentPage === 1) {
            return res.data;
          } else if (res.data.length >= 0 && commentPage > 1) {
            return [...prev, ...res.data];
          }
        });
      });
  }, [commentPage, postId]);
  const handleComment = () => {
    setPostId(postId);
    try {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postId}/comments?page=${commentPage}&limit=10`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          setPostComments(res.data);
        })
        .then(() => {
          setCommentModal(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  // toggle reaction
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  const [currentAction, setCurrentAction] = useState<{
    [commentId: string]: string;
  }>({});

  const [reactedLike, setReactedLike] = useState<{
    [commentId: string]: string;
  }>({});
  const [reactedDislike, setReactedDislike] = useState<{
    [commentId: string]: string;
  }>({});
  // const [reactedDo, setReactedDo] = useState<{
  //   [commentId: string]: string;
  // }>({});

  useEffect(() => {
    if (userReactionType !== null) {
      setReactedLike((prev) => ({
        ...prev,
        [postId]: userReactionType,
      }));
      setReactedDislike((prev) => ({
        ...prev,
        [postId]: userReactionType,
      }));
    }
  }, []);

  const handleToggleReaction = ({
    postId,
    postType,
    reactionType,
  }: {
    postId: string;
    postType: string;
    reactionType: string;
  }) => {
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/reactions/toggle-reaction`,
          {
            reactionableType: postType,
            reactionableId: postId,
            reactionType: reactionType,
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

          if (res.data.action === "updated") {
            setCurrentAction((prev) => ({
              ...prev,
              [postId]: res.data.action,
            }));
            if (reactionType === "like") {
              setReactedLike((prev) => ({
                ...prev,
                [postId]: reactionType,
              }));
              setReactedDislike((prev) => ({
                ...prev,
                [postId]: "",
              }));
            } else if (reactionType === "dislike") {
              setReactedDislike((prev) => ({
                ...prev,
                [postId]: reactionType,
              }));
              setReactedLike((prev) => ({
                ...prev,
                [postId]: "",
              }));
            }
          } else {
            if (res.data.action === "added") {
              setCurrentAction((prev) => ({
                ...prev,
                [postId]: res.data.action,
              }));
              if (reactionType === "like") {
                setReactedLike((prev) => ({
                  ...prev,
                  [postId]: reactionType,
                }));
                setReactedDislike((prev) => ({
                  ...prev,
                  [postId]: "",
                }));
              } else if (reactionType === "dislike") {
                setReactedDislike((prev) => ({
                  ...prev,
                  [postId]: reactionType,
                }));
                setReactedLike((prev) => ({
                  ...prev,
                  [postId]: "",
                }));
              }
            } else if (res.data.action === "removed") {
              setCurrentAction((prev) => ({
                ...prev,
                [postId]: res.data.action,
              }));
              if (reactionType === "like") {
                setReactedLike((prev) => ({
                  ...prev,
                  [postId]: "",
                }));
              } else if (reactionType === "dislike") {
                setReactedDislike((prev) => ({
                  ...prev,
                  [postId]: "",
                }));
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  // toggle reaction
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  return (
    <>
      {
        <>
          <div className={`${styles.navigationWrapper}`}>
            <div ref={sliderRef} className={`keen-slider`}>
              <div className={`keen-slider__slide ${styles.postCard}`}>
                <div className={styles.image}>
                  <div className={styles.overlay}></div>
                  <Image
                    src={foot}
                    alt="image"
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className={styles.postImage}
                  />
                </div>
              </div>

              <div className={`keen-slider__slide ${styles.postCard}`}>
                <div className={styles.image}>
                  <div className={styles.overlay}></div>
                  <Image
                    src={foot}
                    alt="image"
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className={styles.postImage}
                  />
                </div>
              </div>
              <div className={`keen-slider__slide ${styles.postCard}`}>
                <div className={styles.image}>
                  <div className={styles.overlay}></div>
                  <Image
                    src={foot}
                    alt="image"
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className={styles.postImage}
                  />
                </div>
              </div>
              <div className={`keen-slider__slide ${styles.postCard}`}>
                <div className={styles.image}>
                  <div className={styles.overlay}></div>
                  <Image
                    src={foot}
                    alt="image"
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className={styles.postImage}
                  />
                </div>
              </div>
            </div>

            {loaded && instanceRef.current && (
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
          </div>
          <div className={styles.reactionBtns}>
            <div
              onClick={() => setDoItModal && setDoItModal(true)}
              className={styles.btn}
            >
              <FaCheckSquare
                style={
                  hasDoReaction ? { fill: "#006633" } : { fill: "#97B00F" }
                }
              />

              <p>
                <span>Do</span>
              </p>
            </div>
            <div
              className={styles.btn}
              onClick={() => {
                handleToggleReaction({
                  postId: postId,
                  postType: "post",
                  reactionType: "like",
                });
                console.log(reactedLike[postId]);
              }}
            >
              <AiFillLike
                style={
                  reactedLike[postId] === "like"
                    ? { fill: "#006633" }
                    : reactedLike[postId] !== "like"
                    ? { fill: "#97B00F" }
                    : { fill: "#006633" }
                }
              />

              <p>
                <span>
                  {userReactionType === reactedLike[postId]
                    ? Number(likes)
                    : reactedLike[postId] === "like" &&
                      currentAction[postId] === "added"
                    ? Number(likes) + 1
                    : reactedLike[postId] === "like" &&
                      currentAction[postId] === "removed"
                    ? Number(likes) > 0
                      ? Number(likes) - 1
                      : 0
                    : reactedLike[postId] === "like" &&
                      currentAction[postId] === "updated"
                    ? Number(likes) + 1
                    : reactedLike[postId] !== "like" &&
                      currentAction[postId] === "removed"
                    ? Number(likes) > 0
                      ? Number(likes) - 1
                      : 0
                    : reactedLike[postId] !== "like" &&
                      currentAction[postId] === "updated"
                    ? Number(likes) > 0
                      ? Number(likes) - 1
                      : 0
                    : Number(likes)}
                  Like
                </span>
              </p>
            </div>
            <div
              onClick={() =>
                handleToggleReaction({
                  postId: postId,
                  postType: "post",
                  reactionType: "dislike",
                })
              }
              className={styles.btn}
            >
              <AiFillDislike
                style={
                  reactedDislike[postId] === "dislike"
                    ? { fill: "#006633" }
                    : reactedDislike[postId] !== "dislike"
                    ? { fill: "#97B00F" }
                    : { fill: "#006633" }
                }
              />
              <p>
                <span>
                  {userReactionType === reactedDislike[postId]
                    ? Number(dislikes)
                    : reactedDislike[postId] === "dislike" &&
                      currentAction[postId] === "added"
                    ? Number(dislikes) + 1
                    : reactedDislike[postId] === "dislike" &&
                      currentAction[postId] === "removed"
                    ? Number(dislikes) > 0
                      ? Number(dislikes) - 1
                      : 0
                    : reactedDislike[postId] === "dislike" &&
                      currentAction[postId] === "updated"
                    ? Number(dislikes) + 1
                    : reactedDislike[postId] !== "dislike" &&
                      currentAction[postId] === "removed"
                    ? Number(dislikes) > 0
                      ? Number(dislikes) - 1
                      : 0
                    : reactedDislike[postId] !== "dislike" &&
                      currentAction[postId] === "updated"
                    ? Number(dislikes) > 0
                      ? Number(dislikes) - 1
                      : 0
                    : Number(dislikes)}
                  Unlike
                </span>
              </p>
            </div>
            <div onClick={() => handleComment()} className={styles.btn}>
              <FaComment
                style={
                  userReactionType === "like"
                    ? { fill: "#006633" }
                    : { fill: "#97B00F" }
                }
              />
              <p>
                <span>{comments} Comment</span>
              </p>
            </div>
          </div>
        </>
      }
    </>
  );
}

export default PostSlider;
