"use client";
import React from "react";
import styles from "./SubHeader.module.css";

import Categories from "../../categoriesDimond/Categories";
import Suggested from "../../suggested/Suggested";
import MyChallenges from "../../suggested/challenges/myChallenges/MyChallenges";
import Link from "next/link";
import Image from "next/image";

import likes from "@/../public/ZPLATFORM/header/like.svg";
import post from "@/../public/ZPLATFORM/header/posts.svg";
import message from "@/../public/ZPLATFORM/header/message.svg";
import addNew from "@/../public/ZPLATFORM/header/addNew.svg";
import { useLocale } from "next-intl";
function SubHeader() {
  const locale = useLocale();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.diamond}>
          <Categories />
          <div className={styles.links}>
            <div className={styles.link}>
              <Link href="/">
                <span>125 likes</span>
                <Image src={likes} alt="like" />
              </Link>
            </div>
            <div className={styles.link}>
              <Link href="/">
                <span>125 message</span>
                <Image src={message} alt="like" />
              </Link>
            </div>
            <div className={styles.link}>
              <Link href="/">
                <span>125 posts</span>
                <Image src={post} alt="posts" />
              </Link>
            </div>
            <div className={styles.link}>
              <Link href={`/${locale}/personal/newPost`}>
                <span>Add post</span>
                <Image src={addNew} alt="add" />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.suggested}>
          <Suggested />
        </div>
        <div className={styles.challenges}>
          <MyChallenges />
        </div>
      </div>
    </>
  );
}

export default SubHeader;
