// Item.tsx
"use client";
import { NotificationItem } from './notifications.data';
import styles from './notifications.module.scss';
import Image from 'next/image';
import defaultAvatar from '@/../public/personal/menu/notifications/logo.png';
import { formatDistanceToNow } from 'date-fns'; // You'll need to install date-fns

export default function Item({ ...props }: NotificationItem) {
    const avatarSrc = props.actor.avatar || defaultAvatar;
    const timeAgo = formatDistanceToNow(new Date(props.createdAt), { addSuffix: true });

    return (
        <div className={`${styles.item} ${!props.isRead ? styles.unread : ''}`}>
            <div className={styles.avatar}>
                <Image 
                    src={avatarSrc} 
                    alt={props.actor.fullName} 
                    width={40} 
                    height={40}
                    className={styles.avatarImage}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.message}>{props.message}</div>
                <div className={styles.time}>{timeAgo}</div>
            </div>
        </div>
    );
}