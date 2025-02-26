import styles from './posts.module.scss'
import { formatNumber, getPassedTime, PostItem } from './posts.data'
import Image from 'next/image'
import like from '@/../public/home/likes/like.svg'
import dislike from '@/../public/home/likes/dislike.svg'
import comment from '@/../public/home/likes/comment.svg'
import checkbox from '@/../public/home/likes/checkbox.svg'

export default function Item({ ...props }: PostItem) {
    return (
        <div className={styles.item}>
            <div className={styles.header}>
                <div className={styles.avatar}>
                    <Image src={props.user.avatar} alt='' width={44} height={49} />
                </div>
                <div className={styles.text}>
                    <div>
                        <label className={styles.name}>{props.user.name}</label>
                        <label className={styles.details}>@{props.user.city}.{getPassedTime(props.published)}</label>
                    </div>
                    <div>
                        <label className={styles.title}>{props.title}</label>
                    </div>
                </div>
            </div>
            <div className={styles.photo}>
                <Image src={props.photo} alt='' width={312} height={312} />
                <div className={styles.details}>
                    <div>
                        <Image src={checkbox} width={18} height={18} alt='' className={styles.icon} />
                        <label>Do</label>
                    </div>
                    <div>
                        <Image src={like} width={18} height={18} alt='' className={styles.icon} />
                        <label>{formatNumber(props.likes)} Like</label>
                    </div>
                    <div>
                        <Image src={dislike} width={18} height={18} alt='' className={styles.icon} />
                        <label>{formatNumber(props.dislikes)} Unlike</label>
                    </div>
                    <div>
                        <Image src={comment} width={18} height={18} alt='' className={styles.icon} />
                        <label>{formatNumber(props.comments)} Comment</label>
                    </div>
                </div>
            </div>
        </div>
    )
}