// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React, {
//   useEffect,
//   lazy,
//   Suspense,
//   useState,
//   useCallback,
//   useRef,
// } from "react";
// import axios from "axios";
// import styles from "./PostForum.module.css";

// import LoadingTree from "@/components/zaLoader/LoadingTree";
// import { getToken } from "@/Utils/userToken/LocalToken";
// import ForumFilter from "./filterComponent/ForumFilter";
// import { CommentModal } from "../feeds/commentModal/CommentModal";
// import toRight from "@/../public/ZPLATFORM/A-iconsAndBtns/ToRights.svg";
// import Image from "next/image";
// const ForumCard = lazy(() => import("./ForumsCard/ForumCard"));

// function PostForums() {
//   const localeS = getToken();
//   const accessToken = localeS ? localeS.accessToken : null;

//   // Modals and state
//   const [commentModal, setCommentModal] = useState(false);
//   const [postComments, setPostComments] = useState<Comment[]>([]);
//   const [postId, setPostId] = useState<string>("");
//   const [commentsPage, setCommentsPage] = useState(1);
//   const [rerender, setRerender] = useState(false);

//   const [posts, setPosts] = useState<any[]>([]);
//   const [section, setSection] = useState<"doubt" | "need" | "dream" | "all">(
//     "all"
//   );

//   const limit = "5";
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [prevPage, setPrevPage] = useState(page);

//   // Refs and scroll state
//   const bodyRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);

//   // Fetch posts effect
//   useEffect(() => {
//     axios
//       .get(
//         `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/forum?limit=${limit}&${
//           section === "all" ? "" : `section=${section}`
//         }&page=${page}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//             "Access-Control-Allow-Origin": "*",
//           },
//         }
//       )
//       .then((res) => {
//         console.log("res", res.data);

//         setIsLoading(false);
//         setPosts((prev) => {
//           // If page changed, append data
//           if (prevPage !== page && page !== 1) {
//             return [...prev, ...res.data];
//           }
//           // If section or mainTopicId changed, replace data
//           return res.data;
//         });

//         setPrevPage(page); // Store the previous page for comparison
//       })
//       .catch((err) => {
//         setErrorMessage("An Error Occurred");
//         setIsLoading(false);
//         console.error(err);
//       });
//   }, [section, page, accessToken]);

//   // Check scroll position and update scroll buttons
//   const checkScrollPosition = useCallback(() => {
//     if (bodyRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = bodyRef.current;
//       const scrollableWidth = scrollWidth - clientWidth;

//       setCanScrollLeft(scrollLeft > 0);
//       setCanScrollRight(scrollLeft < scrollableWidth);
//     }
//   }, []);

//   // Initial mount and scroll position check
//   useEffect(() => {
//     // Delay initial check to ensure DOM is fully rendered
//     const checkInitialScroll = () => {
//       if (bodyRef.current) {
//         const { scrollWidth, clientWidth } = bodyRef.current;
//         setCanScrollRight(scrollWidth > clientWidth);
//       }
//     };

//     // Check immediately after posts are loaded
//     checkInitialScroll();

//     // Additional check after a short delay to handle any rendering issues
//     const timer = setTimeout(checkInitialScroll, 100);

//     const currentRef = bodyRef.current;
//     if (currentRef) {
//       currentRef.addEventListener("scroll", checkScrollPosition);

//       // Add resize observer to handle dynamic content changes
//       const resizeObserver = new ResizeObserver(checkInitialScroll);
//       resizeObserver.observe(currentRef);

//       return () => {
//         currentRef.removeEventListener("scroll", checkScrollPosition);
//         resizeObserver.disconnect();
//         clearTimeout(timer);
//       };
//     }
//   }, [checkScrollPosition, posts]);

//   // Scroll handlers with improved navigation
//   const prevSlide = useCallback(() => {
//     if (bodyRef.current) {
//       bodyRef.current.scrollBy({
//         left: -300,
//         behavior: "smooth",
//       });
//     }
//   }, []);

