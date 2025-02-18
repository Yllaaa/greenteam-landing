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
  userReactionType: string | null;
  hasDoReaction: boolean;
  commentPage: number;
  setCommentPage: (value: number) => void;
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
  } = props;
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
        console.log(res.data);
        setPostComments((prev: any) => {
          if (res.data.length >= 0 && commentPage === 1) {
            return res.data;
          } else if (res.data.length >= 0 && commentPage > 1) {
            return [...prev, ...res.data];
          }
        });
      });
  }, [commentPage, setPostComments]);
  const handleComment = () => {
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
          setPostComments((prev: any) => {
            if (res.data.length >= 0 && commentPage === 1) {
              return res.data;
            } else if (res.data.length >= 0 && commentPage > 1) {
              return [...prev, ...res.data];
            }
          });

          console.log(res.data);
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
            <div className={styles.btn}>
              <AiFillLike
                style={
                  userReactionType === "like"
                    ? { fill: "#006633" }
                    : { fill: "#97B00F" }
                }
              />

              <p>
                <span>{likes} Like</span>
              </p>
            </div>
            <div
              style={
                userReactionType === "dislike"
                  ? { backgroundColor: "#97B00F", padding: "2%" }
                  : {}
              }
              className={styles.btn}
            >
              <AiFillDislike
                style={
                  userReactionType === "like"
                    ? { fill: "#006633" }
                    : { fill: "#97B00F" }
                }
              />
              <p>
                <span>{dislikes} Unlike</span>
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
