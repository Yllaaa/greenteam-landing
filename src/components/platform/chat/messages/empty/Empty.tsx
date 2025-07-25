"use client"
import Image from 'next/image'
import styles from './empty.module.scss'
import inboxIcon from '@/../public/chat/inbox.svg'
import { useSearchParams } from 'next/navigation'
export default function Empty() {
    const params = useSearchParams()
    const fullName = params.get("chatFullName")
    console.log(params.get("chatFullName"))
    return (
        <div className={styles.empty}>
            <div className={styles.icon}>
                <Image src={inboxIcon} alt="empty" />
            </div>
            <div className={styles.title}>{fullName? fullName : "Your messages"}</div>
            <div className={styles.details}>{fullName? "Chat with " + fullName : "Select a person to display their chat or start a new conversation."}</div>
        </div>
    )
}
