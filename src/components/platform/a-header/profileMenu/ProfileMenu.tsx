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
// import { useTour } from '@/components/AA-NEW/MODALS/A_GUIDE/tourProvider'; // Update import path

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

  // // Get tour state from the tour provider
  // const { isTourActive, currentTourId, currentStepIndex } = useTour();

  // // Effect to handle tour-based dropdown control
  // useEffect(() => {
  //   // Check if header tour is active
  //   if (isTourActive && currentTourId === 'header-tour') {
  //     // Steps 6 and 7 are the profile-related steps (0-indexed)
  //     // Step 6: [data-tour="profile"] - "Access your profile settings"
  //     // Step 7: [data-tour="navigate-profile"] - "Navigate to your profile"
  //     if (currentStepIndex === 6 || currentStepIndex === 7) {
  //       setIsDropdownOpen(true);
  //     } else {
  //       setIsDropdownOpen(false);
  //     }
  //   }
  // }, [isTourActive, currentTourId, currentStepIndex, setIsDropdownOpen]);

  // Function to handle language switching
  const switchLanguage = () => {
    // Don't allow actions during tour
    // if (isTourActive) return;

    const newLocale = locale === "en" ? "es" : "en";
    const pathWithoutLocale =pathname&& pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsDropdownOpen(false);
  };

  // Navigate to user profile
  const goToProfile = () => {
    // Don't allow navigation during tour
    // if (isTourActive) return;

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

  // Handle dropdown item clicks
  const handleDropdownItemClick = (link: string) => {
    // if (isTourActive) return;
    setIsDropdownOpen(false);
    router.push(link);
  };

  return (
    <>
      <div
        className={` ${styles.dropdown} ${isDropdownOpen ? styles.dropdownOpened : styles.dropdownClosed}`}
      >
        {/* User profile section at the top */}
        {user && (
          <div
            data-tour="navigate-profile"
            className={styles.userProfileSection}
            onClick={goToProfile}
            // style={{
            //   pointerEvents: isTourActive ? 'none' : 'auto',
            //   cursor: isTourActive ? 'default' : 'pointer'
            // }}
          >
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
          {dropdownList.map((item) => (
            <li
              onClick={() => handleDropdownItemClick(item.link)}
              className={styles.dropdownItem}
              key={item.id}
              // style={{
              //   pointerEvents: isTourActive ? 'none' : 'auto',
              //   cursor: isTourActive ? 'default' : 'pointer'
              // }}
            >
              <Image unoptimized src={item.icon} alt={item.name} />
              <span>{item.name}</span>
            </li>
          ))}
          <li
            onClick={switchLanguage}
            className={styles.languageToggle}
            // style={{
            //   pointerEvents: isTourActive ? 'none' : 'auto',
            //   cursor: isTourActive ? 'default' : 'pointer'
            // }}
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
              // if (isTourActive) return;
              setIsDropdownOpen(false);
              handleLogout();
            }}
            className={styles.logout}
            // style={{
            //   pointerEvents: isTourActive ? 'none' : 'auto',
            //   cursor: isTourActive ? 'default' : 'pointer'
            // }}
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