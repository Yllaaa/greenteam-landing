/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { Dispatch, SetStateAction } from "react";
import styles from "./ForumCard.module.css";
import Image from "next/image";
import doIcon from "@/../public/ZPLATFORM/post/do.svg";
import like from "@/../public/ZPLATFORM/post/like.svg";
import unlike from "@/../public/ZPLATFORM/post/unlike.svg";
import comment from "@/../public/ZPLATFORM/post/comment.svg";
import { useInView } from "react-intersection-observer";
import { FaPaperclip } from "react-icons/fa6";
type Author = {
  id: string;
  fullName: string;
  avatar: string | null;
  username: string;
};

type MainTopic = {
  id: string;
  name: string;
};

type Discussion = {
  posts: {
    id: string;
    headline: string;
    content: string;
    section: string;
    mediaUrl: string | null;
    createdAt: string;
    author: Author;
    mainTopic: MainTopic;
    commentCount: number;
    likeCount: number;
    unlikeCount: number;
  }[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

function ForumCard(props: Discussion) {
  const { posts, setPage, page } = props;
  const { ref, inView } = useInView({
    threshold: 0.5, // Trigger when 50% of the element is visible
  });

  const [commentSection, setCommentSection] = React.useState("");

  const handlePages = React.useCallback(() => {
    setPage(page + 1);
    console.log("updating...");
  }, [page]);

  React.useEffect(() => {
    if (inView) {
      handlePages();
    }
  }, [inView]);

  return (
    <>
      {posts.map((post, index) => (
        <div
          ref={index === posts.length - 1 ? ref : null}
          key={index}
          className={styles.container}
        >
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
                <p>{post.author.username}</p> {" . "}
                <span>Add friend</span>
              </div>
              <div className={styles.job}>{post.author.fullName}</div>
            </div>
          </div>
          <div className={styles.scrollable}>
            <div className={styles.body}>
              <div className={styles.title}>{post.headline}</div>
              <div className={styles.post}>{post.content}</div>
            </div>
            {post.mediaUrl && (
              <div className={styles.image}>
                <Image
                  src={post.mediaUrl}
                  alt="image"
                  loading="lazy"
                  width={400}
                  height={300}
                />
              </div>
            )}
          </div>
          <div className={styles.reactionBtns}>
            <div className={styles.btn}>
              <Image src={doIcon} alt="do" />
              <p>
                <span>Do</span>
              </p>
            </div>
            <div className={styles.btn}>
              <Image src={like} alt="like" />
              <p>
                <span>Like</span>
              </p>
            </div>
            <div className={styles.btn}>
              <Image src={unlike} alt="unlike" />
              <p>
                <span>Unlike</span>
              </p>
            </div>
            <div
              onClick={() => {
                setCommentSection(post.id);
              }}
              className={styles.btn}
            >
              <Image src={comment} alt="comment" />
              <p>
                <span>Comment</span>
              </p>
            </div>
          </div>

          <div
            id={post.id}
            className={`${
              commentSection === post.id
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
                    <FaPaperclip />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ForumCard;
