import Image from "next/image";
import { PageItem } from "./pages.data";
import styles from "./pages.module.scss";
import logo from "@/../public/personal/menu/pages/logo.svg";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
// import star from "@/../public/personal/menu/pages/star.png";

export default function Item({ ...props }: PageItem) {
  const router = useRouter();
  const locale = useLocale();
  const handleNavigate = () => {
    router.push(`/${locale}/pages/${props.slug}`);
  };
  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image src={logo} alt={props.name} />
        </div>
        <div className={styles.ecoVillage}>EcoVillage</div>
      </div>
      <div className={styles.content}>
        <div onClick={handleNavigate} className={styles.text}>
          <div className={styles.title}>{props.name}</div>
        </div>
        <div onClick={handleNavigate} className={styles.description}>
          <div className={styles.headerWhy}>
            <span>Why: </span>
            {props.why}
          </div>
          <div className={styles.headerHow}>
            <span>How: </span>
            {props.how}
          </div>
          <div className={styles.headerWhat}>
            <span>What: </span>
            {props.what}
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.counts}>
            <div className={styles.likes}>{props.followersCount} Likes</div>
            <div className={styles.divider}></div>
            <div className={styles.followers}>
              {props.followersCount} Followers
            </div>
          </div>
          <button className={styles.like}>Post</button>
        </div>
      </div>
      {/* <div className={styles.star}>
        <Image src={star} alt="star" />
      </div> */}
    </div>
  );
}
