/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import styles from "./postCard.module.css";
const PostSlider = lazy(() => import("./POSTSLIDER/PostSlider"));
import axios from "axios";
import Image from "next/image";
import admin from "@/../public/auth/user.png";
import { useInView } from "react-intersection-observer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import LoadingTree from "@/components/zaLoader/LoadingTree";

type CommentsAuthor = {
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
  author: CommentsAuthor;
};
type Props = {
  setDoItModal?: (value: boolean) => void;
  setCommentModal?: (value: boolean) => void;
  setPostComments?: (value: Comment[]) => void;
  commentPage: number;
  setCommentPage: (value: number) => void;
  mainTopic?: {
    id: number;
    name: string;
    subtopics: {
      id: number;
      name: string;
    }[];
  };
  subTopic: {
    [key: number]: string;
  };
};

interface Post {
  id: string;
  content: string;
  createdAt: string;
}

interface Author {
  id: string;
  fullName: string;
  avatar: string | null;
  username: string;
}

interface PostItem {
  post: Post;
  author: Author;
  commentCount: string;
  likeCount: string;
  dislikeCount: string;
  userReactionType: string | null;
  hasDoReaction: boolean;
}

type PostsData = PostItem[];
function PostCard(props: Props) {
  const router = useRouter();
  const locale = useLocale();
  const {
    commentPage,
    setCommentPage,
    setDoItModal,
    mainTopic,
    subTopic,
    setCommentModal,
    setPostComments,
  } = props;

  const localS = localStorage.getItem("user");
  const accessToken = localS ? JSON.parse(localS).accessToken : null;

  const limit = 5;
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [postContent, setPostContent] = useState<PostsData>([]);

  const bodyRef = React.useRef<HTMLDivElement>(null);

  const prevSlide = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollBy({
        left: +300,
        behavior: "smooth",
      });
    }
  };

  // Go to Next Slide
  const nextSlide = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!mainTopic) {
      setIsLoading(false);
      return;
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts?limit=${limit}${
          subTopic[mainTopic.id] !== "all"
            ? ""
            : `&mainTopicId=${mainTopic?.id}`
        }${
          subTopic[mainTopic.id] === "all"
            ? ""
            : `&subTopicId=${subTopic[mainTopic.id]}`
        }&page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      )
      .then((res) => {
        console.log("rerendered");
        setPostContent((prev) => {
          if (res.data.length >= 0 && page === 1) {
            return res.data;
          } else if (res.data.length >= 0 && page > 1) {
            return [...prev, ...res.data];
          }

          return res.data;
        });
        console.log("length post", postContent.length);

        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage("An Error Occurred");
        console.log(err);
        setIsLoading(false);
      });
  }, [subTopic, page]);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  console.log("length", mainTopic?.id, postContent.length);
  const handlePages = React.useCallback(() => {
    console.log("page", page);
    console.log("length", postContent.length);

    setPage(postContent.length < 4 ? 1 : page + 1);
  }, [postContent.length]);

  React.useEffect(() => {
    if (inView) {
      handlePages();
    }
  }, [inView]);

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


  return (
    <>
      <div className={styles.sliderBtns}>
        <div className={styles.arrow} onClick={prevSlide}>
          <FaArrowLeft />
        </div>
        <div className={styles.arrow} onClick={nextSlide}>
          <FaArrowRight />
        </div>
      </div>
      <div ref={bodyRef} className={styles.body}>
        {isLoading ? (
          <div className={styles.noPosts}>
            <LoadingTree />
          </div>
        ) : errorMessage === "" ? (
          postContent.length === 0 ? (
            <div className={styles.noPosts}>
              <p>No posts found</p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className={styles.noPosts}>
                  <LoadingTree />
                </div>
              }
            >
              {postContent.map((post, index) => (
                <div
                  key={index}
                  ref={index === postContent.length - 1 ? ref : null}
                  className={styles.container}
                >
                  <div className={styles.header}>
                    <div
                      onClick={() =>
                        router.push(`/${locale}/profile/${post.author.id}`)
                      }
                      style={{ cursor: "pointer" }}
                      className={styles.userAvatar}
                    >
                      <Image
                        src={post.author.avatar ? post.author.avatar : admin}
                        alt="avatar"
                      />
                    </div>
                    <div className={styles.details}>
                      <div
                        onClick={() =>
                          router.push(`/${locale}/profile/${post.author.id}`)
                        }
                        style={{ cursor: "pointer" }}
                        className={styles.userName}
                      >
                        <p>
                          {post.author.fullName}{" "}
                          <span>@{post.author.username}</span>
                          <span>
                            {" . "}
                            {formatTimeDifference(post.post.createdAt)}
                          </span>
                        </p>
                      </div>
                      <div
                        onClick={() =>
                          router.push(`/${locale}/feeds/posts/${post.post.id}`)
                        }
                        style={{ cursor: "pointer" }}
                        className={styles.post}
                      >
                        {post.post.content.length > 50 ? (
                          <p>
                            {post.post.content.slice(0, 40)}{" "}
                            <span>Read More... </span>
                          </p>
                        ) : (
                          <p>{post.post.content.slice(0, 50)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.image}>
                    <div className={styles.postslider}>
                      <PostSlider
                        commentPage={commentPage}
                        setCommentPage={setCommentPage}

                        likes={post.likeCount}
                        comments={post.commentCount}
                        dislikes={post.dislikeCount}
                        userReactionType={post.userReactionType}
                        hasDoReaction={post.hasDoReaction}
                        setDoItModal={setDoItModal}
                        setCommentModal={setCommentModal}
                        setPostComments={setPostComments}
                        postId={post.post.id}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Suspense>
          )
        ) : (
          <div className={styles.noPosts}>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default PostCard;
