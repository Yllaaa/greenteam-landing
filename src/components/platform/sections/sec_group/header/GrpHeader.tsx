"use client";
import Image from "next/image";
import React from "react";
import styles from "./header.module.scss";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
import AddNew from "./AddNew";

function Grpheader() {
  return (
    <>
      <div className={styles.cover}>
        <Image src={cover} alt={"cover"} className={styles.coverImg} />
      </div>
      <div className={styles.header}>
        <div className={styles.data}>
          <h5>
            Group by: <span>Name</span>
          </h5>
          <h3>
            A community dedicated to promoting sustainable living and sharing
            eco-friendly practices.
          </h3>
          <div className={styles.members}>
            <div className={styles.membersImgs}>
              {[...Array(3)].map((_, index) => (
                <div key={index} className={styles.member}>
                  <Image src={cover} alt={"member"} width={50} height={50} />
                </div>
              ))}
            </div>
            <div className={styles.membersNumber}>
              <p>130 Members</p>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button>Join Group</button>
          <button>Invite</button>
        </div>
      </div>
      <AddNew />
    </>
  );
}

export default Grpheader;
