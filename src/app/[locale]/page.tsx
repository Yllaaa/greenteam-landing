import React from "react";
import styles from "./page.module.css";
import Hero from "@/components/home/hero/Hero";
import AboutH from "@/components/home/about/AboutH";
function page() {
  return (
    <>
      <section className={styles.container}>
        <div className={styles.hero}>
          <Hero />
        </div>
        <div className={styles.aboutH}>
          <AboutH />
        </div>
      </section>
    </>
  );
}

export default page;
