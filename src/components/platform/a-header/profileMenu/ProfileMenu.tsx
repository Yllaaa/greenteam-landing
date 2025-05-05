import React from "react";
import styles from "./ProfileMenu.module.css";
import chat from "@/../public/ZPLATFORM/A-Header/navIcons/chat.svg";
import challenges from "@/../public/ZPLATFORM/A-Header/navIcons/challenges.svg";
import community from "@/../public/ZPLATFORM/A-Header/navIcons/community.svg";
import plans from "@/../public/ZPLATFORM/A-Header/navIcons/plans.svg";
import star from "@/../public/ZPLATFORM/A-Header/navIcons/star.svg";
import logout from "@/../public/ZPLATFORM/A-Header/navIcons/logout.svg";
import language from "@/../public/ZPLATFORM/A-Header/navIcons/logout.svg"; // Add a language icon
import { useLocale, useTranslations } from "next-intl";
import Props from "./types/profileMenu.data";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

function ProfileMenu(props: Props) {
  const { isDropdownOpen, setIsDropdownOpen, handleLogout } = props;
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("web.header");

  // Function to handle language switching
  const switchLanguage = () => {
    // Get the new locale (toggle between en and es)
    const newLocale = locale === "en" ? "es" : "en";
    
    // Extract the path without the locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Navigate to the same page but with new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
    
    // Close the dropdown
    setIsDropdownOpen(false);
  };

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
      name: t("challenges"),
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
          {/* Language toggle button */}
          <li 
            onClick={switchLanguage} 
            className={styles.languageToggle}
          >
            <Image src={language} alt="language" />
            <span>
              {locale === "en" 
                ? "Switch to Spanish" 
                : "Cambiar a Inglés"}
            </span>
          </li>

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