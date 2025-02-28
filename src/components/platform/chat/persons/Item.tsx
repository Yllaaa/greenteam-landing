import Image from 'next/image'
import styles from './persons.module.scss'
import classNames from 'classnames'
import { PersonItem } from './search/persons.data'

type ItemProps = PersonItem & {
    selected: boolean
    onClick: () => void
}

export default function Item(
    { selected, onClick, ...props }: ItemProps) {
    return (
        <div
            className={classNames(styles.item, { [styles.active]: props.active }, { [styles.selected]: selected })}
            onClick={onClick}
        >
            <div className={styles.avatar}>
                <Image src={props.avatar} alt={props.name} width={48} height={48} />
                <div className={styles.circle} />
            </div>
            <div className={styles.data}>
                <p className={styles.name}>{props.name}</p>
                <p className={styles.details}>{props.work}</p>
            </div>
        </div>
    )
}
