import Image from 'next/image'
import styles from './groups.module.scss'
import { formatNumber, GroupItem } from './groups.data'


function Item({ ...props }: GroupItem) {
    return (
        <div className={styles.item}>
            <div className={styles.logo}>
                <Image src={props.logo} alt={props.title} width={637} height={135} className={styles.logo} />
            </div>
            <div className={styles.content}>
                <div className={styles.title}>
                    <label>{props.title}</label>
                </div>
                <div className={styles.description}>
                    <label>{props.description}</label>
                </div>
                <div className={styles.members}>
                    <label>{formatNumber(props.members)} Members</label>
                </div>
                <div className={styles.action}>
                    <label>Join Group</label>
                </div>
            </div>
        </div>
    )
}

export default Item