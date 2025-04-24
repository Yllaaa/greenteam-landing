import React from "react";
import styles from "./ProfileMenu.module.css";
import chat from "@/../public/ZPLATFORM/A-Header/navIcons/chat.svg";
import challenges from "@/../public/ZPLATFORM/A-Header/navIcons/challenges.svg";
import community from "@/../public/ZPLATFORM/A-Header/navIcons/community.svg";
import plans from "@/../public/ZPLATFORM/A-Header/navIcons/plans.svg";
import settings from "@/../public/ZPLATFORM/A-Header/navIcons/settings.svg";
import logout from "@/../public/ZPLATFORM/A-Header/navIcons/logout.svg";
import { useLocale } from "next-intl";
import Props from "./types/profileMenu.data";
import { useRouter } from "next/navigation";
import Image from "next/image";

function ProfileMenu(props: Props) {
  const { isDropdownOpen, setIsDropdownOpen, handleLogout } = props;
  const router = useRouter();
  const locale = useLocale();
  
  const dropdownList = [
    {
      id: 1,
      name: "Chat",
      icon: chat,
      link: `/${locale}/chat`,
    },
    {
      id: 2,
      name: "Community",
      icon: community,
      link: `/${locale}/community`,
    },
    {
      id: 3,
      name: "Challenges",
      icon: challenges,
      link: `/${locale}/challenges`,
    },
    {
      id: 6,
      name: "Personal",
      icon: challenges,
      link: `/${locale}/personal_menu`,
    },
    {
      id: 4,
      name: "Plans",
      icon: plans,
      link: `/${locale}/payment`,
    },
    {
      id: 7,
      name: "Favorites",
      icon: settings,
      link: `/${locale}/favorite`,
    },
    {
      id: 5,
      name: "Settings",
      icon: settings,
      link: `/${locale}/settings`,
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
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default ProfileMenu;
