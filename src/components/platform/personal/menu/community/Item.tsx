/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './community.module.scss'
import Image from "next/image";

type ItemProps = {
    logo: any,
    text: string
}

function Item({
    ...props
}: ItemProps) {
    return (
        <div className={styles.item}>
            <div className={styles.logo}>
                <Image src={props.logo} alt={props.text} />
            </div>
            <div className={styles.text}>
                <label>{props.text}</label>
            </div>
        </div>
    )
}

export default Item