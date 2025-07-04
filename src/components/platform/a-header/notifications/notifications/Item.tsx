// Item.tsx
"use client";
import { NotificationItem } from './notifications.data';
import styles from './notifications.module.scss';
import Image from 'next/image';
import defaultAvatar from '@/../public/personal/menu/notifications/logo.png';
import { formatDistanceToNow } from 'date-fns'; // You'll need to install date-fns
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
export default function Item({ ...props }: NotificationItem) {
    const router = useRouter()
    const locale = useLocale();
    const avatarSrc = props.actor.avatar || defaultAvatar;
    const timeAgo = formatDistanceToNow(new Date(props.createdAt), { addSuffix: true });
    // const {notification} = props;
    const handleNavigation = () => {

        if (props.metadata) {
            if ('pageSlug' in props.metadata) {
                const { pageSlug } = props.metadata;
                if (pageSlug) {
                    // Navigate to the specific page with the followerId
                    router.push(`/${locale}/pages/${pageSlug}`);
                }
            } else if ('postId' in props.metadata) {
                const { postId } = props.metadata;
                if (postId) {
                    // Navigate to the post with the reaction type
                    router.push(`/${locale}/feeds/posts/${postId}`);
                }
                // Handle other metadata types if necessary
            } else if ('commentId' in props.metadata) {
                const { commentId, publicationId, publicationType } = props.metadata;
                if (commentId && publicationId && publicationType) {
                    // Navigate to the comment in the specific publication
                    router.push(`/${locale}/feeds/${publicationType}s/${publicationId}`);
                }
            }
        } else {
            // Handle the case when notification.metadata is undefined
            console.warn("Notification metadata is undefined");
        }
    }
    return (
        <div onClick={handleNavigation} className={`${styles.item} ${!props.isRead ? styles.unread : ''}`}>
            <div className={styles.avatar}>
                <Image
                    unoptimized
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