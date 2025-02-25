import { getGroupItems } from './groups.data';
import styles from './groups.module.scss'
import Item from './Item';

async function Groups() {
    const groups = await getGroupItems();

    return (
        <div className={styles.groupsContainer}>
            <div className={styles.groups}>
                {groups.map((group, index) => (
                    <Item key={index} {...group} />
                ))}
            </div>
        </div>
    )
}

export default Groups