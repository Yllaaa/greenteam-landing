import SingleProduct from "@/components/platform/posts/products/singleProduct/SingleProduct";
import React from "react";
import styles from "./prodId.module.css"

function page(params: { params: { locale: string; prodId: string } }) {
  const { prodId } = params.params;
  return (
    <>
      <div className={styles.container}>
        <SingleProduct prodId={prodId} />
      </div>
    </>
  );
}

export default page;
