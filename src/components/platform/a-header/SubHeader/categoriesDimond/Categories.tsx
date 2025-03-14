/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./categories.module.css";
import Image from "next/image";
import diamond from "@/../public/ZPLATFORM/categories/diamond.svg";
import community from "@/../public/ZPLATFORM/categories/community.svg";
import art from "@/../public/ZPLATFORM/categories/art.svg";
import eco from "@/../public/ZPLATFORM/categories/eco.svg";
import food from "@/../public/ZPLATFORM/categories/food.svg";
import know from "@/../public/ZPLATFORM/categories/know.svg";
import physical from "@/../public/ZPLATFORM/categories/physical.svg";
// import ReactECharts from "echarts-for-react";

function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<
    | keyof typeof subCategories
    | "community"
    | "food"
    | "eco"
    | "know"
    | "art"
    | "physical"
  >("community");

  const subCategories = {
    community: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5", "Sub 6"],
    food: ["Sub 1", "Sub 2", "Sub 3", "Sub 4"],
    eco: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5"],
    know: ["Sub 1", "Sub 2"],
    art: ["Sub 1", "Sub 2", "Sub 3"],
    physical: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5"],
  };

  // echart modal
  // const option = {
  //   title: {
  //     text: "Referrer of a Website",
  //     subtext: "Fake Data",
  //     left: "center",
  //   },
  //   tooltip: {
  //     trigger: "item",
  //   },
  //   legend: {
  //     orient: "vertical",
  //     left: "left",
  //   },
  //   series: [
  //     {
  //       name: "Referrer",
  //       type: "pie",
  //       radius: "50%",
  //       color: ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#749f83"],

  //       data:
  //         selectedCategory !== undefined
  //           ? subCategories[selectedCategory].map((item, index) => ({
  //               value: subCategories[selectedCategory].length - index,
  //               name: item,
  //             }))
  //           : [],

  //       emphasis: {
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowOffsetX: 0,
  //           shadowColor: "rgba(0, 0, 0, 0.5)",
  //         },
  //       },
  //     },
  //   ],
  // };
  // const { community, food, eco, know, art, physical } = values;

  const modalRef = React.useRef<HTMLDivElement>(null);
  const handleCategoryClick = (category: keyof typeof subCategories) => {
    console.log("category", category);
    setSelectedCategory(category);
    setIsModalOpen(true);
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

  const points = [
    getPoint(Math.floor(Math.random() * 100), 0),
    getPoint(Math.floor(Math.random() * 100), 60),
    getPoint(Math.floor(Math.random() * 100), 120),
    getPoint(Math.floor(Math.random() * 100), 180),
    getPoint(Math.floor(Math.random() * 100), 240),
    getPoint(Math.floor(Math.random() * 100), 300),
  ].join(" ");
  return (
    <>
      <div style={{ zIndex: 0 }} className={styles.container}>
        <div style={{ zIndex: 11 }} className={styles.chart}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points={points} className={styles.filledArea} />
          </svg>
        </div>
        <div style={{ zIndex: 10 }} className={styles.diamondShape}>
          <Image src={diamond} alt="diamond" />
        </div>
        <div style={{ zIndex: 1000 }} className={styles.labels}>
          <span
            onClick={() => handleCategoryClick("community")}
            className={`${styles.label} ${styles.top1}`}
          >
            <Image src={community} alt="community" />
            {/* Community and Nature */}
          </span>
          <span
            onClick={() => handleCategoryClick("food")}
            className={`${styles.label} ${styles.top2}`}
          >
            <Image src={food} alt="food" />
            {/* Food and Health */}
          </span>
          <span
            onClick={() => handleCategoryClick("eco")}
            className={`${styles.label} ${styles.top3}`}
          >
            <Image src={eco} alt="eco" />
            {/* Ecotechnics */}
          </span>
          <span
            onClick={() => handleCategoryClick("know")}
            className={`${styles.label} ${styles.top4}`}
          >
            <Image src={know} alt="know" />
            {/* Knowledge and values */}
          </span>
          <span
            onClick={() => handleCategoryClick("art")}
            className={`${styles.label} ${styles.top5}`}
          >
            <Image src={art} alt="art" />
            {/* Art and Shows */}
          </span>
          <span
            onClick={() => handleCategoryClick("physical")}
            className={`${styles.label} ${styles.top6}`}
          >
            <Image src={physical} alt="physical" />
            {/* Physical and mental */}
          </span>
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
              <h2>{selectedCategory.toUpperCase()}</h2>
              {/* <div>
                <ReactECharts
                  option={option}
                  style={{ height: 400, width: "100%" }}
                />
              </div> */}
              <div style={{ zIndex: 11 }} className={styles.chart}>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon points={points} className={styles.filledArea} />
                </svg>
              </div>
              <div style={{ zIndex: 10 }} className={styles.diamondShape}>
                <Image src={diamond} alt="diamond" />
              </div>
              <div style={{ zIndex: 1000 }} className={styles.labels}>
                <span
                  onClick={() => handleCategoryClick("community")}
                  className={`${styles.label} ${styles.top1}`}
                >
                  <Image src={community} alt="community" />
                  {/* Community and Nature */}
                </span>
                <span
                  onClick={() => handleCategoryClick("food")}
                  className={`${styles.label} ${styles.top2}`}
                >
                  <Image src={food} alt="food" />
                  {/* Food and Health */}
                </span>
                <span
                  onClick={() => handleCategoryClick("eco")}
                  className={`${styles.label} ${styles.top3}`}
                >
                  <Image src={eco} alt="eco" />
                  {/* Ecotechnics */}
                </span>
                <span
                  onClick={() => handleCategoryClick("know")}
                  className={`${styles.label} ${styles.top4}`}
                >
                  <Image src={know} alt="know" />
                  {/* Knowledge and values */}
                </span>
                <span
                  onClick={() => handleCategoryClick("art")}
                  className={`${styles.label} ${styles.top5}`}
                >
                  <Image src={art} alt="art" />
                  {/* Art and Shows */}
                </span>
                <span
                  onClick={() => handleCategoryClick("physical")}
                  className={`${styles.label} ${styles.top6}`}
                >
                  <Image src={physical} alt="physical" />
                  {/* Physical and mental */}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Categories;
