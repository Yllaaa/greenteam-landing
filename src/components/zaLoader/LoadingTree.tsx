"use client";
import React from "react";
import styles from "./loadingTree.module.css"
// import styled from "styled-components";

const LoadingTree = () => {
  return (
    <div className={styles.loader}>
      <span className={styles.item} />
      <span className={styles.item} />
      <span className={styles.item} />
      <span className={styles.item} />
    </div>
  );
};


export default LoadingTree;
