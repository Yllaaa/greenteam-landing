import SingleProduct from "@/components/platform/posts/products/singleProduct/SingleProduct";
import React from "react";
import styles from "./prodId.module.css";

async function page({ params }: { params: Promise<{ prodId: string }> }) {
  const { prodId } = await params;
  return (
    <>
      {prodId && (
        <div className={styles.container}>
          <SingleProduct prodId={prodId} />
        </div>
      )}
    </>
  );
}
export default page;
