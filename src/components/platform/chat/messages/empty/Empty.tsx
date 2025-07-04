import Image from 'next/image'
import styles from './empty.module.scss'
import inboxIcon from '@/../public/chat/inbox.svg'

export default function Empty() {
    return (
        <div className={styles.empty}>
            <div className={styles.icon}>
                <Image src={inboxIcon} alt="empty" />
            </div>
            <div className={styles.title}>Your messages</div>
            <div className={styles.details}>Select a person to display their chat or start a new conversation.</div>
        </div>
    )
}
