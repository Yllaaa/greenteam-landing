/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import styles from "./MyChallenges.module.css";
import MyChallengeCard from "./myChallengesCard/MyChallengeCard";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { Post } from "./types/doChallenges.data";

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

  const [challenges, setChallenges] = React.useState<Post[]>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // handle comments

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/do-posts?page=1&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setChallenges(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <>
      <div className={styles.MyContainer}>
        {challenges &&
          challenges.map((challenge) => (
            <div key={challenge.id} className={styles.container}>
              <div className={styles.header}>
                <h2>My Challenges</h2>
              </div>
              <div className={styles.challenges}>
                <div>
                  <MyChallengeCard
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
            </div>
          ))}
      </div>
    </>
  );
}

export default MyChallenges;
