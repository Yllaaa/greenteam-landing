// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import styles from "./PostSlider.module.css";
// import Image from "next/image";
// import { FaCheckSquare, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { AiFillDislike, AiFillLike } from "react-icons/ai";
// // import { FaComment } from "react-icons/fa6";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { getToken } from "@/Utils/userToken/LocalToken";
// import { useLocale } from "next-intl";
// import { ReactionType, Props } from "./types/postSlider.data";
// import { useAppDispatch } from "@/store/hooks";
// import { setUpdateState } from "@/store/features/update/updateSlice";
// import attached from "@/../public/ZPLATFORM/post/attach.jpg";
// import foot from "@/../public/logo/foot.png";
// import { useTranslations } from "next-intl";
// // Define better types for better type safety
// import CommentButton from "@/Utils/commentButton/CommentButton";

// function PostSlider(props: Props) {
//   const router = useRouter();
//   const locale = useLocale();
//   const {
//     post,
//     media,
//     content,
//     commentPage,
//     setPostComments,
//     likes,
//     comments,
//     dislikes,
//     userReactionType,
//     hasDoReaction,
//     postId,
//     setPostMedia,
//   } = props;
//   const t = useTranslations("web.main.feeds");
//   const localS = getToken();
//   const accessToken = localS ? localS.accessToken : null;

//   // slider handler
//   const [currentSlide, setCurrentSlide] = React.useState(0);
//   const [loaded, setLoaded] = useState(false);

//   const navigateToPost = useCallback(
//     (postId: string) => {
//       router.push(`/${locale}/feeds/posts/${postId}`);
//     },
//     [router, locale]
//   );

//   // Static state for like/dislike UI
//   const [likeCount, setLikeCount] = useState(parseInt(likes));
//   const [dislikeCount, setDislikeCount] = useState(parseInt(dislikes));
//   const [userLiked, setUserLiked] = useState(userReactionType === "like");
//   const [userDisliked, setUserDisliked] = useState(
//     userReactionType === "dislike"
//   );
//   const [userDo, setUserDo] = useState(hasDoReaction);
//   // API base URL constant
//   const API_BASE_URL = process.env.NEXT_PUBLIC_BACKENDAPI;

//   const uniqueMedia = useMemo(
//     () =>
//       media && media.length > 0
//         ? media.filter(
//           (item, index, self) =>
//             index === self.findIndex((t) => t.id === item.id)
//         )
//         : [],
//     [media]
//   );

//   const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
//     uniqueMedia.length > 1 ? {
//       initial: 0,
//       loop: false,
//       slides: { perView: 1 },
//       // Completely disable all interaction
//       drag: false,
//       // disabled: true,
//       slideChanged(slider) {
//         setCurrentSlide(slider.track.details.rel);
//       },
//       created() {
//         setLoaded(true);
//       },
//     } : {
//       // Disable slider for single media
//       disabled: true,
//       created() {
//         setLoaded(true);
//       },
//     }
//   );

//   // Add this wrapper class conditionally
//   const sliderWrapperClass = uniqueMedia.length > 1
//     ? "keen-slider"
//     : `keen-slider ${styles.singleMediaSlider}`;

//   // Create ref for reactions container
//   const reactionsRef = useRef<HTMLDivElement>(null);

//   // Navigation handlers
//   const goToPrevious = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (instanceRef.current) {
//       instanceRef.current.prev();
//     }
//   };

//   const goToNext = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (instanceRef.current) {
//       instanceRef.current.next();
//     }
//   };

//   // Fetch comments with error handling and loading state
//   const fetchComments = useCallback(
//     async (postId: string, page: number) => {
//       const limit = 10;
//       if (!accessToken || !postId || !setPostComments) return;

//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/api/v1/posts/${postId}/comments?page=${page}&limit=${limit}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//               "Access-Control-Allow-Origin": "*",
//             },
//           }
//         );

//         setPostComments((prev: any) => {
//           if (page === 1) return response.data;
//           return [...prev, ...response.data];
//         });
//         setPostMedia(uniqueMedia);
//         return response.data;
//       } catch (error) {
//         console.error("Error fetching comments:", error);
//         return [];
//       }
//     },
//     [API_BASE_URL, accessToken, setPostComments, setPostMedia, uniqueMedia]
//   );

//   // Load comments when page changes
//   useEffect(() => {
//     if (commentPage > 1) {
//       fetchComments(postId, commentPage);
//     }
//   }, [commentPage, postId, fetchComments]);

