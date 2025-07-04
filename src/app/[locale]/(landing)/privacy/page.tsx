import PrivacyPolicy from '@/components/Landing_Page/privacy/PrivacyPolicy'
import React from 'react'
import styles from "./privacy.module.css"
function page() {
  return (
      <div className={styles.container}>
          <PrivacyPolicy/>
    </div>
  )
}

export default page