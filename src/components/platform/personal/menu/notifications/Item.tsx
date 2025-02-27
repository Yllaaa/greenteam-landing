import { NotificationItem } from './notifications.data'
import styles from './notifications.module.scss'
import Image from 'next/image'
import logo from '@/../public/personal/menu/notifications/logo.png'

export default function Item({ ...props }: NotificationItem) {
    return (
        <div className={styles.item}>
            <div className={styles.logo}>
                <Image src={logo} alt={props.title} />
            </div>
            <div className={styles.text}>
                <div className={styles.title}>{props.title}</div>
                <div className={styles.description}>{props.description}</div>
            </div>
        </div>
    )
}