import React, { lazy, Suspense } from "react";
import styles from "./page.module.css";
import LoadingTree from "@/components/zaLoader/LoadingTree";

const Hero = lazy(() => import("@/components/Landing_Page/home/hero/Hero"));
function page() {
  const FootMarquee = lazy(() =>
    import("@/components/Landing_Page/home/foot/Foot")
  );
  const Brain = lazy(() =>
    import("@/components/Landing_Page/home/brain/Brain")
  );
  const Foot = lazy(() =>
    import("@/components/Landing_Page/home/footSection/FootSection")
  );
  const EarthSection = lazy(() =>
    import("@/components/Landing_Page/home/earth/Earth")
  );
  const WhatWeOffer = lazy(() =>
    import("@/components/Landing_Page/home/whatWeOffer/WhatWeOffer")
  );
  const News = lazy(() => import("@/components/Landing_Page/home/slider/News"));
  return (
    <>
      <section style={{overflowX:"hidden"}} className={styles.container}>
        <div className={styles.shadow1}></div>
        <div className={styles.shadow2}></div>
        <div className={styles.shadow3}></div>
        <div className={styles.shadow4}></div>
        <Suspense
          fallback={
            <div className={styles.hero}>
              <LoadingTree />
            </div>
          }
        >
          <div className={styles.hero}>
            <Hero />
          </div>
        </Suspense>
        <Suspense
          fallback={
            <div className={styles.hero}>
              <LoadingTree />
            </div>
          }
        >
          <div className={styles.aboutH}>
            <FootMarquee />
          </div>
        </Suspense>
        <Suspense
          fallback={
            <div className={styles.hero}>
              <LoadingTree />
            </div>
          }
        >
          <div className={styles.brain}>
            <Brain />
          </div>
        </Suspense>
        <Suspense
          fallback={
            <div className={styles.hero}>
              <LoadingTree />
            </div>
          }
        >
          <div className={styles.brain}>
            <EarthSection />
          </div>
        </Suspense>
        <Suspense
          fallback={
            <div className={styles.hero}>
              <LoadingTree />
            </div>
          }
        >
          <div className={styles.brain}>
            <Foot />
          </div>
        </Suspense>
        <Suspense
          fallback={
            <div className={styles.hero}>
              <LoadingTree />
            </div>
          }
        >
          <div className={styles.whatWeOffer}>
            <WhatWeOffer />
          </div>
        </Suspense>
        <Suspense
          fallback={
            <div className={styles.hero}>
              <LoadingTree />
            </div>
          }
        >
          <div style={{overflowX:"hidden"}} className={styles.news}>
            <News />
          </div>
        </Suspense>
        <div className={styles.aboutH}></div>
      </section>
    </>
  );
}

export default page;
