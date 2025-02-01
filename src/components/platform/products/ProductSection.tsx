import React from "react";
import ProductCard from "./Card/ProductCard";
import styles from "./ProductSection.module.css";

function ProductSection() {
  return (
    <>
      <div>
        <div className={styles.title}>
        <h3>Products</h3>
        <ul>
            <li>Event 1</li>
            <li>Event 2</li>
            <li>Event 3</li>
            <li>Event 4</li>
        </ul>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "25px",
            alignItems: "center",
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            paddingLeft:"20px"
          }}
        >
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </>
  );
}

export default ProductSection;
