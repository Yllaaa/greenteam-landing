/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./commentmodal.module.css";
import Image from "next/image";
// import ToastNot from "@/Utils/ToastNotification/ToastNot";
import admin from "@/../public/auth/user.png";
import foot from "@/../public/goals/9af82d040ad31191bd7b42312d18fff3.jpeg";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useInView } from "react-intersection-observer";

import { useForm } from "react-hook-form";
import axios from "axios";

type Author = {
  id: string;
  fullName: string;
  username: string;
  avatar?: string | null;
};

type Comment = {
  id: string;
  publicationId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  author: Author;
};

type Props = {
  setCommentModal: (value: boolean) => void;
  postComments: Comment[];
  setCommentPage: (value: number) => void;
  commentPage: number;
};
function CommentModal(props: Props) {
  const localeS = localStorage.getItem("user");
  const accessToken = localeS ? JSON.parse(localeS).accessToken : null;

  const { setCommentModal, postComments, setCommentPage, commentPage } = props;

  const modalRef = React.useRef<HTMLDivElement>(null);

  // SLIDER HANDLER
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
        setCommentModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setCommentModal]);
  // END CLICK OUTSIDE MODAL
  ////////////////////////////
  //   PAGINATION
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const handlePages = React.useCallback(() => {
    setCommentPage(postComments.length < 5 ? 1 : commentPage + 1);
    
    
  }, [commentPage]);

  React.useEffect(() => {
    if (inView) {
      handlePages();
    }
  }, [inView]);
  //   END PAGINATION
  //   ////////////////////////
  //  FORMAT TIME FUNCTION
  function formatTimeDifference(targetDate: string): string {
    // Convert the target date string to a Date object
    const target = new Date(targetDate);
    const now = new Date();

    // Calculate the difference in milliseconds
    const differenceInMs = now.getTime() - target.getTime();

    // Convert milliseconds to seconds
    const differenceInSeconds = Math.floor(differenceInMs / 1000);

    // Format the difference
    if (differenceInSeconds < 60) {
      return `${differenceInSeconds}S`; // Seconds
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes}m`; // Minutes
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours}hr`; // Hours
    } else {
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days}D`; // Days
    }
  }
  //  END FORMAT TIME FUNCTION

  // add comment
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postComments[0].publicationId}/comment`,
          {
            content: data.comment,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => console.log(res.data));
    } catch (err) {
      console.log(err);
    }
  };
  console.log(errors);

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontent}>
          <div className={styles.postImages}>
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
          <div className={styles.commentsSection}>
            {postComments.length > 0 ? (
              postComments.map((comment, index) => (
                <div
                  key={comment.id}
                  ref={index === postComments.length - 1 ? ref : null}
                  className={styles.comment}
                >
                  <div className={styles.commentHeader}>
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
                          {" "}
                          {comment.author.fullName}
                        </span>
                        <span className={styles.commentText}>
                          {comment.content}
                        </span>
                      </p>
                    </div>
                    <div className={styles.lower}>
                      <p>{formatTimeDifference(comment.createdAt)}</p>
                      <p>Like</p>
                      <p>Reply</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div >
                <p>No comments yet</p>
              </div>
            )}
          </div>
          <div className={styles.newComment}>
            <div className={styles.newCommentContainer}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  className={styles.commentTextArea}
                  placeholder="Add a comment"
                  {...register("comment", { required: true })}
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

export default CommentModal;
