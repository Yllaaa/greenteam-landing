import React from "react";
import styles from "./page.module.css";
import Hero from "@/components/Landing_Page/home/hero/Hero";
function page() {
  return (
    <>
      <section className={styles.container}>
        <div className={styles.hero}>
          <Hero />
        </div>
      </section>
    </>
  );
}

export default page;
