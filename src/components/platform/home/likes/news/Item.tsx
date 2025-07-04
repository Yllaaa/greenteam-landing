import Image from 'next/image';
import { getPassedTime, NewsItem } from './new.data';
import styles from './news.module.scss'

export default function Item({ ...props }: NewsItem) {
    return (
        <div className={styles.item}>
            <div className={styles.content}>
                <div className={styles.details}>
                    {props.source} . {getPassedTime(props.published)}
                </div>
                <div className={styles.title}>
                    {props.title}
                </div>
                <div className={styles.details}>
                    Trending with <label className={styles.hashtag}>{props.hashtag}</label>
                </div>
            </div>
            <div className={styles.photo}>
                <Image src={props.photo} width={71} height={69} alt={''} />
            </div>
        </div>
    )
}