import Image from 'next/image'
import { formatChatDate, MessageItem } from './messages.data'
import styles from './messages.module.scss'
import arrowIcon from '@/../public/chat/arrow.svg'
import classNames from 'classnames'

export default function Item({ userId, ...props }: { userId: string } & MessageItem) {
    return (
        <div className={classNames(styles.item, { [styles.self]: userId === props.user.id })}>
            <Image src={arrowIcon} alt="arrow" className={styles.arrow} />
            <div className={styles.avatar}>
                <Image src={props.user.avatar} alt="avatar" width={32} height={32} />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.name}>{props.user.name}</div>
                    <div className={styles.details}>{props.user.work}</div>
                </div>
                <div className={styles.text}>{props.message}</div>
                <div className={styles.time}>{formatChatDate(props.createdAt)}</div>
            </div>
        </div>
    )
}