/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import React, { useEffect } from "react";
import styles from "./singlePost.module.css";
import axios from "axios";

type Props = {
  postId: string;
};
function SinglePost(props: Props) {
  const localS = localStorage.getItem("user");
  const accessToken = localS ? JSON.parse(localS).accessToken : null;

  const { postId } = props;
  const [comments, setComments] = React.useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/${postId}/comments?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.postContent}></div>
        <div className={styles.postImages}></div>
        <div className={styles.postComments}>
          {comments.length > 0
            ? comments && <p>test comments</p>
            : "No comments"}
        </div>
      </div>
    </>
  );
}

export default SinglePost;
