import React from "react";
import styles from "./page.module.css";
import Hero from "@/components/Landing_Page/home/hero/Hero";
import FootMarquee from "@/components/Landing_Page/home/foot/Foot";
import Brain from "@/components/Landing_Page/home/brain/Brain";
import Foot from "@/components/Landing_Page/home/footSection/FootSection";
import EarthSection from "@/components/Landing_Page/home/earth/Earth";
import WhatWeOffer from "@/components/Landing_Page/home/whatWeOffer/WhatWeOffer";

function page() {
  return (
    <>
      <section className={styles.container}>
        <div className={styles.shadow1}></div>
        <div className={styles.shadow2}></div>
        <div className={styles.shadow3}></div>
        <div className={styles.shadow4}></div>
        <div className={styles.hero}>
          <Hero />
        </div>
        <div className={styles.aboutH}>
          <FootMarquee />
        </div>
        <div className={styles.brain}>
          <Brain />
        </div>
        <div className={styles.brain}>
          <EarthSection />
        </div>
        <div className={styles.brain}>
          <Foot />
        </div>
        <div className={styles.whatWeOffer}>
          <WhatWeOffer />
        </div>
        <div className={styles.aboutH}></div>
      </section>
    </>
  );
}

export default page;
