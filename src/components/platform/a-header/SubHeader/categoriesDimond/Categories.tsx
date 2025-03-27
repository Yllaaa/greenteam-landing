/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./categories.module.css";
import Image from "next/image";
import diamond from "@/../public/ZPLATFORM/categories/GroupD.png";
import community from "@/../public/ZPLATFORM/categories/community.svg";
import art from "@/../public/ZPLATFORM/categories/art.svg";
import eco from "@/../public/ZPLATFORM/categories/eco.svg";
import food from "@/../public/ZPLATFORM/categories/food.svg";
import know from "@/../public/ZPLATFORM/categories/know.svg";
import physical from "@/../public/ZPLATFORM/categories/physical.svg";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";

interface TopicScore {
  topicId: number;
  topicName: string;
  totalPoints: string;
}

function Categories() {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topicScores, setTopicScores] = useState<TopicScore[]>([]);
  const [subTopicScores, setSubTopicScores] = useState<TopicScore[]>([]);

  // Mapping between component categories and backend topic names
  const categoryMapping = {
    know: { name: "Knowledge And Values" },
    food: { name: "Food And Health" },
    physical: { name: "Physical And Mental Exercise" },
    community: { name: "Community And Nature" },
    art: { name: "Art" },
    eco: { name: "Ecotechnologies" },
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/score/main-topics`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setTopicScores(res.data);
      })
      .catch((error) => {
        console.error("Error fetching topic scores:", error);
      });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<
    | keyof typeof categoryMapping
    | "community"
    | "food"
    | "eco"
    | "know"
    | "art"
    | "physical"
  >("community");

  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: keyof typeof categoryMapping) => {
    const selectedTopic = categoryMapping[category].name;
    const topicId = topicScores.find(
      (topic) => topic.topicName === selectedTopic
    )?.topicId;

    // Fetch sub-topics for the selected category
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/score/sub-topics/${topicId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        // Filter out topics with 0 points and sort by points in descending order
        const filteredScores = res.data
          // .filter((topic: TopicScore) => parseInt(topic.totalPoints) > 0)
          // .sort(
          //   (a: TopicScore, b: TopicScore) =>
          //     parseInt(b.totalPoints) - parseInt(a.totalPoints)
          // )
          // .slice(0, 6); // Take top 6 topics

        setSubTopicScores(filteredScores);
        setSelectedCategory(category);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching sub-topic scores:", error);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  useEffect(() => {
    const htmlElelemtTag = document.documentElement;
    if (isModalOpen) {
      htmlElelemtTag.style.overflow = "hidden";
    } else {
      htmlElelemtTag.style.overflow = "unset";
    }
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory("community");
  };

  const HEX_RADIUS = 43;

  const getPoint = (value: number, angle: number) => {
    const radius = (value / 100) * HEX_RADIUS; // Scale value to adjusted hex radius
    const radian = (angle - 90) * (Math.PI / 180); // Convert angle to radians
    const x = 50 + radius * Math.cos(radian); // Center X at 50
    const y = 50 + radius * Math.sin(radian); // Center Y at 50
    return `${x},${y}`;
  };

  // Get points based on actual topic scores
  const getScaledPoints = (scores?: TopicScore[]) => {
    // If no scores, return random points
    if (!scores || scores.length === 0) {
      return [
        getPoint(Math.floor(0), 0),
        getPoint(Math.floor(0), 60),
        getPoint(Math.floor(0), 120),
        getPoint(Math.floor(0), 180),
        getPoint(Math.floor(0), 240),
        getPoint(Math.floor(0), 300),
      ].join(" ");
    }

    // Map points to create hexagon
    const points = scores.map((score, index) => {
      const value = Math.min(parseInt(score.totalPoints), 100);
      return getPoint(value, index * 60);
    });

    // If fewer than 6 points, pad with zeros
    while (points.length < 6) {
      points.push(getPoint(0, points.length * 60));
    }

    return points.join(" ");
  };

  return (
    <>
      <div style={{ zIndex: 0 }} className={styles.container}>
        <div style={{ zIndex: 11 }} className={styles.chart}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points={getScaledPoints(topicScores)}
              className={styles.filledArea}
            />
          </svg>
        </div>
        <div style={{ zIndex: 10 }} className={styles.diamondShape}>
          <Image src={diamond} alt="diamond" />
        </div>
        <div style={{ zIndex: 1000 }} className={styles.labels}>
          {Object.entries(categoryMapping).map(([key, value]) => {
            const categoryIcons = {
              community: community,
              food: food,
              eco: eco,
              know: know,
              art: art,
              physical: physical,
            };

            const iconSrc = categoryIcons[key as keyof typeof categoryIcons];

            return (
              <span
                key={key}
                onClick={() =>
                  handleCategoryClick(key as keyof typeof categoryMapping)
                }
                className={`${styles.label} ${
                  styles[`top${Object.keys(categoryMapping).indexOf(key) + 1}`]
                }`}
              >
                <Image src={iconSrc} alt={key} />
              </span>
            );
          })}
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && selectedCategory && (
        <div className={styles.modal}>
          <div ref={modalRef} className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>

            <div className={styles.subCategories}>
              <h2>{categoryMapping[selectedCategory].name.toUpperCase()}</h2>

              <div style={{ zIndex: 11 }} className={styles.chart}>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon
                    points={getScaledPoints(subTopicScores)}
                    className={styles.filledArea}
                  />
                </svg>
              </div>
              <div style={{ zIndex: 10 }} className={styles.diamondShape}>
                <Image src={diamond} alt="diamond" />
              </div>
              <div style={{ zIndex: 1000 }} className={styles.labels}>
                {subTopicScores.map((subTopic, index) => (
                  <span
                    key={subTopic.topicId}
                    className={`${styles.label} ${styles.subLabel} ${styles[`top${index + 1}${index + 1}`]}`}
                  >
                    {subTopic.topicName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Categories;
