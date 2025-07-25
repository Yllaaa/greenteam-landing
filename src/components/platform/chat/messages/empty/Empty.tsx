"use client"
import Image from 'next/image'
import styles from './empty.module.scss'
import inboxIcon from '@/../public/chat/inbox.svg'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
export default function Empty() {
    const params = useSearchParams()
    const fullName = params && params?.get("chatFullName")
    const t = useTranslations("web.chat")
    return (
        <div className={styles.empty}>
            <div className={styles.icon}>
                <Image src={inboxIcon} alt="empty" />
            </div>
            <div className={styles.title}>{fullName ? fullName : t("yourMessage")}</div>
            <div className={styles.details}>{fullName ? t("chatWith") + " " + fullName : t("select")}</div>
        </div>
    )
}
