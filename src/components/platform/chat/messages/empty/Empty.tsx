import Image from 'next/image'
import styles from './empty.module.scss'
import inboxIcon from '@/../public/chat/inbox.svg'

export default function Empty() {
    return (
        <div className={styles.empty}>
            <div className={styles.icon}>
                <Image src={inboxIcon} alt="empty" />
            </div>
            <div className={styles.title}>No messages yet</div>
            <div className={styles.details}>Send a message to start a conversation</div>
        </div>
    )
}
