import Item from './Item';
import { getMessageItems } from './messages.data';
import styles from './messages.module.scss'

export default async function Messages() {
    const messages = await getMessageItems();
    return (
        <div className={styles.messages}>
            {messages.map((message, index) => (
                <Item key={index} {...message} />
            ))}
        </div>
    )
}