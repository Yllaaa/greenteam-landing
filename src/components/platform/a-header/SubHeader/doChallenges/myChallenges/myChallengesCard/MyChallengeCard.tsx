/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./MyChallengeCard.module.css";
import Image from "next/image";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Post } from "../types/doChallenges.data";
import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";
import { useAppDispatch } from "@/store/hooks";
import { setUpdateState } from "@/store/features/update/updateSlice";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { CommentModal } from '@/components/AA-NEW/MODALS/COMMENTS/CommentModal';
type Props = {
  ref: any;
  page: number;
  challenge: Post;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
  setCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPostComments: React.Dispatch<React.SetStateAction<any>>;
  commentPage: number;
  setCommentPage: React.Dispatch<React.SetStateAction<number>>;
  postId: string;
  index: number;
  length: number;
  setPostMedia: React.Dispatch<
    React.SetStateAction<{
      id: string;
      mediaUrl: string;
      mediaType: string;
    }[]>
  >;
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  setEndPoint: React.Dispatch<React.SetStateAction<string>>;
  commentModal: boolean;
};
function MyChallengeCard(props: Props) {
  const {
    // commentModal,
    challenge,
    setPostId,
    // setCommentModal,
    setPostComments,
    commentPage,
    setCommentPage,
    postId,
    ref,
    index,
    length,
    setPostMedia,
    setAddNew,
    setEndPoint
  } = props;
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isMounted, setIsMounted] = React.useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // API base URL constant
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKENDAPI;

  const uniqueMedia = useMemo(
    () =>
      challenge.media && challenge.media.length > 0
        ? challenge.media.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        )
        : [],
    [challenge.media]
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

        // Set media for the current post
        setPostMedia(uniqueMedia);

        return response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
    },
    [API_BASE_URL, accessToken, setPostComments, setPostMedia, uniqueMedia]
  );

  // Handle delete challenge post
  const handleDelete = async () => {

    setIsDeleting(true);
    try {
      await axios.delete(
        `${API_BASE_URL}/api/v1/challenges/do-posts/${challenge.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      // If you have a state update function from Redux, you could use it here
      dispatch(setUpdateState());

    } catch (error) {
      console.error("Error deleting post:", error);
      ToastNot("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  // Load comments when page changes
  useEffect(() => {
    if (commentPage > 1) {
      fetchComments(postId, commentPage);
    }
  }, [commentPage, postId, fetchComments]);

  // Handle comment button click
  const handleComment = async (postId: string) => {
    if (!setPostId || !setPostComments) return;
    setPostComments([]);
    setPostId(postId);
    setCommentPage(1);

    try {
      const comments = await fetchComments(postId, 1);
      if (comments) {
        setIsCommentModalOpen(true); // Use local state
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

  const handleDoIt = () => {
    setAddNew(true)
    setPostId(challenge.id)
    setEndPoint(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/do-posts/${challenge.id}/done-with-post`)

    // try {
    //   axios
    //     .put(
    //       `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/do-posts/${challenge.id}/mark-as-done`,
    //       {},
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${accessToken}`,
    //           "Access-Control-Allow-Origin": "*",
    //         },
    //       }
    //     )
    //     .then((res) => {
    //       dispatch(setUpdateState());
    //       console.log(res.data);
    //       ToastNot("Challenge Accepted");
    //     });
    // } catch (err) {
    //   console.error("Error handling do it:", err);
    // }
  };

  const t = useTranslations("web.subHeader.green");

  return (
    <>
      <div
        ref={index === length - 1 ? ref : null}
        className={styles.challengeHeader}
      >
        <div className={styles.userAvatar}>
          <Image
            src={challenge.creator.avatar || noAvatar}
            alt="userAvatar"
            width={100}
            height={100}
          />
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
            {challenge.media?.length > 0 ? (
              challenge.content.length > 50 ? (
                <p>
                  {challenge.content.slice(0, 40)}{" "}
                  <span
                    onClick={() => {
                      router.push(`/${locale}/posts/${challenge.id}`);
                    }}
                    className={styles.readMore}
                  >
                    {t("readMore")}{" "}
                  </span>
                </p>
              ) : (
                <p>{challenge.content}</p>
              )
            ) : null}
          </div>
        </div>
        <div className={styles.deleteButtonContainer}>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : t("delete")}
          </button>
        </div>
      </div>
      <div className={styles.challengeImage}>
        {challenge.media?.length > 0 ? (
          <Image
            src={challenge.media[0].mediaUrl}
            alt="challengeImage"
            width={500}
            height={500}
            style={{ objectFit: "contain" }}
          />
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
            handleDoIt();
          }}
          className={styles.challengeButton}
        >
          {t("done")}
        </button>
        <button
          onClick={() => {
            handleComment(challenge.id);
          }}
          className={styles.challengeButton}
        >
          {t("comment")}
        </button>
      </div>
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => {
          setIsCommentModalOpen(false)
          setPostId('');
        }}
        challenge={challenge}
      />
    </>
  );
}

export default MyChallengeCard;