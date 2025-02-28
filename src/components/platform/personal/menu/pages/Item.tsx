import Image from 'next/image';
import { PageItem } from './pages.data';
import styles from './pages.module.scss';
import logo from '@/../public/personal/menu/pages/logo.svg';
import star from '@/../public/personal/menu/pages/star.png';

export default function Item({ ...props }: PageItem) {
    return (
        <div className={styles.item}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <Image src={logo} alt={props.name} />
                </div>
                <div className={styles.likes}>{props.likes} Likes</div>
                <div className={styles.divider}></div>
                <div className={styles.followers}>{props.followers} Followers</div>
                <div className={styles.ecoVillage}>EcoVillage</div>
            </div>
            <div className={styles.content}>
                <div className={styles.text}>
                    <div className={styles.title}>{props.name}</div>
                    <div className={styles.description}>{props.description}</div>
                </div>
                <div className={styles.img}>
                    <Image src={props.cover} alt={props.name} width={481} height={188} className={styles.img} />
                </div>
                <div className={styles.actions}>
                    <button className={styles.contact}>Contact</button>
                    <button className={styles.like}>Like</button>
                </div>
            </div>
            <div className={styles.star}>
                <Image src={star} alt="star" />
            </div>
        </div>
    )
}