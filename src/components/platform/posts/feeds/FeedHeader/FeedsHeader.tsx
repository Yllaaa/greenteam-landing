/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import styles from "./FeedsHeader.module.css";
import { useSearchParams } from "next/navigation";
import { SingleTopicsData } from "../TYPES/FeedTypes";
import artIcon from "@/../public/ZPLATFORM/categories/art.svg";
import food from "@/../public/ZPLATFORM/categories/food.svg";
import know from "@/../public/ZPLATFORM/categories/physical.svg";
import physical from "@/../public/ZPLATFORM/categories/eco.svg";
import eco from "@/../public/ZPLATFORM/categories/know.svg";
import community from "@/../public/ZPLATFORM/categories/community.svg";
import { useTranslations } from "next-intl";

function FeedsHeader(props: {
  topic?: SingleTopicsData | any;
  setSelectedSubtopics: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >;
  selectedSubtopics: { [key: number]: string };
}) {
  const { topic, setSelectedSubtopics, selectedSubtopics } = props;
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const subcategoryId = searchParams.get('subcategory');
  const tt = useTranslations("web.header.topics");

  const topicLogo: { id: number; logo: string }[] = [
    { id: 1, logo: food },
    { id: 2, logo: know },
    { id: 3, logo: physical },
    { id: 4, logo: community },
    { id: 5, logo: artIcon },
    { id: 6, logo: eco },
  ];

  // Use URL parameters to set selected subtopic if it matches this header's topic
  useEffect(() => {
    if (categoryId && Number(categoryId) === Number(topic?.id) && subcategoryId) {
      setSelectedSubtopics((prev) => ({
        ...prev,
        [Number(categoryId)]: subcategoryId,
      }));
    }
  }, [categoryId, subcategoryId, topic?.id, setSelectedSubtopics]);

  const handleSubTopicChange = (topicId: number, subtopicId: string) => {
    setSelectedSubtopics((prev) => ({
      ...prev,
      [topicId]: subtopicId,
    }));
    
    // Optionally: Update URL with new selection without page reload
    // using history.replaceState to update the URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('category', topicId.toString());
      url.searchParams.set('subcategory', subtopicId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const isActive = (topicId: number, subtopicId: string) => {
    return selectedSubtopics[topicId] === subtopicId ||
          (categoryId === topicId.toString() && subcategoryId === subtopicId);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3 data-tour={topic.id === 1 ? "topic-title" : undefined}>
            <span className={styles.titleIcon}>
              <Image
                src={topicLogo[Number(topic?.id) - 1]?.logo}
                alt="artIcon"
                loading="lazy"
                className={styles.titleIcon}
                width={30}
                height={30}
              />
            </span>{" "}
            <span className={styles.titleText}>{tt(topic?.name)}</span>
          </h3>
        </div>
        <div data-tour={topic.id === 1 ? "subtopic-filters" : undefined} className={styles.filterSection}>
          <ul>
            <li
              className={selectedSubtopics[Number(topic?.id)] === "all" ? styles.activeSubtopic : ''}
              style={
                selectedSubtopics[Number(topic?.id)] === "all"
                  ? { color: "#97B00F", opacity: 1 }
                  : { color: "" }
              }
              onClick={() => handleSubTopicChange(Number(topic?.id), "all")}
            >
              all
            </li>
            {topic?.subtopics.map((subtopic: any, index: number) => (
              <li
                key={index}
                className={isActive(Number(topic.id), subtopic.id.toString()) ? styles.activeSubtopic : ''}
                style={
                  selectedSubtopics[Number(topic.id)] === subtopic.id.toString()
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() =>
                  handleSubTopicChange(Number(topic.id), subtopic.id.toString())
                }
              >
                {tt(subtopic.name)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default FeedsHeader;