//   // Handle reaction API calls
//   const handleToggleReaction = useCallback(
//     async (reactionType: ReactionType) => {
//       if (!accessToken) return;

//       try {
//         await axios.post(
//           `${API_BASE_URL}/api/v1/posts/reactions/toggle-reaction`,
//           {
//             reactionableType: "post",
//             reactionableId: postId,
//             reactionType,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//               "Access-Control-Allow-Origin": "*",
//             },
//           }
//         );
//       } catch (error) {
//         console.error("Error toggling reaction:", error);
//         // Revert UI state on error
//         if (reactionType === "like") {
//           setUserLiked(userReactionType === "like");
//           setLikeCount(parseInt(likes) || 0);
//         } else if (reactionType === "dislike") {
//           setUserDisliked(userReactionType === "dislike");
//           setDislikeCount(parseInt(dislikes) || 0);
//         } else if (reactionType === "do") {
//           setUserDo(hasDoReaction);
//         }
//       }
//     },
//     [
//       accessToken,
//       API_BASE_URL,
//       postId,
//       userReactionType,
//       likes,
//       dislikes,
//       hasDoReaction,
//     ]
//   );

//   // Handle like button click with optimistic UI update and prevent navigation
//   const handleLike = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent event bubbling
//     handleToggleReaction("like");
//     // If already liked, remove like
//     if (userLiked) {
//       setLikeCount((prevCount) => Math.max(0, prevCount - 1));
//       setUserLiked(false);
//     }
//     // If disliked, remove dislike and add like
//     else if (userDisliked) {
//       setDislikeCount((prevCount) => Math.max(0, prevCount - 1));
//       setLikeCount((prevCount) => prevCount + 1);
//       setUserDisliked(false);
//       setUserLiked(true);
//     }
//     // Otherwise, add like
//     else {
//       setLikeCount((prevCount) => prevCount + 1);
//       setUserLiked(true);
//     }
//   };

//   // Handle dislike button click with optimistic UI update and prevent navigation
//   const handleDislike = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent event bubbling
//     handleToggleReaction("dislike");
//     // If already disliked, remove dislike
//     if (userDisliked) {
//       setDislikeCount((prevCount) => Math.max(0, prevCount - 1));
//       setUserDisliked(false);
//     }
//     // If liked, remove like and add dislike
//     else if (userLiked) {
//       setLikeCount((prevCount) => Math.max(0, prevCount - 1));
//       setDislikeCount((prevCount) => prevCount + 1);
//       setUserLiked(false);
//       setUserDisliked(true);
//     }
//     // Otherwise, add dislike
//     else {
//       setDislikeCount((prevCount) => prevCount + 1);
//       setUserDisliked(true);
//     }
//   };

//   // Handle do button click with optimistic UI update and prevent navigation
//   const dispatch = useAppDispatch();
//   const handleDo = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent event bubbling
//     dispatch(setUpdateState());
//     handleToggleReaction("do");
//     // If already do
//     if (hasDoReaction) {
//       setUserDo(!userDo);
//     }
//     // If liked, remove do
//     else if (userDo) {
//       setUserDo(false);
//     }
//     // Otherwise, add do
//     else {
//       setUserDo(true);
//     }
//   };

//   // Navigate to full post
//   const handleNavigatePost = (postId: string) => {
//     router.push(`/${locale}/feeds/posts/${postId}`);
//   };

//   // Handle navigation with event checking
//   const handleNavigate = (e: React.MouseEvent, postId: string) => {
//     // Check if the click target is within the reactions container
//     if (reactionsRef.current && reactionsRef.current.contains(e.target as Node)) {
//       return; // Don't navigate if clicking on reactions
//     }
//     navigateToPost(postId);
//   };

