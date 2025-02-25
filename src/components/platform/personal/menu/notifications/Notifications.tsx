import Item from './Item';
import { getNotificationItems } from './notifications.data';
import styles from './notifications.module.scss'

export default async function Notifications() {
    const notifications = await getNotificationItems();
    return (
        <div className={styles.notifications}>
            {notifications.map((notification, index) => (
                <Item key={index} {...notification} />
            ))}
        </div>
    )
}