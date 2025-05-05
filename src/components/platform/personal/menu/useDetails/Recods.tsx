"use client";
import React from "react";
import styles from "./userDetails.module.scss";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import noPic from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useTranslations } from "next-intl";
function Recods() {
  const t = useTranslations("web.personal.records")
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const userDetails = useAppSelector((state) => state.login.user);
  const [userReactions, setUserReactions] = React.useState<{
    commentsCount: number;
    postsCount: number;
    reactionsCount: number;
  }>({
    commentsCount: 0,
    postsCount: 0,
    reactionsCount: 0,
  });

  React.useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/score/user-stats`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        setUserReactions(res.data);
      });
  }, [accessToken]);
  return (
    <>
      <div className={styles.recordContainer}>
        <div className={styles.recordUser}>
          <div className={styles.userImage}>
            <Image
              src={userDetails?.user.avatar ? userDetails?.user.avatar : noPic}
              width={44}
              height={49}
              alt="userImage"
            />
          </div>
          <div className={styles.userName}>
            <label>{userDetails?.user.username}</label>
          </div>
        </div>
        <div className={styles.recordDetails}>
          <div className={styles.record}>
            <label>{userReactions?.postsCount}</label>
            <p>{t("posts")}</p>
          </div>
          <div className={styles.record}>
            <label>{userReactions?.reactionsCount}</label>
            <p>{t("reactions")}</p>
          </div>
          <div className={styles.record}>
            <label>{userReactions?.commentsCount}</label>
            <p>{t("comments")}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Recods;
