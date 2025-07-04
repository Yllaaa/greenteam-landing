"use client";
import Image from "next/image";
import styles from "./persons.module.scss";
import classNames from "classnames";
import { Chat } from "./search/persons.data";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
type ItemProps = Chat & {
  selected: boolean;
  onClick: () => void;
};

export default function Item({ selected, onClick, ...props }: ItemProps) {
  // console.log("propsPerson", props);

  return (
    <div
      className={classNames(
        styles.item,
        // { [styles.active]: selected },
        { [styles.selected]: selected }
      )}
      onClick={onClick}
    >
      <div className={styles.avatar}>
        <Image
        unoptimized
          src={props?.contact?.avatar ? props?.contact?.avatar : noAvatar}
          alt={props?.contact?.fullName}
          width={48}
          height={48}
        />
        <div className={styles.circle} />
      </div>
      <div className={styles.data}>
        <p className={styles.name}>{props?.contact?.fullName}</p>

        <p className={styles.details}>{props.lastMessage.content}</p>
      </div>
    </div>
  );
}