//   // Render media slider or text content
//   const renderContent = () => {
//     if (uniqueMedia.length > 0) {
//       return (
//         <div className={styles.navigationWrapper}>
//           <div
//             ref={sliderRef}
//             className={sliderWrapperClass}
//             onClick={(e) => handleNavigate(e, postId)}
//             onScrollCapture={(e)=> e.preventDefault()}
//             // style={{
//             //   // Completely disable pointer events on the slider container for multi-image
//             //   ...(uniqueMedia.length > 1 && {
//             //     pointerEvents: 'none',
//             //     touchAction: 'pan-y',
//             //   })
//             // }}
//           >
//             {uniqueMedia.map((imageUrl, index) => (
//               <div
//                 key={imageUrl.id || index}
//                 className={`keen-slider__slide ${styles.postCard}`}
//                 style={{
//                   // Re-enable pointer events on slides for click navigation
//                   pointerEvents: 'auto'
//                 }}
//               >
//                 <div className={styles.image}>
//                   <div className={styles.overlay}></div>
//                   <Image
//                     src={
//                       imageUrl.mediaType === "image"
//                         ? imageUrl.mediaUrl
//                         : imageUrl.mediaType === "document"
//                           ? attached
//                           : foot
//                     }
//                     alt={`Post image ${index + 1}`}
//                     loading="lazy"
//                     width={1000}
//                     height={1000}
//                     className={styles.postImage}
//                     draggable={false}
//                     onDragStart={(e) => e.preventDefault()}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Navigation Arrows */}
//           {loaded && instanceRef.current && uniqueMedia.length > 1 && (
//             <>
//               <button
//                 className={`${styles.navArrow} ${styles.navArrowLeft} ${currentSlide === 0 ? styles.disabled : ''}`}
//                 onClick={goToPrevious}
//                 disabled={currentSlide === 0}
//                 aria-label="Previous slide"
//                 style={{
//                   pointerEvents: 'auto',
//                   zIndex: 1000,
//                   position: 'absolute'
//                 }}
//               >
//                 <FaChevronLeft />
//               </button>
//               <button
//                 className={`${styles.navArrow} ${styles.navArrowRight} ${currentSlide === uniqueMedia.length - 1 ? styles.disabled : ''}`}
//                 onClick={goToNext}
//                 disabled={currentSlide === uniqueMedia.length - 1}
//                 aria-label="Next slide"
//                 style={{
//                   pointerEvents: 'auto',
//                   zIndex: 1000,
//                   position: 'absolute'
//                 }}
//               >
//                 <FaChevronRight />
//               </button>
//             </>
//           )}

//           {loaded && instanceRef.current && uniqueMedia.length > 1 && (
//             <div
//               className={styles.dots}
//               style={{
//                 pointerEvents: 'auto',
//                 zIndex: 1000,
//                 position: 'relative'
//               }}
//             >
//               {[
//                 ...Array(
//                   instanceRef.current.track.details.slides.length
//                 ).keys(),
//               ].map((idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => instanceRef.current?.moveToIdx(idx)}
//                   className={`${styles.dot} ${currentSlide === idx ? styles.active : ""
//                     }`}
//                   aria-label={`Go to slide ${idx + 1}`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     }

//     return (
//       <div onClick={(e) => handleNavigate(e, postId)} className={styles.textPost}>
//         <p>
//           {content.slice(0, 100)}
//           {content.length > 100 && (
//             <span
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleNavigatePost(postId);
//               }}
//               className={styles.readMore}
//             >
//               {" "}{t("readMore")}
//             </span>
//           )}
//         </p>
//       </div>
//     );
//   };

//   // Render reaction buttons
//   const renderReactionButtons = () => (
//     <div ref={reactionsRef} data-tour={"post-actions"} className={styles.reactionBtns}>
//       <button onClick={handleDo} className={styles.btn} aria-label="Do It">
//         <FaCheckSquare style={{ fill: userDo ? "#006633" : "#97B00F" }} />
//         <p>
//           <span>{t("do")}</span>
//         </p>
//       </button>

//       <button className={styles.btn} onClick={handleLike} aria-label="Like">
//         <AiFillLike style={{ fill: userLiked ? "#006633" : "#97B00F" }} />
//         <p>
//           <span>
//             {likeCount}
//           </span>
//         </p>
//       </button>

//       <button
//         onClick={handleDislike}
//         className={styles.btn}
//         aria-label="Unlike"
//       >
//         <AiFillDislike style={{ fill: userDisliked ? "#006633" : "#97B00F" }} />
//         <p>
//           <span>
//             {dislikeCount}
//           </span>
//         </p>
//       </button>
//       <div onClick={(e) => e.stopPropagation()}>
//         <CommentButton
//           postId={postId}
//           commentsCount={comments}
//           post={post}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {renderContent()}
//       {renderReactionButtons()}
//     </>
//   );
// }

