"use client";
import Image from "next/image";
import styles from "./groups.module.scss";
import { CommunityGroup } from "./groups.data";
import { useRouter } from "next/navigation";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { joinGroup, leaveGroup } from "./header.data";


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
  const t = useTranslations("web.groups");

  // Track if pagination has already been triggered
  const hasPaginatedRef = useRef(false);

  const handleNavigate = () => {
    router.push(`/${locale}/groups/${group.id}`);
  };

  const handleJoinGroup = async (id: string) => {
    try {
      const res = await joinGroup(id);
      ToastNot(res.message);
      // Refetch group data to get updated state

    } catch (err) {
      console.error("Error joining group:", err);
      ToastNot("Failed to join group");
    }
  };

  const handleLeaveGroup = async (id: string) => {
    try {
      const res = await leaveGroup(id);
      ToastNot(res.message);

    } catch (err) {
      console.error("Error leaving group:", err);
      ToastNot("Failed to leave group");
    }
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
    <div
      ref={index === length - 1 ? ref : null}
      className={styles.item}
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      aria-label={t('viewGroup')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNavigate();
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.logo}>
        <Image
        unoptimized
          src={group.banner ? group.banner : cover}
          alt={t('groupImageAlt', { groupName: group.name })}
          width={637}
          height={135}
          className={styles.logo}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <label>{group.name}</label>
        </div>
        <div className={styles.description} aria-label={t('groupDescription')}>
          <label>{group.description}</label>
        </div>
        <div className={styles.members}>
          <label>
            {group.memberCount} {t('members')}
          </label>
        </div>
        <div
          onClick={() => {
            if (!group.isUserMember) { handleJoinGroup(group.id) } else {
              handleLeaveGroup(group.id)
            }
          }}
          className={styles.action}
          role="button"
          tabIndex={0}

        >
          <label>{!group.isUserMember ? `${t('joinGroup')}` : `${t('leaveGroup')}`}</label>
        </div>
      </div>
    </div>
  );
}

export default Item;