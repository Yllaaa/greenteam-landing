/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect } from 'react'
import styles from './userDetails.module.scss'
import axios from 'axios'
import { getToken } from '@/Utils/userToken/LocalToken'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations("web.subHeader.breif")
  return (
    <>
      <div className={styles.breifContainer}>
        <div className={styles.breifHeader}>
          <p>{t("yourPoints")}</p>
          <h5>{t("track")}</h5>
        </div>


        <div className={styles.breifText}>
          <p>
            {score} <span>{t("points")}</span>
          </p>
        </div>
      </div>
    </>
  )
}

export default Breif
