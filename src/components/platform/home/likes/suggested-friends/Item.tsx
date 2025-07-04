import Image from 'next/image';
import { addFriend, SuggestedFriendsItem } from './suggested-friends.data';
import styles from './suggested-friends.module.scss'
import { useState } from 'react';

export function Item({ ...props }: SuggestedFriendsItem) {
    const [isAdded, setIsAdded] = useState(false);

    async function addHandler() {
        await addFriend(props.id)
        setIsAdded(true);
    }

    return (
        <div className={styles.item}>
            <div className={styles.content}>
                <div className={styles.avatar}>
                    <Image src={props.avatar} alt='' width={56} height={56} />
                </div>
                <div className={styles.text}>
                    <div className={styles.name}>
                        {props.fullName}
                    </div>
                    <div className={styles.details}>
                        {props.work}
                    </div>
                </div>
            </div>
            {!isAdded &&
                <div className={styles.add} onClick={addHandler}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.417 5V15" stroke="#27364B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.41699 10H15.417" stroke="#27364B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            }
        </div>
    )
}