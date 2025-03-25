/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect } from "react";
import styles from "./MyChallengeCard.module.css";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import Image from "next/image";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Post } from "../types/doChallenges.data";
import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";

type Props = {
  challenge: Post;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
  setCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPostComments: React.Dispatch<React.SetStateAction<any>>;
  commentPage: number;
  setCommentPage: React.Dispatch<React.SetStateAction<number>>;
  postId: string;
};
function MyChallengeCard(props: Props) {
  const {
    challenge,
    setPostId,
    setCommentModal,
    setPostComments,
    commentPage,
    setCommentPage,
    postId,
  } = props;
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const locale = useLocale();
  const router = useRouter();

  const [isMounted, setIsMounted] = React.useState(false);
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
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // Memoize time formatter to prevent recreation on each render
  const formatTimeDifference = useCallback(
    (targetDate: string): string => {
      if (!isMounted) return ""; // Prevent SSR/CSR mismatch

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

  return (
    <>
      <div className={styles.challengeHeader}>
        <div className={styles.userAvatar}>
          <Image src={challenge.creator.avatar || noAvatar} alt="userAvatar" />
        </div>
        <div className={styles.details}>
          <div className={styles.userName}>
            <p>
              {challenge.creator.username}{" "}
              <span>@{challenge.creator.name}</span>
              <span>
                {" . "}
                {formatTimeDifference(challenge.createdAt)}
              </span>
            </p>
          </div>
          <div className={styles.post}>
            {challenge.mediaUrl ? (
              challenge.content.length > 50 ? (
                <p>
                  {challenge.content.slice(0, 40)}{" "}
                  <span
                    onClick={() => {
                      router.push(`/${locale}/posts/${challenge.id}`);
                    }}
                    className={styles.readMore}
                  >
                    Read More...{" "}
                  </span>
                </p>
              ) : (
                <p>{challenge.content}</p>
              )
            ) : null}
          </div>
        </div>
      </div>
      <div className={styles.challengeImage}>
        {challenge.mediaUrl ? (
          <Image src={noAvatar} alt="challengeImage" />
        ) : (
          <div
            onClick={() => {
              router.push(`/${locale}/posts/${challenge.id}`);
            }}
            className={styles.noImage}
          >
            <p>{challenge.content}</p>
          </div>
        )}
      </div>
      <div className={styles.challengeActions}>
        <button
          onClick={() => {
            ToastNot("Challenge Accepted");
          }}
          className={styles.challengeButton}
        >
          Do it
        </button>
        <button
          onClick={() => {
            handleComment(challenge.id);
            // ToastNot("Challenge Accepted");
          }}
          className={styles.challengeButton}
        >
          Comment
        </button>
      </div>
    </>
  );
}

export default MyChallengeCard;
