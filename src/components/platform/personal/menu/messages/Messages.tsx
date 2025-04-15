"use client";
import Item from "./Item";
import { getMessageItems } from "./messages.data";
import styles from "./messages.module.scss";

export default function Messages() {
  const messages = getMessageItems();
  // const messages =[{

  // }]
  return (
    <div className={styles.messages}>
      {messages.map((message, index) => (
        <Item key={index} {...message} />
      ))}
    </div>
  );
}
