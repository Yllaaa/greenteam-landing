/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./MyChallenges.module.css";
import MyChallengeCard from "./myChallengesCard/MyChallengeCard";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { Post } from "./types/doChallenges.data";
import { useInView } from "react-intersection-observer";

type Props = {
  setCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  postComments: any;
  setPostComments: React.Dispatch<React.SetStateAction<any>>;
  postId: string;
  setCommentPage: React.Dispatch<React.SetStateAction<number>>;
  commentPage: number;
  setRepliesPage: React.Dispatch<React.SetStateAction<number>>;
  repliesPage: number;
  setRerender: React.Dispatch<React.SetStateAction<boolean>>;
  rerender: boolean;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
  commentModal: boolean;
};

function MyChallenges(props: Props) {
  const {
    setCommentModal,
    setPostComments,
    setPostId,
    commentPage,
    setCommentPage,
  } = props;

  const token = getToken();
  const accessToken = token ? token.accessToken : null;

  const [challenges, setChallenges] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // IntersectionObserver for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const fetchChallenges = useCallback(async () => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/do-posts?page=${page}&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const newChallenges = response.data;

      // Update challenges and check if there are more to load
      setChallenges((prevChallenges) =>
        page === 1 ? newChallenges : [...prevChallenges, ...newChallenges]
      );

      // If fewer challenges are returned than the limit, no more to load
      setHasMore(newChallenges.length === 5);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      setLoading(false);
    }
  }, [page, accessToken, hasMore]);

  useEffect(() => {
    fetchChallenges();
  }, [page, fetchChallenges]);

  // Trigger page increment when last item is in view
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore, loading]);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.MyContainer}>
      {challenges.map((challenge, index) => (
        <React.Fragment key={`challenge-container-${challenge.id}-${index}`}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h2>My Challenges</h2>
            </div>
            <div className={styles.challenges}>
              <MyChallengeCard
                length={challenges.length}
                index={index}
                ref={index === challenges.length - 1 ? ref : null}
                page={page}
                challenge={challenge}
                setPostId={setPostId}
                setCommentModal={setCommentModal}
                setPostComments={setPostComments}
                commentPage={commentPage}
                setCommentPage={setCommentPage}
                postId={challenge.id}
              />
            </div>
          </div>
        </React.Fragment>
      ))}
      {loading && <p>Loading more challenges...</p>}
      {!hasMore && <p>No more challenges to load</p>}
    </div>
  );
}

export default MyChallenges;
