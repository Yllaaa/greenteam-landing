import React from "react";
import styles from "./ProfileMenu.module.css";
import challenges from "@/../public/ZPLATFORM/A-Header/navIcons/challenges.svg";
import personal from "@/../public/ZPLATFORM/A-Header/navIcons/community.svg";
import plans from "@/../public/ZPLATFORM/A-Header/navIcons/plans.svg";
import logout from "@/../public/ZPLATFORM/A-Header/navIcons/logout.svg";
import language from "@/../public/ZPLATFORM/A-Header/navIcons/language.svg";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";

// Update Props interface to include user info
interface Props {
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
  user: {
    id: string; avatar: string; bio: string; email: string; fullName: string; username: string;
  };
}

function ProfileMenu(props: Props) {
  const { isDropdownOpen, setIsDropdownOpen, handleLogout, user } = props;
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

  // Navigate to user profile
  const goToProfile = () => {
    if (user?.username) {
      router.push(`/${locale}/profile/${user.username}`);
      setIsDropdownOpen(false);
    }
  };

  const dropdownList = [
    {
      id: 3,
      name: t("challenges"),
      icon: challenges,
      link: `/${locale}/challenges`,
    },
    {
      id: 6,
      name: t("space"),
      icon: personal,
      link: `/${locale}/personal_menu`,
    },
    {
      id: 4,
      name: t("plans"),
      icon: plans,
      link: `/${locale}/payment`,
    },
  ];

  return (
    <>
      <div
        className={` ${styles.dropdown} ${isDropdownOpen ? styles.dropdownOpened : styles.dropdownClosed}`}
      >
        {/* User profile section at the top */}
        {user && (
          <div className={styles.userProfileSection} onClick={goToProfile}>
            <div className={styles.userAvatar}>
              <Image
                unoptimized
                src={user.avatar || noAvatar}
                alt="User avatar"
                width={50}
                height={50}
                className={styles.avatarImage}
              />
            </div>
            <div className={styles.userName}>
              {user.fullName || user.username}
            </div>
            <div className={styles.viewProfileBtn}>
              View Profile
            </div>
          </div>
        )}

        <ul>
          {/* Language toggle button */}


          {dropdownList.map((item) => (
            <li
              onClick={() => {
                setIsDropdownOpen(false);
                router.push(item.link);
              }}
              className={styles.dropdownItem}
              key={item.id}
            >
              <Image unoptimized src={item.icon} alt={item.name} />
              <span>{item.name}</span>
            </li>
          ))}
          <li
            onClick={switchLanguage}
            className={styles.languageToggle}
          >
            <Image unoptimized src={language} alt="language" />
            <span>
              {locale === "en"
                ? "Switch to Spanish"
                : "Cambiar a Inglés"}
            </span>
          </li>
          <li
            onClick={() => {
              setIsDropdownOpen(false);
              handleLogout();
            }}
            className={styles.logout}
          >
            <Image unoptimized src={logout} alt="logout" />
            <span>{t("logout")}</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default ProfileMenu;