// export default PostSlider;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import styles from "./PostSlider.module.css";
import Image from "next/image";
import { FaCheckSquare, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useLocale } from "next-intl";
import { ReactionType, Props } from "./types/postSlider.data";
import { useAppDispatch } from "@/store/hooks";
import { setUpdateState } from "@/store/features/update/updateSlice";
import attached from "@/../public/ZPLATFORM/post/attach.jpg";
import foot from "@/../public/logo/foot.png";
import { useTranslations } from "next-intl";
import CommentButton from "@/Utils/commentButton/CommentButton";
import ToastNot from "@/Utils/ToastNotification/ToastNot"
import linkifyText from "@/Utils/textFormatting/linkify";
import linkifyStyles from "@/Utils/textFormatting/linkify.module.css";

function PostSlider(props: Props) {
  const router = useRouter();
  const locale = useLocale();
  const {
    post,
    media,
    content,
    commentPage,
    setPostComments,
    likes,
    comments,
    dislikes,
    userReactionType,
    hasDoReaction,
    postId,
    setPostMedia,
  } = props;
  const t = useTranslations("web.main.feeds");
  const localS = getToken();
  const accessToken = localS ? localS.accessToken : null;

  // Manual slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const navigateToPost = useCallback(
    (postId: string) => {
      router.push(`/${locale}/feeds/posts/${postId}`);
    },
    [router, locale]
  );

  // Static state for like/dislike UI
  const [likeCount, setLikeCount] = useState(parseInt(likes));
  const [dislikeCount, setDislikeCount] = useState(parseInt(dislikes));
  const [userLiked, setUserLiked] = useState(userReactionType === "like");
  const [userDisliked, setUserDisliked] = useState(
    userReactionType === "dislike"
  );
  const [userDo, setUserDo] = useState(hasDoReaction);

  // API base URL constant
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKENDAPI;

  const uniqueMedia = useMemo(
    () =>
      media && media.length > 0
        ? media.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        )
        : [],
    [media]
  );

  // Initialize slider
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Manual slider navigation functions
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide < uniqueMedia.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Create ref for reactions container
  const reactionsRef = useRef<HTMLDivElement>(null);

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
        setPostMedia(uniqueMedia);
        return response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
    },
    [API_BASE_URL, accessToken, setPostComments, setPostMedia, uniqueMedia]
  );

  // Load comments when page changes
  useEffect(() => {
    if (commentPage > 1) {
      fetchComments(postId, commentPage);
    }
  }, [commentPage, postId, fetchComments]);

  // Handle reaction API calls
  const handleToggleReaction = useCallback(
    async (reactionType: ReactionType) => {
      if (!accessToken) return;

      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/posts/reactions/toggle-reaction`,
          {
            reactionableType: "post",
            reactionableId: postId,
            reactionType,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } catch (error) {
        console.error("Error toggling reaction:", error);
        // Revert UI state on error
        if (reactionType === "like") {
          setUserLiked(userReactionType === "like");
          setLikeCount(parseInt(likes) || 0);

        } else if (reactionType === "dislike") {
          setUserDisliked(userReactionType === "dislike");
          setDislikeCount(parseInt(dislikes) || 0);
        } else if (reactionType === "do") {
          setUserDo(hasDoReaction);
          ToastNot(hasDoReaction ? "Removed from my challenges" : "Added to my challenges");
        }
      }
    },
    [
      accessToken,
      API_BASE_URL,
      postId,
      userReactionType,
      likes,
      dislikes,
      hasDoReaction,
    ]
  );

  // Handle like button click with optimistic UI update and prevent navigation
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleReaction("like");
    if (userLiked) {
      setLikeCount((prevCount) => Math.max(0, prevCount - 1));
      setUserLiked(false);
    } else if (userDisliked) {
      setDislikeCount((prevCount) => Math.max(0, prevCount - 1));
      setLikeCount((prevCount) => prevCount + 1);
      setUserDisliked(false);
      setUserLiked(true);
    } else {
      setLikeCount((prevCount) => prevCount + 1);
      setUserLiked(true);
    }
  };

  // Handle dislike button click with optimistic UI update and prevent navigation
  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleReaction("dislike");
    if (userDisliked) {
      setDislikeCount((prevCount) => Math.max(0, prevCount - 1));
      setUserDisliked(false);
    } else if (userLiked) {
      setLikeCount((prevCount) => Math.max(0, prevCount - 1));
      setDislikeCount((prevCount) => prevCount + 1);
      setUserLiked(false);
      setUserDisliked(true);
    } else {
      setDislikeCount((prevCount) => prevCount + 1);
      setUserDisliked(true);
    }
  };

  // Handle do button click with optimistic UI update and prevent navigation
  const dispatch = useAppDispatch();
  const handleDo = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setUpdateState());
    handleToggleReaction("do");
    if (hasDoReaction) {
      setUserDo(!userDo);
    } else if (userDo) {
      setUserDo(false);
    } else {
      setUserDo(true);
    }
  };

  // Navigate to full post
  const handleNavigatePost = (postId: string) => {
    router.push(`/${locale}/feeds/posts/${postId}`);
  };

  // Handle navigation with event checking
  const handleNavigate = (e: React.MouseEvent, postId: string) => {
    if (reactionsRef.current && reactionsRef.current.contains(e.target as Node)) {
      return;
    }
    navigateToPost(postId);
  };

  // Render media slider or text content
  const renderContent = () => {
    if (uniqueMedia.length > 0) {
      return (
        <div className={styles.navigationWrapper}>
          <div
            ref={sliderRef}
            className={`${styles.manualSlider} ${uniqueMedia.length === 1 ? styles.singleMediaSlider : ''}`}
            onClick={(e) => handleNavigate(e, postId)}
            onScrollCapture={(e) => e.preventDefault()}
          >
            <div
              className={styles.sliderTrack}
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              {uniqueMedia.map((imageUrl, index) => (
                <div
                  key={imageUrl.id || index}
                  className={`${styles.slide} ${styles.postCard}`}
                >
                  <div className={styles.image}>
                    <div className={styles.overlay}></div>
                    <Image
                      src={
                        imageUrl.mediaType === "image"
                          ? imageUrl.mediaUrl
                          : imageUrl.mediaType === "document"
                            ? attached
                            : foot
                      }
                      alt={`Post image ${index + 1}`}
                      loading="lazy"
                      width={1000}
                      height={1000}
                      className={styles.postImage}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {loaded && uniqueMedia.length > 1 && (
            <>
              <button
                className={`${styles.navArrow} ${styles.navArrowLeft} ${currentSlide === 0 ? styles.disabled : ''}`}
                onClick={goToPrevious}
                disabled={currentSlide === 0}
                aria-label="Previous slide"
              >
                <FaChevronLeft />
              </button>
              <button
                className={`${styles.navArrow} ${styles.navArrowRight} ${currentSlide === uniqueMedia.length - 1 ? styles.disabled : ''}`}
                onClick={goToNext}
                disabled={currentSlide === uniqueMedia.length - 1}
                aria-label="Next slide"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Dots Navigation */}
          {loaded && uniqueMedia.length > 1 && (
            <div className={styles.dots}>
              {uniqueMedia.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`${styles.dot} ${currentSlide === idx ? styles.active : ""}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div onClick={(e) => handleNavigate(e, postId)} className={styles.textPost}>
        {/* <p>
          {content.slice(0, 100)}
          {content.length > 100 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleNavigatePost(postId);
              }}
              className={styles.readMore}
            >
              {" "}{t("readMore")}
            </span>
          )}
        </p> */}
        <p>{linkifyText(post.post.content, {
          className: linkifyStyles['content-link'],
          target: "_blank",
          maxLinkTextLength: 40,
          detectBrTags: true,
        })}</p>
      </div>
    );
  };

  // Render reaction buttons
  const renderReactionButtons = () => (
    <div ref={reactionsRef} data-tour={"post-actions"} className={styles.reactionBtns}>
      <button onClick={handleDo} className={styles.btn} aria-label="Do It">
        <FaCheckSquare style={{ fill: userDo ? "#006633" : "#97B00F" }} />
        <p>
          <span>{t("do")}</span>
        </p>
      </button>

      <button className={styles.btn} onClick={handleLike} aria-label="Like">
        <AiFillLike style={{ fill: userLiked ? "#006633" : "#97B00F" }} />
        <p>
          <span>{likeCount}</span>
        </p>
      </button>

      <button
        onClick={handleDislike}
        className={styles.btn}
        aria-label="Unlike"
      >
        <AiFillDislike style={{ fill: userDisliked ? "#006633" : "#97B00F" }} />
        <p>
          <span>{dislikeCount}</span>
        </p>
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        <CommentButton
          postId={postId}
          commentsCount={comments}
          post={post}
        />
      </div>
    </div>
  );

  return (
    <>
      {renderContent()}
      {renderReactionButtons()}
    </>
  );
}

export default PostSlider;