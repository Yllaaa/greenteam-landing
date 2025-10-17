/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./news.module.css";
import { useKeenSlider } from "keen-slider/react";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { useTranslations } from "next-intl";
import axios from "axios";
import Image from "next/image";
import LinkifyText from "@/Utils/textFormatting/linkify";
import linkifyStyles from "@/Utils/textFormatting/linkify.module.css";

function News() {
  const t = useTranslations('landing.news');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [posts, setPosts] = useState<any>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize slider only when posts are loaded
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      loop: true,
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 1, spacing: 25 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3, spacing: 25 },
        },
      },
      slides: { perView: 1 },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    }
  );

  const getPosts = async () => {
    setPostsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts?limit=10&mainTopicId=6&page=1`
      );
      setPosts(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const card = (post: any) => {
    return (
      <div className={styles.card}>
        {/* Display post image if available */}
        <div className={styles.img}>
          {post.media?.length > 0 && (
            <Image
              src={post.media[0].mediaUrl}
              alt={post.title || ''}
              width={300}
              height={300}
              loading="lazy"
            />
          )}
        </div>

        {/* Display post category/type */}
        <div className={styles.title}>
          <h5>{post.category || post.type || post.author?.type || t('technology')}</h5>
        </div>

        {/* Display post title */}
        <div className={styles.context}>
          {/* <h5>
            {post.post?.content ?
              (post.post.content.length > 100 ?
                post.post.content.slice(0, 100) + "..." :
                post.post.content) :
              t('ultimate')
            }
          </h5> */}
          <h5>{
            <LinkifyText
              text={post.post.content}
              options={{
                className: linkifyStyles["content-link"],
                target: "_blank",
                readMoreText: "Read More...",
                readLessText: " Read Less",
                maxTextLength: 50
              }}
            />
          }</h5>
        </div>

        {/* Display post excerpt/description */}
        <div className={styles.text}>
          <h5>
            {post.excerpt || post.description || t('AIWont')}
          </h5>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.user}>
            {/* Display author avatar if available */}
            <div className={styles.img}>
              {post.author?.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name || ''}
                  width={40}
                  height={40}
                  loading="lazy"
                />
              )}
            </div>
            {/* Display author name */}
            <div className={styles.name}>
              {post.author?.name || t('hannah')}
            </div>
          </div>
          <div className={styles.readMore}>
            {/* Link to the actual post */}
            <Link href={post.slug ? `/posts/${post.slug}` : `/posts/${post.id}` || ''}>
              {t('readMore')}
            </Link>
            <FaArrowRight />
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (postsLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.newsHeader}>
          <div className={styles.title}>
            <h5>{t('news')}</h5>
            <h3>{t('seeGreenTeam')}</h3>
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}>Loading...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.newsHeader}>
          <div className={styles.title}>
            <h5>{t('news')}</h5>
            <h3>{t('seeGreenTeam')}</h3>
          </div>
        </div>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={getPosts}>Try Again</button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!posts || posts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.newsHeader}>
          <div className={styles.title}>
            <h5>{t('news')}</h5>
            <h3>{t('seeGreenTeam')}</h3>
          </div>
        </div>
        <div className={styles.emptyContainer}>
          <p>No posts available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.newsHeader}>
        <div className={styles.title}>
          <h5>{t('news')}</h5>
          <h3>{t('seeGreenTeam')}</h3>
        </div>
        <div className={styles.arrows}>
          {loaded && instanceRef.current && posts.length > 0 && (
            <>
              <Arrow
                left
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.prev()
                }
                disabled={currentSlide === 0 && !instanceRef.current.options.loop}
              />

              <Arrow
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.next()
                }
                disabled={
                  !instanceRef.current.options.loop &&
                  currentSlide ===
                  instanceRef.current.track.details.slides.length - 1
                }
              />
            </>
          )}
        </div>
      </div>
      <div className={styles.newsSlider}>
        <div
          ref={sliderRef}
          className={`keen-slider ${styles.slider}`}
        >
          {posts.map((post: any, index: number) => (
            <div key={post.id || index} className={`keen-slider__slide ${styles.slide}`}>
              {card(post)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;

function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}) {
  const disabled = props.disabled ? styles.arrowDisabled : "";
  return (
    <svg
      onClick={props.onClick}
      className={`${styles.arrow} ${props.left ? styles.arrowLeft : styles.arrowRight
        } ${disabled}`}
      style={{ width: "64px" }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && <FaArrowLeft />}
      {!props.left && <FaArrowRight />}
    </svg>
  );
}