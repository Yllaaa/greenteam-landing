"use client";
import Image from "next/image";
import styles from "./groups.module.scss";
import { GroupResponse } from "./groups.data";
import { useRouter } from "next/navigation";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
import { useLocale } from "next-intl";

function Item({ ...props }: GroupResponse) {
  const locale = useLocale();
  const router = useRouter();
  return (
    <div className={styles.item}>
      <div className={styles.logo}>
        <Image
          src={props.cover ? props.cover : cover}
          alt={props.name}
          width={637}
          height={135}
          className={styles.logo}
        />
      </div>
      <div className={styles.content}>
        <div
          onClick={() => router.push(`/${locale}/groups/${props.id}`)}
          className={styles.title}
        >
          <label>{props.name}</label>
        </div>
        <div className={styles.description}>
          <label>{props.description}</label>
        </div>
        <div className={styles.members}>
          <label>
            {/* {formatNumber(props.)}  */}
            230 Members
          </label>
        </div>
        <div
          onClick={() => {
            console.log(props.id);
          }}
          className={styles.action}
        >
          <label>Join Group</label>
        </div>
      </div>
    </div>
  );
}

export default Item;
