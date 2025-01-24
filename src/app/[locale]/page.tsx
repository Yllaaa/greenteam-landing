import React from "react";
import styles from "./page.module.css";
<<<<<<< HEAD
import Hero from "@/components/Landing_Page/home/hero/Hero";
=======
import Hero from "@/components/home/hero/Hero";
import AboutH from "@/components/home/about/AboutH";
>>>>>>> 8d5cfdc5a524758dcad7baec73099c47a8135e1e
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
