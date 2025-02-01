"use client";
import React from "react";
import styles from "./Chalenges.module.css";
import doIt from "@/../public/ZPLATFORM/challenges/doIt.svg";
import Image from "next/image";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
function Challenges() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Suggested Challenges</h2>
          <p>
            Share 3 impactful campaigns to raise awareness and amplify the
            message of sustainability
          </p>
        </div>
        <div className={styles.challenges}>
          <div className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                {/* <Image src={image1} alt="image1" /> */}
              </div>
              <div className={styles.challengeText}>
                <h3>Challenge Title</h3>
                <p>
                  Take a small step to make a big difference. Plant a tree and
                  contribute to a greener planet
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button onClick={()=>{ToastNot("Challenge Accepted")}} className={styles.challengeButton}>
                <Image src={doIt} alt="doIt" /> Accept
              </button>
              <button onClick={()=>{ToastNot("Challenge Accepted")}} className={styles.challengeButton}>Decline</button>
            </div>
          </div>
          {/*  */}
          <div className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                {/* <Image src={image1} alt="image1" /> */}
              </div>
              <div className={styles.challengeText}>
                <h3>Challenge Title</h3>
                <p>
                  Take a small step to make a big difference. Plant a tree and
                  contribute to a greener planet
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button className={styles.challengeButton}>Accept</button>
              <button className={styles.challengeButton}>Decline</button>
            </div>
          </div>
          <div className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                {/* <Image src={image1} alt="image1" /> */}
              </div>
              <div className={styles.challengeText}>
                <h3>Challenge Title</h3>
                <p>
                  Take a small step to make a big difference. Plant a tree and
                  contribute to a greener planet
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button className={styles.challengeButton}>Accept</button>
              <button className={styles.challengeButton}>Decline</button>
            </div>
          </div>
          <div className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                {/* <Image src={image1} alt="image1" /> */}
              </div>
              <div className={styles.challengeText}>
                <h3>Challenge Title</h3>
                <p>
                  Take a small step to make a big difference. Plant a tree and
                  contribute to a greener planet
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button className={styles.challengeButton}>Accept</button>
              <button className={styles.challengeButton}>Decline</button>
            </div>
          </div>
          <div className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                {/* <Image src={image1} alt="image1" /> */}
              </div>
              <div className={styles.challengeText}>
                <h3>Challenge Title</h3>
                <p>
                  Take a small step to make a big difference. Plant a tree and
                  contribute to a greener planet
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button className={styles.challengeButton}>Accept</button>
              <button className={styles.challengeButton}>Decline</button>
            </div>
          </div>
          <div className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                {/* <Image src={image1} alt="image1" /> */}
              </div>
              <div className={styles.challengeText}>
                <h3>Challenge Title</h3>
                <p>
                  Take a small step to make a big difference. Plant a tree and
                  contribute to a greener planet
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button className={styles.challengeButton}>Accept</button>
              <button className={styles.challengeButton}>Decline</button>
            </div>
          </div>
          <div className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                {/* <Image src={image1} alt="image1" /> */}
              </div>
              <div className={styles.challengeText}>
                <h3>Challenge Title</h3>
                <p>
                  Take a small step to make a big difference. Plant a tree and
                  contribute to a greener planet
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button className={styles.challengeButton}>Accept</button>
              <button className={styles.challengeButton}>Decline</button>
            </div>
          </div>
          <div className={styles.challenge}>
            <div className={styles.challengeDetails}>
              <div className={styles.challengeImage}>
                {/* <Image src={image1} alt="image1" /> */}
              </div>
              <div className={styles.challengeText}>
                <h3>Challenge Title</h3>
                <p>
                  Take a small step to make a big difference. Plant a tree and
                  contribute to a greener planet
                </p>
              </div>
            </div>
            <div className={styles.challengeActions}>
              <button className={styles.challengeButton}>Accept</button>
              <button className={styles.challengeButton}>Decline</button>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </>
  );
}

export default Challenges;
