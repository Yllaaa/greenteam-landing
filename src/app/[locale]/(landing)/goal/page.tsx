import AboutHero from "@/components/Landing_Page/Goal/hero/AboutHero";
import Imagine from "@/components/Landing_Page/Goal/imagine/imagine/Imagine";
import Mission from "@/components/Landing_Page/Goal/mission/Mission";
import React from "react";
import styles from "./goal.module.css";
function page() {
 
  return (
    <>
      <section className={styles.container}>
        <div>
          <AboutHero />
        </div>
        <div className={styles.mission}>
          <Mission />
        </div>

        <div className={styles.imagine}>
          <Imagine />
        </div>
      </section>
    </>
  );
}

export default page;
