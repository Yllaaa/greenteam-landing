import Image from "next/image";
import { formatChatDate, Message } from "./messages.data";
import styles from "./messages.module.scss";
import arrowIcon from "@/../public/chat/arrow.svg";
import classNames from "classnames";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";

export default function Item({ ...props }: Message) {
  const message = props;

  return (
    <div
      className={classNames(styles.item, {
        [styles.self]: !message.isReceived,
      })}
    >
      <Image src={arrowIcon} alt="arrow" className={styles.arrow} />
      <div className={styles.avatar}>
        <Image
          src={message?.sender?.avatar ? message?.sender?.avatar : noAvatar}
          alt="avatar"
          width={32}
          height={32}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.name}>{message.sender.username}</div>
          <div className={styles.details}>{message.senderType}</div>
        </div>
        <div className={styles.text}>{message.content}</div>
        <div className={styles.time}>{formatChatDate(`${props.sentAt}`)}</div>
      </div>
    </div>
  );
}
