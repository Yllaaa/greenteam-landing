import Image from 'next/image';

import { followUser, WhoToFollowItem } from './who-to-follow.data';
import styles from './who-to-follow.module.scss';
import { useState } from 'react';

export default function Item({ ...props }: WhoToFollowItem) {
    const [isFollowed, setIsFollowed] = useState(false);

    async function followHandler() {
        await followUser(props.id);
        setIsFollowed(true);
    }

    return (
        <div className={styles.item}>
            <div className={styles.content}>
                <div className={styles.avatar}>
                    <Image src={props.avatar} alt='' width={56} height={56} />
                </div>
                <div className={styles.text}>
                    <div className={styles.name}>{props.name}</div>
                    <div className={styles.details}>@{props.city}</div>
                </div>
            </div>
            {!isFollowed &&
                <div>
                    <button className={styles.follow} onClick={followHandler}>Follow</button>
                </div>
            }
        </div>
    );
}