//   const nextSlide = useCallback(() => {
//     if (bodyRef.current) {
//       bodyRef.current.scrollBy({
//         left: 300,
//         behavior: "smooth",
//       });
//     }
//   }, []);

//   return (
//     <>
//       <div className={styles.container}>
//         <ForumFilter
//           section={section}
//           setPage={setPage}
//           setSection={setSection}
//         />
//         <div className={styles.body}>
//           {isLoading ? (
//             <div className={styles.noPosts}>
//               <LoadingTree />
//             </div>
//           ) : errorMessage === "" ? (
//             posts.length === 0 ? (
//               <div className={styles.noPosts}>
//                 <p>No posts found</p>
//               </div>
//             ) : (
//               <Suspense
//                 fallback={
//                   <div className={styles.noPosts}>
//                     <LoadingTree />
//                   </div>
//                 }
//               >
//                 {posts.length > 0 && (
//                   <div className={styles.sliderBtns}>
//                     <div
//                       className={`${styles.arrow} ${
//                         !canScrollLeft ? styles.disabled : ""
//                       }`}
//                       onClick={prevSlide}
//                     >
//                       <Image
//                         src={toRight}
//                         alt="right arrow"
//                         width={100}
//                         height={100}
//                         style={{ transform: "rotateY(180deg)" }}
//                       />
//                     </div>
//                     <div
//                       className={`${styles.arrow} ${
//                         !canScrollRight ? styles.disabled : ""
//                       }`}
//                       onClick={nextSlide}
//                     >
//                       <Image
//                         src={toRight}
//                         alt="right arrow"
//                         width={100}
//                         height={100}
//                       />
//                     </div>
//                   </div>
//                 )}
//                 <div
//                   ref={bodyRef}
//                   className={styles.content}
//                   onScroll={checkScrollPosition}
//                 >
//                   {posts.map((post, index) => (
//                     <div key={post.id}>
//                       <ForumCard
//                         key={post.id}
//                         section={section}
//                         post={post}
//                         index={index}
//                         page={page}
//                         setPage={setPage}
//                         length={posts.length}
//                         commentPage={commentsPage}
//                         setCommentPage={setCommentsPage}
//                         setCommentModal={setCommentModal}
//                         setPostComments={setPostComments}
//                         setPostId={setPostId}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </Suspense>
//             )
//           ) : (
//             <div className={styles.noPosts}>
//               <p>{errorMessage}</p>
//             </div>
//           )}
//         </div>
//       </div>
//       {commentModal && (
//         <CommentModal
//           commentsPage={commentsPage}
//           setCommentsPage={setCommentsPage}
//           setCommentModal={setCommentModal}
//           postComments={postComments}
//           rerender={rerender}
//           setRerender={setRerender}
//           setPostComments={setPostComments}
//           postId={postId}
//         />
//       )}
//     </>
//   );
// }

// export default PostForums;

