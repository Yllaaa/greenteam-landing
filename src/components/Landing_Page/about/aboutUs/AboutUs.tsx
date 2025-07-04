"use client";
import React from "react";
import styles from "./aboutUs.module.css";
import aoura from "@/../public/about/aoura.jpeg";
import Image from "next/image";
import LoadingTree from "@/components/zaLoader/LoadingTree";
function AboutUs() {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <>
      <div className={styles.container}>
      {!loaded && (
        <div className={styles.aboutUsImg}>
          <LoadingTree />
        </div>
      )}
        <div className={styles.aboutUsImg}>
          <Image src={aoura} alt="aoura" loading="lazy" onLoad={() => setLoaded(true)} />
        </div>
        <div className={styles.aboutUsText}>
          <h3>About Us</h3>
          <div className={styles.p1}>
            <p>
              {`Every day more and more conscious people are betting on ecology
              and sustainable development`}
            </p>
            <p>{`It's time to get organized!`}</p>
            <p>
              {`Greenteam.app is the social network that addresses sustainable
              development issues in a holistic and interactive way.`}
            </p>
          </div>
          <div className={styles.p2}>
            <p>{`Greenteam's goal is to unify the ecological and conscious movement, to facilitate the sustainable development of users, as well as to promote environmentally responsible products and services. The platform offers different tools that will allow you to live sustainably thanks to the community, focused on improving human interactions, learning, sharing and co-creating.`}</p>
            <p>
              {` But the Greenteam team cannot do this alone, taking care of the
              planet is everyone's business! You decide the colour of your
              footprint.`}
            </p>
            <p>{`Together, on the road to sustainability.`}</p>
          </div>
          <div className={styles.signature}>
            <h4>Greenteam</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
