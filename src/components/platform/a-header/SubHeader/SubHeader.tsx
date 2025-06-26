/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import styles from "./SubHeader.module.css";

import SubHeaderWeb from "./Body/Web/SubHeaderWeb";
import SubHeaderRes from "./Body/Responsive/SubHeaderRes";
import { CommentModal } from "@/components/platform/posts/feeds/commentModal/CommentModal";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import AddNewModal from './doChallenges/myChallenges/modal/addNew/AddNewModal';
import { useLocale } from "next-intl";
function SubHeader() {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const locale = useLocale()
  const [endpoint, setEndpoint] = React.useState("");
  const [commentModal, setCommentModal] = React.useState(false);
  const [postComments, setPostComments] = React.useState([]);
  const [postId, setPostId] = React.useState("");
  const [commentPage, setCommentPage] = React.useState(1);
  const [repliesPage, setRepliesPage] = React.useState(1);
  const [rerender, setRerender] = React.useState(false);
  const [userReactions, setUserReactions] = React.useState([]);
  const [postMedia, setPostMedia] = React.useState<
    {
      id: string;
      mediaUrl: string;
      mediaType: string;
    }[]
  >([]);

  React.useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/score/user-stats`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Accept-Language": `${locale}`,
          },
        }
      )
      .then((res) => {
        setUserReactions(res.data);
      });
  }, []);

  const [addNew, setAddNew] = React.useState(false);

  return (
    <>
      {/* web */}
      <div className={styles.container}>
        <SubHeaderWeb
        setEndpoint={setEndpoint}
          commentModal={commentModal}
          setCommentModal={setCommentModal}
          postComments={postComments}
          setPostComments={setPostComments}
          postId={postId}
          setCommentPage={setCommentPage}
          commentPage={commentPage}
          setRepliesPage={setRepliesPage}
          setPostMedia={setPostMedia}
          repliesPage={repliesPage}
          setRerender={setRerender}
          rerender={rerender}
          setPostId={setPostId}
          userReactions={userReactions}
          setAddNew={setAddNew}
        />
      </div>
      {/* responsive */}
      <div className={styles.ResponsiveContainer}>
        <SubHeaderRes
          setEndpoint={setEndpoint}
          commentModal={commentModal}
          setCommentModal={setCommentModal}
          postComments={postComments}
          setPostComments={setPostComments}
          postId={postId}
          setCommentPage={setCommentPage}
          commentPage={commentPage}
          setRepliesPage={setRepliesPage}
          setPostMedia={setPostMedia}
          repliesPage={repliesPage}
          setRerender={setRerender}
          rerender={rerender}
          setPostId={setPostId}
          setAddNew={setAddNew}
        />
      </div>
      {commentModal && (
        <CommentModal
          setCommentModal={setCommentModal}
          postComments={postComments}
          setPostComments={setPostComments}
          postId={postId}
          setCommentsPage={setCommentPage}
          commentsPage={commentPage}
          setRepliesPage={setRepliesPage}
          repliesPage={repliesPage}
          setRerender={setRerender}
          rerender={rerender}
          postMedia={postMedia}
        />
      )}
      {addNew && (
        <AddNewModal
          setAddNew={setAddNew}
          addNew={addNew}
          endpoint={endpoint}
          challengeId={postId}
        />
      )}
    </>
  );
}

export default SubHeader;
