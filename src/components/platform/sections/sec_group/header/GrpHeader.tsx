"use client";
import Image from "next/image";
import React, { useEffect, useCallback } from "react";
import styles from "./header.module.scss";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
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

function Grpheader(props: { groupId: string }) {
  const { groupId } = props;
  const dispatch = useAppDispatch();
  const [data, setData] = React.useState<GroupItem>({} as GroupItem);

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
      </div>
      <div className={styles.header}>
        <div className={styles.data}>
          <h5>
            Name: <span>{data.name}</span>
          </h5>
          <h3>{data.description}</h3>
          <div className={styles.members}>
            <div className={styles.membersImgs}>
              {data?.recentMembers?.map((member, index) => (
                <div key={index} className={styles.member}>
                  <Image
                    src={member.avatar ? member.avatar : cover}
                    alt={"member"}
                    width={50}
                    height={50}
                  />
                </div>
              ))}
            </div>
            <div className={styles.membersNumber}>
              <p>{data?.memberCount || 0} Members</p>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          {data.isAdmin ? (
            <button onClick={activeEdit} className={styles.edit}>
              {editState ? "Cancel Edit" : "Edit"}
            </button>
          ) : (
            <button
              onClick={data.isUserMember ? handleLeaveGroup : handleJoinGroup}
              className={styles.join}
            >
              {data.isUserMember ? "Leave" : "Join Group"}
            </button>
          )}

          <button>Invite</button>
        </div>
      </div>
      {!editState && <AddNew />}
    </>
  );
}

export default Grpheader;
