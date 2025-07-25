"use client";
import React, { useEffect, useState } from "react";
import styles from "./header.module.scss";
import Image from "next/image";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import { ProfileResponse } from "../body/all/all.data";
import { HiDotsVertical } from "react-icons/hi";
import { IoIosFlag, IoIosRemoveCircle, IoMdSettings } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import Report from "./modal/addNew/Report";
import { FaX } from "react-icons/fa6";
import AddNew from "./AddNew";
import Modal from "./modal/newAdd/Modal";
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from "next-intl";

function Header(props: {
  user: ProfileResponse;
  setSettings: React.Dispatch<React.SetStateAction<boolean>>;
  settings: boolean;
}) {
  const { user, setSettings, settings } = props;
  const [open, setOpen] = useState(false);
  const token = getToken();
  const accesstoken = token ? token.accessToken : null;
  const [isFollowed, setIsFollowed] = useState(false);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (user.userData) setIsFollowed(user.userData.isFollowing);
  }, [user.userData]);

  const handleClick = () => {
    setOpen(!open);
  };

  const [isBlocked, setIsBlocked] = useState(user.userData.isBlocked);

  const handleBlock = () => {
    // Close dropdown after clicking
    setOpen(false);

    if (!isBlocked) {
      // Block user
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/actions/block`,
          {
            blockedId: user.userData.id,
            blockedEntityType: "user"
          },
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          ToastNot("User blocked successfully");
          setIsBlocked(true);
          window.location.reload();

        })
        .catch((error) => {
          console.error("Error blocking user:", error);
          ToastNot("Error: Could not block user");
        });
    } else {
      // Unblock user
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/actions/unblock`,
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
              "Content-Type": "application/json",
            },
            data: {
              blockedId: user.userData.id
            }
          }
        )
        .then((response) => {
          console.log(response.data);
          ToastNot("User unblocked successfully");
          setIsBlocked(false);

        })
        .catch((error) => {
          console.error("Error unblocking user:", error);
          ToastNot("Error: Could not unblock user");
        });
    }
  };

  const handleSettingNavigation = () => {
    if (setSettings) setSettings(!settings);
  };

  const handleFollow = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${user.userData.username}/toggle-follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsFollowed(!isFollowed);
        console.log(res.data);
        ToastNot("success");
      })
      .catch((err) => {
        console.log(err);
        ToastNot("error");
      });
  };

  const [report, setReport] = useState(false);

  const handleReport = () => {
    setOpen(false);
    setReport(true);
  };

  const handleChat = () => {
    router.push(`/${locale}/chat?chatId=${user.userData.id}&chatType=user&chatName=${user.userData.username}&chatFullName=${user.userData.fullName}&newChat=true`);
  };

  const t = useTranslations("web.profile.section")

  return (
    <>
      <div className={styles.container}>
  <div className={styles.cover}>
    <Image
      src={user.userData.cover ? user.userData.cover : cover}
      alt={user.userData.username}
      width={1000}
      height={1000}
      className={styles.coverImg}
    />
  </div>
  <div className={styles.userInfo}>
    <div className={styles.user}>
      <div className={styles.avatar}>
        <Image
          src={user.userData.avatar ? user.userData.avatar : noAvatar}
          alt={user.userData.username}
          width={200}
          height={200}
          className={styles.avatarImg}
        />
      </div>

      <div className={styles.name}>
        <p>{user.userData.fullName&&user.userData.fullName.length>10?`${user.userData.fullName.slice(0 , 10)} ... `:user.userData.fullName}</p>
      </div>
      {user.isMyProfile ? null : (
        <div className={styles.visitor}>
          <button onClick={handleFollow} className={styles.message}>
            {isFollowed ? t("following") : t("unfollow")}
          </button>
          <button onClick={handleChat} className={styles.follow}>{t("sendMessage")}</button>
        </div>
      )}

      <div className={styles.bio}>
        <p>{user.userData.bio ? user.userData.bio : t("noBioYet")}</p>
      </div>
      <div className={styles.location}>
        <p>{user.userData.location ? `${user.userData.location.country.name}, ${user.userData.location.city.nameEn}` : t("noLocation")}</p>
      </div>
    </div>
    <div className={styles.userActions}>
      {user.isMyProfile ? (
        <>
          <div
            onClick={handleSettingNavigation}
            className={styles.settings}
          >
            {settings ? <FaX /> : <IoMdSettings />}
          </div>
          <div
            onClick={() => setIsAddNewModalOpen(true)}
            className={`${styles.settings} ${styles.addNewButton}`}
          >
            <FaPlus />
          </div>
        </>
      ) : (
        <div className={styles.droplist}>
          <div onClick={handleClick} className={styles.options}>
            <HiDotsVertical />
          </div>
          {open && (
            <div className={styles.dropDown}>
              <div className={styles.dropDownHeader}>
                <span>{t("actions")}</span>
                <button onClick={handleClick} className={styles.closeDropdown}>
                  <FaX size={12} />
                </button>
              </div>
              <div className={styles.dropDownOption} onClick={handleReport}>
                <IoIosFlag className={styles.actionIcon} />
                <span>{t("reportThisUser")}</span>
              </div>
              <div className={styles.dropDownOption} onClick={handleBlock}>
                <IoIosRemoveCircle
                  className={styles.actionIcon}
                  style={{ color: isBlocked ? "#6ab04c" : "#e74c3c" }}
                />
                <span style={{ color: isBlocked ? "#6ab04c" : "#e74c3c" }}>
                  {isBlocked ? t("unblockUser") : t("blockUser")}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</div>

      {/* Modal for AddNew component */}
      <Modal
        isOpen={isAddNewModalOpen}
        onClose={() => setIsAddNewModalOpen(false)}
        title="Create New Post"
      >
        <AddNew
          isOpen={isAddNewModalOpen}
          onClose={() => setIsAddNewModalOpen(false)}
          onPostComplete={() => setIsAddNewModalOpen(false)}
        />
      </Modal>

      {report && (
        <Report
          setReport={setReport}
          user={user.userData.username}
          reportedId={user.userData.id}
          reportedType="user"
          report={report}
        />
      )}
    </>
  );
}

export default Header;