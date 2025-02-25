import Item from './Item';
import { getPageItems } from './pages.data';
import styles from './pages.module.scss'

export default async function Pages() {
    const pages = await getPageItems();
    return (
        <div className={styles.pages}>
            {pages.map((page, index) => (
                <Item key={index} {...page} />
            ))}
        </div>
    )
}