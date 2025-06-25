import { useEffect } from "react";
import Image from "next/image";
import { formatChatDate, Message } from "./messages.data";
import styles from "./messages.module.scss";
import arrowIcon from "@/../public/chat/arrow.svg";
import classNames from "classnames";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { useInView } from "react-intersection-observer";
import { useAppSelector } from "@/store/hooks";

type Props = {
  message: Message;
  index: number;
  messages: Message[];
  setLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Item({
  message,
  index,
  // messages,
  setLoadingMore,
}: Props) {
  // Only use the intersection observer for the first message (oldest)
  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "200px 0px 0px 0px",
    triggerOnce: true,
  });

  // Trigger loading more when the first message is in view
  useEffect(() => {
    if (index === 0 && inView) {
      // console.log("First message in view, triggering load more");
      setLoadingMore(true);
    }
  }, [inView, index, setLoadingMore]);

  const currentUser = useAppSelector((state) => state.login.user?.user)?.id;

  return (
    <div
      // Only attach the ref to the first (oldest) message
      ref={index === 0 ? ref : undefined}
      className={classNames(styles.item, {
        [styles.self]: message.sender&&message.sender.id === currentUser ,
      })}
      onClick={() => {
        if (index === 1) {
          setLoadingMore(true);
        }
        console.log(index);
      }}
    >
      <Image src={arrowIcon} alt="arrow" className={styles.arrow} />
      <div className={styles.avatar}>
        <Image
        unoptimized
          src={message?.sender?.avatar ? message?.sender?.avatar : noAvatar}
          alt="avatar"
          width={32}
          height={32}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.name}>{message.sender && message.sender.username}</div>
          <div className={styles.details}>{message.senderType}</div>
        </div>
        <div className={styles.text}>{message.content}</div>
        <div className={styles.time}>{formatChatDate(`${message.sentAt}`)}</div>
      </div>
    </div>
  );
}
