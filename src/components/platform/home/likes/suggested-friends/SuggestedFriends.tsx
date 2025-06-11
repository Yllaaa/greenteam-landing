"use client"
import styles from './suggested-friends.module.scss'
import { getSuggestedFriends, SuggestedFriendsItem } from './suggested-friends.data';
import { Item } from './Item';
import { useEffect, useState } from 'react';
import {useLocale} from "next-intl"
export default function SuggestedFriends() {
    const locale = useLocale()
    const [suggestedFriends, setSuggestedFriends] = useState<SuggestedFriendsItem[]>([]);

    useEffect(() => {
        getSuggestedFriends(locale).then(data => setSuggestedFriends(data))
    }, [locale])


    return (
        <div className={styles.suggestedFriends}>
            <div className={styles.header}>
                Suggested Friends
            </div>
            <div>
                {suggestedFriends.map((friend, index) =>
                    <Item key={index} {...friend} />
                )}
            </div>
        </div>
    )
}