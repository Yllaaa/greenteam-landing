"use client";
import Image from "next/image";
import React, { useEffect, useCallback, useState, useRef } from "react";
import styles from "./header.module.scss";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
import noAvatar from "@/../public/ZPLATFORM/A-Header/NoAvatarImg.png";
import AddNew from "./AddNew";
import {
  getSingleGroupItems,
  GroupItem,
  joinGroup,
  leaveGroup,
} from "./header.data";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentGroup } from "@/store/features/groupState/groupState";
import { setGroupEdit } from "@/store/features/groupState/editGroupSettings";
import { MdOutlineReportProblem } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { BsShieldSlash } from "react-icons/bs";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import ConfirmationModal from "@/components/platform/modals/confirmModal/ConfirmationModal";
import ReportModal from "@/components/platform/modals/reportModal/ReportModal";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
function Grpheader(props: { groupId: string }) {
  const t = useTranslations('web.groups.groupHeader');
  const { groupId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [data, setData] = React.useState<GroupItem>({} as GroupItem);

  // Options menu state
  const [showOptions, setShowOptions] = useState(false);

  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Reference for dropdown menu (to handle clicks outside)
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const token = getToken();
  const accessToken = token ? token.accessToken : null;

  // Function to fetch group data
  const fetchGroupData = useCallback(async () => {
    try {
      const res = await getSingleGroupItems(groupId);
      setData(res);
      dispatch(setCurrentGroup(res));
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  }, [groupId, dispatch]);

  // Initial data fetch
  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  // Close the options menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleJoinGroup = async () => {
    try {
      const res = await joinGroup(groupId);
      ToastNot(res.message);
      // Refetch group data to get updated state
      fetchGroupData();
    } catch (err) {
      console.error("Error joining group:", err);
      ToastNot("Failed to join group");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const res = await leaveGroup(groupId);
      ToastNot(res.message);
      // Refetch group data to get updated state
      fetchGroupData();
    } catch (err) {
      console.error("Error leaving group:", err);
      ToastNot("Failed to leave group");
    }
  };

  const editState = useAppSelector((state) => state.groupEdit.edit);
  const activeEdit = () => {
    dispatch(setGroupEdit(!editState));
  };

  // Toggle options menu
  const toggleOptionsMenu = () => {
    setShowOptions(prev => !prev);
  };

  // Handle delete action
  const handleDelete = useCallback(async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/community/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        ToastNot("Group deleted successfully");
        // Redirect to groups list after deletion
        router.push('/groups');
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      ToastNot("Error occurred while deleting group");
    }
  }, [groupId, accessToken, router]);

  // Handle block action
  const handleBlock = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/community/groups/${groupId}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        ToastNot("Group blocked successfully");
        // Redirect to groups list after blocking
        router.push('/groups');
      }
    } catch (error) {
      console.error("Failed to block group:", error);
      ToastNot("Error occurred while blocking group");
    }
  }, [groupId, accessToken, router]);

  return (
    <>
      <div className={styles.cover}>
        <Image
          src={data.banner ? data.banner : cover}
          alt={"cover"}
          className={styles.coverImg}
          width={1000}
          height={1000}
        />

        {/* Group options button */}
        <div className={styles.groupOptions}>
          <div
            onClick={toggleOptionsMenu}
            className={styles.optionsIcon}
          >
            <PiDotsThreeCircleLight fill="#006633" />
          </div>

          {showOptions && (
            <div ref={optionsMenuRef} className={styles.optionsMenu}>
              {data.isAdmin && (
                <div
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setShowOptions(false);
                  }}
                  className={styles.optionItem}
                >
                  <FaTrash /> <span>{t('actions.deleteGroup')}</span>
                </div>
              )}
              {!data.isAdmin &&
                (
                  <>
                    <div
                      onClick={() => {
                        setIsReportModalOpen(true);
                        setShowOptions(false);
                      }}
                      className={styles.optionItem}
                    >
                      <MdOutlineReportProblem /> <span>{t('actions.reportGroup')}</span>
                    </div>
                    <div
                      onClick={() => {
                        setIsBlockModalOpen(true);
                        setShowOptions(false);
                      }}
                      className={styles.optionItem}
                    >
                      <BsShieldSlash /> <span>{t('actions.blockGroup')}</span>
                    </div>
                  </>
                )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.header}>
        <div className={styles.data}>
          <h5>
            {t('labels.name')} <span>{data.name}</span>
          </h5>
          <h3>{data.description}</h3>
          <div className={styles.members}>
            <div className={styles.membersImgs}>
              {data?.recentMembers?.map((member, index) => (
                <div key={index} className={styles.member}>
                  <Image
                    src={member.avatar ? member.avatar : noAvatar}
                    alt={"member"}
                    width={50}
                    height={50}
                  />
                </div>
              ))}
            </div>
            <div className={styles.membersNumber}>
              <p>{data?.memberCount || 0} {t('labels.members')}</p>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          {data.isAdmin ? (
            <button onClick={activeEdit} className={styles.edit}>
              {editState ? t('actions.cancelEdit') : t('actions.edit')}
            </button>
          ) : (
            <button
              onClick={data.isUserMember ? handleLeaveGroup : handleJoinGroup}
              className={styles.join}
            >
              {data.isUserMember ? t('actions.leave') : t('actions.joinGroup')}
            </button>
          )}


        </div>
      </div>
      {!editState && <AddNew />}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => router.push('/groups')}
        title={t('modals.deleteConfirmation.title')}
        confirmButtonText={t('modals.deleteConfirmation.confirmButton')}
        cancelButtonText={t('modals.deleteConfirmation.cancelButton')}
        customAction={handleDelete}
        successMessage={t('modals.deleteConfirmation.successMessage')}
        errorMessage={t('modals.deleteConfirmation.errorMessage')}
      />

      {/* Block Confirmation Modal */}
      <ConfirmationModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={() => router.push('/groups')}
        title={t('modals.blockConfirmation.title')}
        confirmButtonText={t('modals.blockConfirmation.confirmButton')}
        cancelButtonText={t('modals.blockConfirmation.cancelButton')}
        customAction={handleBlock}
        successMessage={t('modals.blockConfirmation.successMessage')}
        errorMessage={t('modals.blockConfirmation.errorMessage')}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedId={groupId}
        reportedType="group"
        title={t('modals.report.title')}
        successCallback={() => {
          // Optional success callback
          ToastNot(t('modals.report.successMessage'));
        }}
      />
    </>
  );
}

export default Grpheader;