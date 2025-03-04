import { useEffect, useState } from 'react'
import Item from './Item'
import { getWhoToFollowItems, WhoToFollowItem } from './who-to-follow.data'
import styles from './who-to-follow.module.scss'
import Link from 'next/link'

export default function WhoToFollow() {
    const [suggestions, setSuggestions] = useState([] as WhoToFollowItem[])

    useEffect(() => {
        getWhoToFollowItems().then(data => setSuggestions(data))
    }, [])

    return (
        <div className={styles.whoToFollow}>
            <div className={styles.header}>
                <label>Who to follow</label>
            </div>
            <div>
                {suggestions.map((sug, index) =>
                    <Item key={index} {...sug} />
                )}
            </div>
            <div className={styles.showMore}>
                <Link href={"#"}>Show more</Link>
            </div>
        </div>
    )
}