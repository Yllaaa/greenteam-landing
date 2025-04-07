"use client";
import { useEffect, useState } from "react";
import Item from "./Item";
import { getPageItems, PageItem } from "./pages.data";
import styles from "./pages.module.scss";

export default function Pages() {
  const [pagesArray, setPagesArray] = useState<PageItem[]>([]);
  // const pages = await getPageItems();
  useEffect(()=>{
  
    getPageItems().then((res) => {
      setPagesArray(res);
    });
  },[])
  return (
    <div className={styles.pagesContainer}>
      <div className={styles.pages}>
        {pagesArray.map((page, index) => (
          <Item key={index} {...page} />
        ))}
      </div>
    </div>
  );
}
