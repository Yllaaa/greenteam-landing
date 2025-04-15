"use client";
import Item from "./Item";
import { getNotificationItems } from "./notifications.data";
import styles from "./notifications.module.scss";

export default function Notifications() {
  const notifications = getNotificationItems();
  return (
    <div className={styles.notifications}>
      {notifications &&
        notifications?.map((notification, index) => (
          <Item key={index} {...notification} />
        ))}
    </div>
  );
}
