// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";
// import React, { useCallback, useEffect, useState } from "react";
// import styles from "./MyChallenges.module.css";
// import MyChallengeCard from "./myChallengesCard/MyChallengeCard";
// import axios from "axios";
// import { getToken } from "@/Utils/userToken/LocalToken";
// import { DoMainProps, Post } from "./types/doChallenges.data";
// import { useInView } from "react-intersection-observer";
// import { useAppSelector } from "@/store/hooks";
// import LoadingTree from "@/components/zaLoader/LoadingTree";

// function MyChallenges(props: DoMainProps) {
//   const {
//     setCommentModal,
//     setPostComments,
//     setPostId,
//     commentPage,
//     setCommentPage,
//   } = props;

//   const token = getToken();
//   const accessToken = token ? token.accessToken : null;

//   const updateState = useAppSelector((state) => state.updateState.updated);

//   const [challenges, setChallenges] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   // IntersectionObserver for infinite scroll
//   const { ref, inView } = useInView({
//     threshold: 0.5,
//     triggerOnce: false,
//   });

//   const fetchChallenges = useCallback(async () => {
//     if (!hasMore) return;

//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/do-posts?page=${page}&limit=5`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       const newChallenges = response.data;

//       // Update challenges and check if there are more to load
//       setChallenges((prevChallenges) =>
//         page === 1 ? newChallenges : [...prevChallenges, ...newChallenges]
//       );

//       // If fewer challenges are returned than the limit, no more to load
//       setHasMore(newChallenges.length === 5);
//       setLoading(false);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err : new Error("An unknown error occurred")
//       );
//       setLoading(false);
//     }
//   }, [page, accessToken, hasMore, updateState]);

//   useEffect(() => {
//     fetchChallenges();
//   }, [page, fetchChallenges]);

//   // Trigger page increment when last item is in view
//   useEffect(() => {
//     if (inView && hasMore && !loading) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   }, [inView, hasMore, loading]);

//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div className={styles.MyContainer}>
//       {challenges.map((challenge, index) => (
//         <React.Fragment key={`challenge-container-${challenge.id}-${index}`}>
//           <div className={styles.container}>
//             <div className={styles.header}>
//               <h2>My Challenges</h2>
//             </div>
//             <div className={styles.challenges}>
//               <MyChallengeCard
//                 length={challenges.length}
//                 index={index}
//                 ref={index === challenges.length - 1 ? ref : null}
//                 page={page}
//                 challenge={challenge}
//                 setPostId={setPostId}
//                 setCommentModal={setCommentModal}
//                 setPostComments={setPostComments}
//                 commentPage={commentPage}
//                 setCommentPage={setCommentPage}
//                 postId={challenge.id}
//               />
//             </div>
//           </div>
//         </React.Fragment>
//       ))}
//       {loading && (
//         <div className={styles.loaderContainer}>
//           <LoadingTree />
//         </div>
//       )}
//       {!hasMore && (
//         <div className={styles.loaderContainer}>
//           <p>No more challenges to load</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyChallenges;

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

function MyChallenges(props: DoMainProps) {
  const {
    setCommentModal,
    setPostComments,
    setPostId,
    commentPage,
    setCommentPage,
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
    console.log(response.data);
    
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
      {challenges.length > 0 &&
        challenges.map((challenge: Post, index: number) => (
          <div
            key={`challenge-${challenge.id}-${index}`}
            className={styles.container}
          >
            <div className={styles.header}>
              <h2>My Challenges</h2>
            </div>
            <div className={styles.challenges}>
              <MyChallengeCard
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
          <p>No more challenges to load</p>
        </div>
      )}

      {!isLoading && challenges.length === 0 && (
        <div className={styles.loaderContainer}>
          <p>No challenges found</p>
        </div>
      )}
    </div>
  );
}

export default MyChallenges;
