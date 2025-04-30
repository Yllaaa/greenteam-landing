/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Image from "next/image";
import styles from "../../SubHeader.module.css";
import toRight from "@/../public/ZPLATFORM/A-iconsAndBtns/ToRights.svg";
import likes from "@/../public/ZPLATFORM/header/like.svg";
import message from "@/../public/ZPLATFORM/header/message.svg";
import addNew from "@/../public/ZPLATFORM/header/addNew.svg";
import post from "@/../public/ZPLATFORM/header/posts.svg";
import { Suspense } from "react";
import Categories from "../../categoriesDimond/Categories";
import GreenChallenges from "../../Green-Challenges/GreenChallenges";
import MyChallenges from "../../doChallenges/myChallenges/MyChallenges";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

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
  userReactions: any;
};
function SubHeaderWeb(props: Props) {
  const {
    setCommentModal,
    postComments,
    setPostComments,
    postId,
    setCommentPage,
    commentPage,
    setRepliesPage,
    repliesPage,
    setRerender,
    rerender,
    setPostId,
    commentModal,
    userReactions,
  } = props;
  const locale = useLocale();
  const t = useTranslations("web.subHeader.actions")

  const actions = [
    {
      icon: likes,
      title: `${userReactions?.reactionsCount} ${t("likes")}`,
      href: "/mylikes",
    },
    {
      icon: message,
      title: `${userReactions.commentsCount} ${t("comments")}`,
      href: "/mycomments",
    },
    {
      icon: post,
      title: `${userReactions.postsCount} ${t("posts")}`,
      href: "#",
    },
    {
      icon: addNew,
      title: t("addPost"),
      href: `addNew/newPost`,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const openSlider = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className={styles.navBtns}>
        <div className={styles.next} onClick={openSlider}>
          <Image
            src={toRight}
            alt="prev"
            width={100}
            height={100}
            loading="lazy"
          />
        </div>
      </div>
      <div className={styles.cardsContainer}>
        <div className={styles.diamond}>
          <Suspense
            fallback={
              <div className={styles.loading}>
                <LoadingTree />
              </div>
            }
          >
            <Categories />
          </Suspense>
        </div>
        <div className={styles.greenChallenge}>
          <Suspense
            fallback={
              <div className={styles.loading}>
                <LoadingTree />
              </div>
            }
          >
            <GreenChallenges />
          </Suspense>
        </div>

        <div
          className={`${styles.subcontainer} ${
            isOpen ? styles.openWindow : styles.closeWindow
          }`}
        >
          <div className={styles.challenges}>
            <Suspense
              fallback={
                <div className={styles.loading}>
                  <LoadingTree />
                </div>
              }
            >
              <MyChallenges
                setCommentModal={setCommentModal}
                postComments={postComments}
                setPostComments={setPostComments}
                postId={postId}
                setCommentPage={setCommentPage}
                commentPage={commentPage}
                setRepliesPage={setRepliesPage}
                repliesPage={repliesPage}
                setRerender={setRerender}
                rerender={rerender}
                setPostId={setPostId}
                commentModal={commentModal}
              />
            </Suspense>
          </div>
        </div>
      </div>
      <div className={styles.links}>
        {actions.map((action) => (
          <div key={action.href} className={styles.link}>
            <Link
              href={`/${locale}/${action.href}`}
              className={
                action.href === `addNew/newPost`
                  ? styles.postLink
                  : styles.regularLink
              }
            >
              <Image src={action.icon} alt={action.title} loading="lazy" />
              <span>{action.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default SubHeaderWeb;
