/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect } from 'react'
import styles from './userDetails.module.scss'
import Image from 'next/image'
import tree from '@/../public/icons/tree.svg'
import axios from 'axios'
import { getToken } from '@/Utils/userToken/LocalToken'
function Breif() {
  const token = getToken()
  const accessToken = token ? token.accessToken : null
  const username = token ? token.user.username : null

  const [score, setScore] = React.useState(0)
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setScore(response.data.userScore)
      })
  }, [])
  return (
    <>
      <div className={styles.breifContainer}>
        <div className={styles.breifHeader}>
          <p>Your Points</p>
          <h5>Track Your Impact!</h5>
        </div>

        <Image
          src={tree}
          alt="breif"
          width={100}
          height={100}
          className={styles.breifIcon}
        />
        <div className={styles.breifText}>
          <p>
            {score} <span>Points</span>
          </p>
        </div>
      </div>
    </>
  )
}

export default Breif
