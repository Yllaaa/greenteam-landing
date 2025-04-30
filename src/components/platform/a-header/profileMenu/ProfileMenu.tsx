import React from "react";
import styles from "./ProfileMenu.module.css";
import chat from "@/../public/ZPLATFORM/A-Header/navIcons/chat.svg";
import challenges from "@/../public/ZPLATFORM/A-Header/navIcons/challenges.svg";
import community from "@/../public/ZPLATFORM/A-Header/navIcons/community.svg";
import plans from "@/../public/ZPLATFORM/A-Header/navIcons/plans.svg";
import star from "@/../public/ZPLATFORM/A-Header/navIcons/star.svg";
import logout from "@/../public/ZPLATFORM/A-Header/navIcons/logout.svg";
import { useLocale, useTranslations } from "next-intl";
import Props from "./types/profileMenu.data";
import { useRouter } from "next/navigation";
import Image from "next/image";

function ProfileMenu(props: Props) {
  const { isDropdownOpen, setIsDropdownOpen, handleLogout } = props;
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("web.header");

  const dropdownList = [
    {
      id: 1,
      name: t("chat"),
      icon: chat,
      link: `/${locale}/chat`,
    },
    {
      id: 2,
      name: t("community"),
      icon: community,
      link: `/${locale}/community`,
    },
    {
      id: 3,
      name: t("community"),
      icon: challenges,
      link: `/${locale}/challenges`,
    },
    {
      id: 6,
      name: t("personal"),
      icon: challenges,
      link: `/${locale}/personal_menu`,
    },
    {
      id: 4,
      name: t("plans"),
      icon: plans,
      link: `/${locale}/payment`,
    },
    {
      id: 7,
      name: t("favorites"),
      icon: star,
      link: `/${locale}/favorite`,
    },
  ];
  return (
    <>
      <div
        className={` ${styles.dropdown} ${
          isDropdownOpen ? styles.dropdownOpened : styles.dropdownClosed
        }`}
      >
        <ul>
          {dropdownList.map((item) => (
            <li
              onClick={() => {
                setIsDropdownOpen(false);
                router.push(item.link);
              }}
              className={styles.dropdownItem}
              key={item.id}
            >
              <Image src={item.icon} alt={item.name} />
              <span>{item.name}</span>
            </li>
          ))}
          <li
            onClick={() => {
              setIsDropdownOpen(false);
              handleLogout();
            }}
            className={styles.logout}
          >
            <Image src={logout} alt="logout" />
            <span>{t("logout")}</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default ProfileMenu;
