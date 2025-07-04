'use client'
import { useState } from 'react'
import Header from './header/Header'
import styles from './likes.module.scss'
import Posts from './posts/Posts'
import News from './news/News'
import WhoToFollow from './who-to-follow/WhoToFollow'
import SuggestedFriends from './suggested-friends/SuggestedFriends'

export default function Likes() {
    const [category, setCategory] = useState('All')

    return (
        <div className={styles.container}>
            <div>
                <Header category={category} setCategory={setCategory} />
            </div>
            <div className={styles.content}>
                <div className={styles.mainColumn}>
                    <Posts category={category} />
                </div>
                <div className={styles.sideColumn}>
                    <News />
                    <WhoToFollow />
                    <SuggestedFriends />
                    <div className={styles.termsOfService} >
                        Terms of Service Privacy Policy Cookie Policy
                        Ads info More © 2021 Green team, Inc.
                    </div>
                </div>
            </div>
        </div>
    )
}