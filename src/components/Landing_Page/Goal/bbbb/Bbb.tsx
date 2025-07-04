import React from 'react'
import styles from './Bbb.module.scss'
import Image from "next/image"
import bb from "@/../public/goals/bbb.png"
function Bbb() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.bgImg}>
          <Image src={bb} alt="bbb" width={10000} height={10000} loading="lazy" />
        </div>
        {/* <div className={styles.content1}>
          <h2>Unify the ecological community because communication generates evolution and progress.</h2>
        </div>
        <div className={styles.content2}>
          <h2>Share good habits because we learn from each other.</h2>
        </div>
        <div className={styles.content3}>
          <h2>Promote close human relationships to become a real community.</h2>
        </div> */}
      </div>
    </>
  )
}

export default Bbb