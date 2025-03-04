import styles from './suggested-friends.module.scss'
import { getSuggestedFriends, SuggestedFriendsItem } from './suggested-friends.data';
import { Item } from './Item';
import { useEffect, useState } from 'react';

export default function SuggestedFriends() {
    const [suggestedFriends, setSuggestedFriends] = useState<SuggestedFriendsItem[]>([]);

    useEffect(() => {
        getSuggestedFriends().then(data => setSuggestedFriends(data))
    }, [])


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