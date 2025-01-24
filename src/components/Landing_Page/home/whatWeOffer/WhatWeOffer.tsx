"use client";
import React from "react";
import styles from "./whatWeOffer.module.css";
import lock from "@/../public/whatWeOffer/lock.svg";
import tree from "@/../public/whatWeOffer/tree.svg";
import message from "@/../public/whatWeOffer/message.svg";
import Image from "next/image";
import Loading from "@/app/loading";
function WhatWeOffer() {
  const cardContent = [
    {
      icon: lock,
      header: `Data Privacy`,
      text: "Your data is secure with ethical and transparent choices.",
    },
    {
      icon: tree,
      header: "Organic Internet",
      text: "authentic connections through meaningful and focused design",
    },
    {
      icon: message,
      header: "Comunication for Impact",
      text: "Tools to focus on collective well-being and local impact",
    },
  ];
  const [loaded, setLoaded] = React.useState(false);
  return (
    <>
      <div className={styles.container}>
        {loaded ? (
          <div className={styles.header}>
            <h5>WHAT WE OFFER</h5>
            <h3>
              How We Make a <span>Difference</span>
            </h3>
          </div>
        ) : (
          <Loading />
        )}
        <div className={styles.cards}>
          {cardContent.map((card, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>
                <Image
                  src={card.icon}
                  alt="icon"
                  loading="lazy"
                  onLoadingComplete={() => setLoaded(true)}
                />
              </div>
              <h3 className={styles.cardHeader}>{card.header.split(" ")[0]} <br/> {card.header.split(" ").slice(1).join(" ")}  </h3>
              <p className={styles.cardText}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WhatWeOffer;
