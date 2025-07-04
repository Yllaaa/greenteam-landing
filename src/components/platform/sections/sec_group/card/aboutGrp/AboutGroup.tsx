"use client";
import { useAppSelector } from "@/store/hooks";
import React from "react";
import styles from "./about.module.scss";

function AboutGroup() {
  const groupData = useAppSelector((state) => state.groupState);

  if (!groupData) {
    return <div>Join The Group</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <h2>About {groupData.name}</h2>
        <p>{groupData.description}</p>
      </div>
    </>
  );
}

export default AboutGroup;
