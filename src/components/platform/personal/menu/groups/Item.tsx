"use client";
import Image from "next/image";
import styles from "./groups.module.scss";
import { CommunityGroup } from "./groups.data";
import { useRouter } from "next/navigation";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

function Item({
  group,
  page,
  setPage,
  length,
  index,
}: {
  group: CommunityGroup;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  length: number;
  index: number;
}) {
  const locale = useLocale();
  const router = useRouter();

  // Track if pagination has already been triggered
  const hasPaginatedRef = useRef(false);

  const handleNavigate = () => {
    router.push(`/${locale}/groups/${group.id}`);
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true, // Only trigger once when coming into view
  });

  const handlePages = useCallback(() => {
    // Only paginate if we haven't already and we're not on the first page load
    if (!hasPaginatedRef.current && length >= 5) {
      hasPaginatedRef.current = true;
      setPage(page + 1);
    }
  }, [length, page, setPage]);

  useEffect(() => {
    // Only trigger pagination if this is the last item and it's in view
    if (inView && index === length - 1) {
      handlePages();
    }
  }, [handlePages, inView, index, length]);

  return (
    <div ref={index === length - 1 ? ref : null} className={styles.item}>
      <div className={styles.logo}>
        <Image
          src={group.banner ? group.banner : cover}
          alt={group.name}
          width={637}
          height={135}
          className={styles.logo}
          unoptimized={true}

          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.content}>
        <div onClick={handleNavigate} className={styles.title}>
          <label>{group.name}</label>
        </div>
        <div className={styles.description}>
          <label>{group.description}</label>
        </div>
        <div className={styles.members}>
          <label>
            {/* {formatNumber(group.)}  */}
            {group.memberCount} Members
          </label>
        </div>
        <div
          onClick={() => {
            console.log(group.id);
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
