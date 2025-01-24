"use client";
import React, { lazy, Suspense } from "react";
import styles from "./footer.module.css";
import Loading from "@/app/loading";
const Download = lazy(() => import("@/components/zfooter/download/Download"));
function Footer() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className={styles.container}>
          <div className={styles.upper}>
            <Download />
          </div>
          <div className={styles.lower}></div>
        </div>
      </Suspense>
    </>
  );
}

export default Footer;
