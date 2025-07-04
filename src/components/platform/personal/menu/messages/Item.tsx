import Image from 'next/image'
import { MessageItem } from './messages.data'
import styles from './messages.module.scss'
import logo from '@/../public/personal/menu/messages/logo.png'
export default function Item({ ...props }: MessageItem) {
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