/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import styles from "./header.module.scss";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
import AddNew from "./AddNew";
import { getSingleGroupItems, GroupItem } from "./header.data";
import { useAppSelector } from "@/store/hooks";

function Grpheader(props: { groupId: string }) {
  const user = useAppSelector((state) => state.login.user);

  const { groupId } = props;
  const [data, setData] = React.useState<GroupItem>({} as GroupItem);
  useEffect(() => {
    getSingleGroupItems(groupId).then((res) => {
      setData(res);
    });
  }, []);

  return (
    <>
      <div className={styles.cover}>
        <Image src={cover} alt={"cover"} className={styles.coverImg} />
      </div>
      <div className={styles.header}>
        <div className={styles.data}>
          <h5>
            Privacy: <span>{data.privacy}</span>
          </h5>
          <h3>{data.description}</h3>
          <div className={styles.members}>
            <div className={styles.membersImgs}>
              {[...Array(3)].map((_, index) => (
                <div key={index} className={styles.member}>
                  <Image
                    src={data.cover ? data.cover : cover}
                    alt={"member"}
                    width={50}
                    height={50}
                  />
                </div>
              ))}
            </div>
            <div className={styles.membersNumber}>
              <p>130 Members</p>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          {data.ownerId === user?.user.id ? (
            <button className={styles.edit}>Edit</button>
          ) : (
            <button className={styles.join}>Join Group</button>
          )}

          <button>Invite</button>
        </div>
      </div>
      <AddNew />
    </>
  );
}

export default Grpheader;
