import AboutUs from "@/components/Landing_Page/about/aboutUs/AboutUs";
import AboutHero from "@/components/Landing_Page/about/hero/AboutHero";
import History from "@/components/Landing_Page/about/histoty/History";
import React from "react";
import styles from "./about.module.css"
import Team from "../../../../components/Landing_Page/about/team/Team";

function page() {
  return (
    <>
      <section>
        <div>
          <AboutHero />
        </div>
        <div className={styles.aboutUs}>
          <AboutUs />
        </div>
        <div className={styles.team}>
          <Team />
        </div>
        <div className={styles.history}>
          <History />
        </div>  
      </section>
    </>
  );
}

export default page;