"use client";
import React, {
  useEffect,
  lazy,
  Suspense,
  useState,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import styles from "./PostForum.module.css";
import { useQuery } from "@tanstack/react-query";

import LoadingTree from "@/components/zaLoader/LoadingTree";
import { getToken } from "@/Utils/userToken/LocalToken";
import ForumFilter from "./filterComponent/ForumFilter";
import { CommentModal } from "../feeds/commentModal/CommentModal";
import toRight from "@/../public/ZPLATFORM/A-iconsAndBtns/ToRights.svg";
import Image from "next/image";
const ForumCard = lazy(() => import("./ForumsCard/ForumCard"));

type Author = {
  id: string;
  fullName: string;
  avatar: string | null;
  username: string;
};

type Post = {
  id: string;
  headline: string;
  content: string;
  mediaUrl: string | null;
  createdAt: string;
  author: Author;
  commentCount: number;
  userReaction: "like" | "dislike" | "sign" | null;
  dislikeCount: number;
  section: string;
  likeCount: number;
  signCount: number;
};

function PostForums() {
  const localeS = getToken();
  const accessToken = localeS ? localeS.accessToken : null;

  // Modals and state
  const [commentModal, setCommentModal] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [postId, setPostId] = useState<string>("");
  const [commentsPage, setCommentsPage] = useState(1);
  const [rerender, setRerender] = useState(false);

  const [section, setSection] = useState<"doubt" | "need" | "dream" | "all">(
    "all"
  );
  const limit = 5;
  const [page, setPage] = useState(1);

  // Refs and scroll state
  const bodyRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Use react-query to fetch forums
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["forums", section, page, limit],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/forum?limit=${limit}&${
          section === "all" ? "" : `section=${section}`
        }&page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      return response.data;
    },
    enabled: !!accessToken,
  });

  // Check scroll position and update scroll buttons
  const checkScrollPosition = useCallback(() => {
    if (bodyRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = bodyRef.current;
      const scrollableWidth = scrollWidth - clientWidth;

      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollableWidth);
    }
  }, []);

  // Initial mount and scroll position check
  useEffect(() => {
    // Delay initial check to ensure DOM is fully rendered
    const checkInitialScroll = () => {
      if (bodyRef.current) {
        const { scrollWidth, clientWidth } = bodyRef.current;
        setCanScrollRight(scrollWidth > clientWidth);
      }
    };

    // Check immediately after posts are loaded
    checkInitialScroll();

    // Additional check after a short delay to handle any rendering issues
    const timer = setTimeout(checkInitialScroll, 100);

    const currentRef = bodyRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollPosition);

      // Add resize observer to handle dynamic content changes
      const resizeObserver = new ResizeObserver(checkInitialScroll);
      resizeObserver.observe(currentRef);

      return () => {
        currentRef.removeEventListener("scroll", checkScrollPosition);
        resizeObserver.disconnect();
        clearTimeout(timer);
      };
    }
  }, [checkScrollPosition, posts]);

  // Scroll handlers with improved navigation
  const prevSlide = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        <ForumFilter
          section={section}
          setPage={setPage}
          setSection={setSection}
        />
        <div className={styles.body}>
          {isLoading ? (
            <div className={styles.noPosts}>
              <LoadingTree />
            </div>
          ) : error ? (
            <div className={styles.noPosts}>
              <p>An Error Occurred</p>
            </div>
          ) : posts.length === 0 ? (
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
              {posts.length > 0 && (
                <div className={styles.sliderBtns}>
                  <div
                    className={`${styles.arrow} ${
                      !canScrollLeft ? styles.disabled : ""
                    }`}
                    onClick={prevSlide}
                  >
                    <Image
                      src={toRight}
                      alt="right arrow"
                      width={100}
                      height={100}
                      style={{ transform: "rotateY(180deg)" }}
                    />
                  </div>
                  <div
                    className={`${styles.arrow} ${
                      !canScrollRight ? styles.disabled : ""
                    }`}
                    onClick={nextSlide}
                  >
                    <Image
                      src={toRight}
                      alt="right arrow"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              )}
              <div
                ref={bodyRef}
                className={styles.content}
                onScroll={checkScrollPosition}
              >
                {posts.map((post: Post, index: number) => (
                  <ForumCard
                    key={`${post.id}-${index}`}
                    section={section}
                    post={post}
                    index={index}
                    page={page}
                    setPage={setPage}
                    length={posts.length}
                    commentPage={commentsPage}
                    setCommentPage={setCommentsPage}
                    setCommentModal={setCommentModal}
                    setPostComments={setPostComments}
                    setPostId={setPostId}
                  />
                ))}
              </div>
            </Suspense>
          )}
        </div>
      </div>
      {commentModal && (
        <CommentModal
          commentsPage={commentsPage}
          setCommentsPage={setCommentsPage}
          setCommentModal={setCommentModal}
          postComments={postComments}
          rerender={rerender}
          setRerender={setRerender}
          setPostComments={setPostComments}
          postId={postId}
        />
      )}
    </>
  );
}

export default PostForums;
