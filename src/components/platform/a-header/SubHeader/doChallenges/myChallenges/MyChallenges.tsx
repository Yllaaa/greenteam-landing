
////////////////////////////////////////////
"use client";
import React, { useEffect, useRef } from "react";
import styles from "./MyChallenges.module.css";
import MyChallengeCard from "./myChallengesCard/MyChallengeCard";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { DoMainProps, Post } from "./types/doChallenges.data";
import { useInView } from "react-intersection-observer";
import { useAppSelector } from "@/store/hooks";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "use-intl";


function MyChallenges(props: DoMainProps) {
  const {
    commentModal,
    setCommentModal,
    setPostComments,
    setPostId,
    commentPage,
    setCommentPage,
    setPostMedia,
    setAddNew,
    setEndpoint
  } = props;

  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const updateState = useAppSelector((state) => state.updateState.updated);

  // IntersectionObserver for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Fetch challenges with React Query
  const fetchChallenges = async ({ pageParam = 1 }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/do-posts?page=${pageParam}&limit=5`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["challenges", accessToken],
    queryFn: fetchChallenges,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If fewer than 5 items are returned, no more pages
      return lastPage.length === 5 ? allPages.length + 1 : undefined;
    },
  });

  // Refetch when updateState changes
  const updateStateRef = useRef(updateState);
  useEffect(() => {
    if (updateStateRef.current !== updateState) {
      updateStateRef.current = updateState;
      refetch();
    }
  }, [updateState, refetch]);

  const t = useTranslations("web.subHeader.doChallenge");
  const te = useTranslations("web.errors");

  // Load more data when the last item is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the pages array into a single array of challenges
  const challenges = data?.pages.flat() || [];

  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className={styles.MyContainer}>
      <div className={styles.header}>
        <h2>{t("myChallenge")}</h2>
      </div>
      <div className={styles.challengesContainer}>
        {challenges.length > 0 &&
          challenges.map((challenge: Post, index: number) => (
            <div
              key={`challenge-${challenge.id}-${index}`}
              className={styles.container}
            >

              <div className={styles.challenges}>
                <MyChallengeCard
                commentModal={commentModal}
                  setEndPoint={setEndpoint}
                  length={challenges.length}
                  index={index}
                  ref={index === challenges.length - 1 ? ref : null}
                  page={Math.floor(index / 5) + 1}
                  challenge={challenge}
                  setPostId={setPostId}
                  setCommentModal={setCommentModal}
                  setPostComments={setPostComments}
                  commentPage={commentPage}
                  setCommentPage={setCommentPage}
                  postId={challenge.id}
                  setPostMedia={setPostMedia}
                  setAddNew={setAddNew}
                />
              </div>
            </div>
          ))}

        {(isLoading || isFetchingNextPage) && (
          <div className={styles.loaderContainer}>
            <LoadingTree />
          </div>
        )}


        {!hasNextPage && challenges.length > 0 && (
          <div className={styles.loaderContainer}>
            <p>{te("noMore")}</p>
          </div>
        )}

        {!isLoading && challenges.length === 0 && (
          <div className={styles.loaderContainer}>
            <p>{te("notFound")}</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default MyChallenges;