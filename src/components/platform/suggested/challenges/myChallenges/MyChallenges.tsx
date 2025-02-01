"use client";
import React from "react";
import styles from "./MyChallenges.module.css";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function MyChallenges() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>My Challenges</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
            consequuntur saepe, sint quam sed optio!
          </p>
        </div>
        <div className={styles.challenges}>
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
              <button
                onClick={() => {
                  ToastNot("Challenge Accepted");
                }}
                className={styles.challengeButton}
              >
                Accept
              </button>
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
              <button
                onClick={() => {
                  ToastNot("Challenge Accepted");
                }}
                className={styles.challengeButton}
              >
                Accept
              </button>
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
              <button
                onClick={() => {
                  ToastNot("Challenge Accepted");
                }}
                className={styles.challengeButton}
              >
                Accept
              </button>
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
              <button
                onClick={() => {
                  ToastNot("Challenge Accepted");
                }}
                className={styles.challengeButton}
              >
                Accept
              </button>
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
              <button
                onClick={() => {
                  ToastNot("Challenge Accepted");
                }}
                className={styles.challengeButton}
              >
                Accept
              </button>
            </div>
          </div>
          {/*  */}
        </div>
        
      </div>
    </>
  );
}

export default MyChallenges;
