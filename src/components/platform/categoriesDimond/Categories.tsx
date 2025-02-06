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
import ReactECharts from "echarts-for-react";
import { color } from "echarts";

// type Props = {
//   values?: {
//     community?: number;
//     food?: number;
//     eco?: number;
//     know?: number;
//     art?: number;
//     physical?: number;
//   };
// };

function Categories() {
  // echart
  const option = {
    title: {
      text: "Referrer of a Website",
      subtext: "Fake Data",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Referrer",
        type: "pie",
        radius: "50%",
        color: ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#749f83"],
        data: [
          { value: 20, name: "Search Engine" },
          { value: 5, name: "Direct" },
          { value: 30, name: "Email" },
          { value: 40, name: "Union Ads" },
          { value: 5, name: "Video Ads" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  //   const { community, food, eco, know, art, physical } = values;
  const subCategories = {
    community: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5", "Sub 6"],
    food: ["Sub 1", "Sub 2", "Sub 3", "Sub 4"],
    eco: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5"],
    know: ["Sub 1", "Sub 2"],
    art: ["Sub 1", "Sub 2", "Sub 3"],
    physical: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5"],
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    keyof typeof subCategories | null
  >(null);
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
    setSelectedCategory(null);
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
    getPoint(90, 0),
    getPoint(100, 60),
    getPoint(70, 120),
    getPoint(60, 180),
    getPoint(100, 240),
    getPoint(0, 300),
  ].join(" ");
  // const points2 = [getPoint(100, 0), getPoint(100, 180)].join(" ");
  // const points3 = [
  //   getPoint(100, 0),
  //   getPoint(100, 120),
  //   getPoint(100, 240),
  // ].join(" ");
  // const points4 = [
  //   getPoint(100, 60),
  //   getPoint(100, 120),
  //   getPoint(100, 240),
  //   getPoint(100, 300),
  // ].join(" ");
  // const points6 = [
  //   getPoint(90, 0),
  //   getPoint(100, 60),
  //   getPoint(70, 120),
  //   getPoint(60, 180),
  //   getPoint(100, 240),
  //   getPoint(0, 300),
  // ].join(" ");
  // const points5 = [
  //   getPoint(100, 0),
  //   getPoint(100, 60),
  //   getPoint(100, 120),
  //   getPoint(100, 240),
  //   getPoint(100, 300),
  // ].join(" ");
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
            // style={{ top: "5%", left: "50%", zIndex: 10055 }}
          >
            <Image src={community} alt="community" />
            Community and Nature
          </span>
          <span
            onClick={() => handleCategoryClick("food")}
            className={`${styles.label} ${styles.top2}`}
            // style={{ top: "25%", left: "85%" }}
          >
            <Image src={food} alt="food" />
            Food and Health
          </span>
          <span
            onClick={() => handleCategoryClick("eco")}
            className={`${styles.label} ${styles.top3}`}
            // style={{ top: "78%", left: "83%" }}
          >
            <Image src={eco} alt="eco" />
            Ecotechnics
          </span>
          <span
            onClick={() => handleCategoryClick("know")}
            className={`${styles.label} ${styles.top4}`}
            // style={{ top: "95%", left: "50%" }}
          >
            <Image src={know} alt="know" />
            Knowledge and values
          </span>
          <span
            onClick={() => handleCategoryClick("art")}
            className={`${styles.label} ${styles.top5}`}
            // style={{ top: "78%", left: "12%" }}
          >
            <Image src={art} alt="art" />
            Art and Shows
          </span>
          <span
            onClick={() => handleCategoryClick("physical")}
            className={`${styles.label} ${styles.top6}`}
            // style={{ top: "25%", left: "12%" }}
          >
            <Image src={physical} alt="physical" />
            Physical and mental
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
            {/* <div className={styles.modalDiamond}>
              <Image src={diamond} alt="diamond" priority />
            </div> */}
            <div className={styles.subCategories}>
              <h2>{selectedCategory.toUpperCase()}</h2>
              <div>
              <ReactECharts option={option} style={{ height: 400, width: "100%" }} />
                {/* {subCategories[selectedCategory].map((subCategory, index) => (
                  <div key={index} className={styles.sub}>
                    <p style={{ top: "80%", left: `${index * 15 + 5}%` }}>{subCategory}</p>
                  </div>
                ))} */}
                {/* {subCategories[selectedCategory].length === 2 ? (
                  <>
                    <div style={{ zIndex: 11 }} className={styles.chart}>
                      <svg
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polygon
                          points={points2}
                          className={styles.filledArea}
                        />
                      </svg>
                    </div>
                    <div>
                      <p style={{ top: "22%", left: "47%" }}>
                        {subCategories[selectedCategory][0]}
                      </p>
                      <p style={{ top: "75%", left: "47%" }}>
                        {subCategories[selectedCategory][1]}
                      </p>
                    </div>
                  </>
                ) : subCategories[selectedCategory].length === 3 ? (
                  <>
                    <div style={{ zIndex: 11 }} className={styles.chart}>
                      <svg
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polygon
                          points={points3}
                          className={styles.filledArea}
                        />
                      </svg>
                    </div>
                    <div>
                      <p style={{ top: "22%", left: "47%" }}>
                        {subCategories[selectedCategory][0]}
                      </p>
                      <p style={{ top: "60%", left: "25%" }}>
                        {subCategories[selectedCategory][1]}
                      </p>
                      <p style={{ top: "60%", left: "70%" }}>
                        {subCategories[selectedCategory][2]}
                      </p>
                    </div>
                  </>
                ) : subCategories[selectedCategory].length === 4 ? (
                  <>
                    <div style={{ zIndex: 11 }} className={styles.chart}>
                      <svg
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polygon
                          points={points4}
                          className={styles.filledArea}
                        />
                      </svg>
                    </div>
                    <div>
                      <p style={{ top: "40%", left: "10%" }}>
                        {subCategories[selectedCategory][0]}
                      </p>
                      <p style={{ top: "40%", left: "80%" }}>
                        {subCategories[selectedCategory][1]}
                      </p>
                      <p style={{ top: "60%", left: "10%" }}>
                        {subCategories[selectedCategory][2]}
                      </p>
                      <p style={{ top: "60%", left: "80%" }}>
                        {subCategories[selectedCategory][3]}
                      </p>
                    </div>
                  </>
                ) : subCategories[selectedCategory].length === 5 ? (
                  <>
                    <div style={{ zIndex: 11 }} className={styles.chart}>
                      <svg
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polygon
                          points={points5}
                          className={styles.filledArea}
                        />
                      </svg>
                    </div>
                    <div>
                      <p style={{ top: "22%", left: "47%" }}>
                        {subCategories[selectedCategory][0]}
                      </p>
                      <p style={{ top: "37%", left: "25%" }}>
                        {subCategories[selectedCategory][1]}
                      </p>
                      <p style={{ top: "37%", left: "70%" }}>
                        {subCategories[selectedCategory][2]}
                      </p>
                      <p style={{ top: "60%", left: "70%" }}>
                        {subCategories[selectedCategory][3]}
                      </p>
                      <p style={{ top: "60%", left: "25%" }}>
                        {subCategories[selectedCategory][4]}
                      </p>
                    </div>
                  </>
                ) : subCategories[selectedCategory].length === 6 ? (
                  <>
                    <div style={{ zIndex: 11 }} className={styles.chart}>
                      <svg
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polygon
                          points={points6}
                          className={styles.filledArea}
                        />
                      </svg>
                    </div>
                    <div>
                      <p style={{ top: "22%", left: "47%" }}>
                        {subCategories[selectedCategory][0]}
                      </p>
                      <p style={{ top: "37%", left: "25%" }}>
                        {subCategories[selectedCategory][1]}
                      </p>
                      <p style={{ top: "37%", left: "70%" }}>
                        {subCategories[selectedCategory][2]}
                      </p>
                      <p style={{ top: "60%", left: "25%" }}>
                        {subCategories[selectedCategory][3]}
                      </p>
                      <p style={{ top: "60%", left: "70%" }}>
                        {subCategories[selectedCategory][4]}
                      </p>
                      <p style={{ top: "75%", left: "47%" }}>
                        {subCategories[selectedCategory][5]}
                      </p>
                    </div>
                  </>
                ) : null} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Categories;

// "use client";
// import React, { useState } from "react";
// import styles from "./categories.module.css";
// import Image from "next/image";
// import diamond from "@/../public/ZPLATFORM/categories/diamond.svg";
// import communityIcon from "@/../public/ZPLATFORM/categories/community.svg";
// import artIcon from "@/../public/ZPLATFORM/categories/art.svg";
// import ecoIcon from "@/../public/ZPLATFORM/categories/eco.svg";
// import foodIcon from "@/../public/ZPLATFORM/categories/food.svg";
// import knowIcon from "@/../public/ZPLATFORM/categories/know.svg";
// import physicalIcon from "@/../public/ZPLATFORM/categories/physical.svg";

// type Props = {
//   values?: {
//     community?: number;
//     food?: number;
//     eco?: number;
//     know?: number;
//     art?: number;
//     physical?: number;
//   };
// };

// // Subcategories for each category
// const subCategories = {
//   community: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5", "Sub 6"],
//   food: ["Sub 1", "Sub 2", "Sub 3", "Sub 4"],
//   eco: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5"],
//   know: ["Sub 1", "Sub 2", "Sub 3", "Sub 4"],
//   art: ["Sub 1", "Sub 2", "Sub 3"],
//   physical: ["Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5"],
// };

// function Categories({ values }: Props) {
//   const { community = 0, food = 0, eco = 0, know = 0, art = 0, physical = 0 } = values || {};

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<keyof typeof subCategories | null>(null);

//   const HEX_RADIUS = 43;

//   const getPoint = (value: number, angle: number) => {
//     const radius = (value / 100) * HEX_RADIUS;
//     const radian = (angle - 90) * (Math.PI / 180);
//     const x = 50 + radius * Math.cos(radian);
//     const y = 50 + radius * Math.sin(radian);
//     return `${x},${y}`;
//   };

//   const points = [
//     getPoint(community, 0),
//     getPoint(food, 60),
//     getPoint(eco, 120),
//     getPoint(know, 180),
//     getPoint(art, 240),
//     getPoint(physical, 300),
//   ].join(" ");

//   const handleCategoryClick = (category: keyof typeof subCategories) => {
//     setSelectedCategory(category);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedCategory(null);
//   };

//   return (
//     <>
//       <div className={styles.container}>
//         <div className={`${styles.chart} ${styles.centerAbsolute}`}>
//           <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hexagonal chart">
//             <polygon points={points} className={styles.filledArea} />
//           </svg>
//         </div>
//         <div className={`${styles.diamondShape} ${styles.centerAbsolute}`}>
//           <Image src={diamond} alt="diamond" priority />
//         </div>
//         <div className={`${styles.labels} ${styles.centerAbsolute}`}>
//           <span
//             className={styles.label}
//             style={{ top: "5%", left: "50%" }}
//             onClick={() => handleCategoryClick("community")}
//           >
//             <Image src={communityIcon} alt="community" />
//             Community and Nature
//           </span>
//           <span
//             className={styles.label}
//             style={{ top: "20%", left: "85%" }}
//             onClick={() => handleCategoryClick("food")}
//           >
//             <Image src={foodIcon} alt="food" />
//             Food and Health
//           </span>
//           <span
//             className={styles.label}
//             style={{ top: "75%", left: "85%" }}
//             onClick={() => handleCategoryClick("eco")}
//           >
//             <Image src={ecoIcon} alt="eco" />
//             Ecotechnics
//           </span>
//           <span
//             className={styles.label}
//             style={{ top: "95%", left: "50%" }}
//             onClick={() => handleCategoryClick("know")}
//           >
//             <Image src={knowIcon} alt="know" />
//             Knowledge and values
//           </span>
//           <span
//             className={styles.label}
//             style={{ top: "75%", left: "10%" }}
//             onClick={() => handleCategoryClick("art")}
//           >
//             <Image src={artIcon} alt="art" />
//             Art and Shows
//           </span>
//           <span
//             className={styles.label}
//             style={{ top: "20%", left: "10%" }}
//             onClick={() => handleCategoryClick("physical")}
//           >
//             <Image src={physicalIcon} alt="physical" />
//             Physical and mental
//           </span>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedCategory && (
//         <div className={styles.modal}>
//           <div className={styles.modalContent}>
//             <button className={styles.closeButton} onClick={closeModal}>
//               &times;
//             </button>
//             <div className={styles.modalDiamond}>
//               <Image src={diamond} alt="diamond" priority />
//             </div>
//             <div className={styles.subCategories}>
//               <h2>{selectedCategory.toUpperCase()}</h2>
//               <ul>
//                 {subCategories[selectedCategory].map((sub, index) => (
//                   <li key={index}>{sub}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Categories;
