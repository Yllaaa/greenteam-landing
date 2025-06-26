
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
////////////////////////////////////////////
// "use client";
// import React, { useEffect, useRef, useState, useCallback, memo } from "react";
// import styles from "./MyChallenges.module.scss";
// import MyChallengeCard from "./myChallengesCard/MyChallengeCard";
// import axios from "axios";
// import { getToken } from "@/Utils/userToken/LocalToken";
// import { DoMainProps, Post } from "./types/doChallenges.data";
// import { useInView } from "react-intersection-observer";
// import { useAppSelector } from "@/store/hooks";
// import LoadingTree from "@/components/zaLoader/LoadingTree";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// // Memoized challenge card to prevent unnecessary rerenders
// const MemoizedChallengeCard = memo(MyChallengeCard);

// function MyChallenges(props: DoMainProps) {
//   const {
//     setCommentModal,
//     setPostComments,
//     setPostId,
//     commentPage,
//     setCommentPage,
//     setPostMedia,
//   } = props;

//   // State for window mode functionality
//   const [isWindowMode, setIsWindowMode] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);

//   // Refs
//   const containerRef = useRef<HTMLDivElement>(null);
//   const listRef = useRef<HTMLDivElement>(null);

//   // Check window width for window mode
//   const checkWindowSize = useCallback(() => {
//     if (typeof window !== 'undefined') {
//       const isLargeScreen = window.innerWidth > 1024;

//       // Auto-enable window mode on large screens if not explicitly disabled
//       if (isLargeScreen && !isWindowMode) {
//         setIsWindowMode(true);
//       }
//     }
//   }, [isWindowMode]);

//   // Set up resize listener
//   useEffect(() => {
//     checkWindowSize();
//     window.addEventListener('resize', checkWindowSize);
//     return () => window.removeEventListener('resize', checkWindowSize);
//   }, [checkWindowSize]);

//   // Authentication and state management
//   const token = getToken();
//   const accessToken = token ? token.accessToken : null;
//   const updateState = useAppSelector((state) => state.updateState.updated);

//   // IntersectionObserver for infinite scroll
//   const { ref, inView } = useInView({
//     threshold: 0.5,
//     triggerOnce: false,
//   });

//   // Fetch challenges with React Query
//   const fetchChallenges = async ({ pageParam = 1 }) => {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/do-posts?page=${pageParam}&limit=5`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     return response.data;
//   };

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useInfiniteQuery({
//     queryKey: ["challenges", accessToken],
//     queryFn: fetchChallenges,
//     initialPageParam: 1,
//     getNextPageParam: (lastPage, allPages) => {
//       return lastPage.length === 5 ? allPages.length + 1 : undefined;
//     },
//   });

//   // Refetch when updateState changes
//   const updateStateRef = useRef(updateState);
//   useEffect(() => {
//     if (updateStateRef.current !== updateState) {
//       updateStateRef.current = updateState;
//       refetch();
//     }
//   }, [updateState, refetch]);

//   // Load more data when the last item is in view
//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

//   // Flatten the pages array into a single array of challenges
//   const challenges = data?.pages.flat() || [];

//   // Check scroll position for arrow visibility
//   const checkScrollPosition = useCallback(() => {
//     if (!listRef.current) return;

//     const { scrollLeft, scrollWidth, clientWidth } = listRef.current;

//     setCanScrollLeft(scrollLeft > 0);
//     setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
//   }, []);

//   // Set up scroll check on mount and when content changes
//   useEffect(() => {
//     const listElement = listRef.current;
//     if (listElement) {
//       listElement.addEventListener('scroll', checkScrollPosition);
//       // Initial check
//       checkScrollPosition();

//       return () => listElement.removeEventListener('scroll', checkScrollPosition);
//     }
//   }, [checkScrollPosition, challenges.length]);

//   // Toggle window collapse/expand
//   const toggleCollapse = useCallback(() => {
//     setIsCollapsed(prev => !prev);
//   }, []);

//   // Handle scroll buttons
//   const handleScroll = useCallback((direction: 'left' | 'right') => {
//     if (!listRef.current) return;

//     const scrollAmount = 400; // Adjust as needed
//     const currentScroll = listRef.current.scrollLeft;

//     listRef.current.scrollTo({
//       left: direction === 'left'
//         ? currentScroll - scrollAmount
//         : currentScroll + scrollAmount,
//       behavior: 'smooth'
//     });
//   }, []);

//   if (isError) return <p>Error: {(error as Error).message}</p>;

//   return (
//     <>
//       <div
//         ref={containerRef}
//         className={`${styles.MyContainer} ${isWindowMode ? styles.windowMode : ''} ${isCollapsed ? styles.collapsed : ''}`}
//       >
//         {/* Only show the handle in window mode */}
//         {isWindowMode && (
//           <div
//             className={styles.windowHandle}
//             onClick={toggleCollapse}
//             title={isCollapsed ? "Expand Challenges" : "Collapse Challenges"}
//           >
//             <div className={styles.handleIcon} />
//           </div>
//         )}

//         {/* Challenges list with proper ref for scroll handling */}
//         <div
//           ref={listRef}
//           className={isWindowMode ? styles.challengesContainer : undefined}
//         >
//           {challenges.length > 0 &&
//             challenges.map((challenge: Post, index: number) => (
//               <div
//                 key={`challenge-${challenge.id}-${index}`}
//                 className={styles.container}
//                 style={{
//                   animationDelay: `${index * 0.05}s`,
//                   opacity: isFetchingNextPage && index >= challenges.length - 5 ? 0.7 : 1
//                 }}
//               >
//                 <div className={styles.challenges}>
//                   <MemoizedChallengeCard
//                     length={challenges.length}
//                     index={index}
//                     ref={index === challenges.length - 1 ? ref : null}
//                     page={Math.floor(index / 5) + 1}
//                     challenge={challenge}
//                     setPostId={setPostId}
//                     setCommentModal={setCommentModal}
//                     setPostComments={setPostComments}
//                     commentPage={commentPage}
//                     setCommentPage={setCommentPage}
//                     postId={challenge.id}
//                     setPostMedia={setPostMedia}
//                   />
//                 </div>
//               </div>
//             ))}

//           {/* Loading state */}
//           {(isLoading || isFetchingNextPage) && (
//             <div className={styles.loaderContainer}>
//               <LoadingTree />
//             </div>
//           )}

//                     {/* End of content messages */}
//           {!hasNextPage && challenges.length > 0 && (
//             <div className={styles.loaderContainer}>
//               <p>No more challenges to load</p>
//             </div>
//           )}

//           {/* Empty state */}
//           {!isLoading && challenges.length === 0 && (
//             <div className={styles.loaderContainer}>
//               <p>No challenges found</p>
//             </div>
//           )}
//         </div>
        
//         {/* Navigation arrows (only visible when not collapsed) */}
//         {!isCollapsed && (
//           <div className={styles.navArrows}>
//             <button 
//               className={`${styles.arrow} ${!canScrollLeft ? styles.disabled : ''}`}
//               onClick={() => handleScroll('left')}
//               disabled={!canScrollLeft}
//               aria-label="Scroll left"
//             >
//               <FaChevronLeft />
//             </button>
//             <button 
//               className={`${styles.arrow} ${!canScrollRight ? styles.disabled : ''}`}
//               onClick={() => handleScroll('right')}
//               disabled={!canScrollRight}
//               aria-label="Scroll right"
//             >
//               <FaChevronRight />
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // Performance optimization
// export default memo(MyChallenges);