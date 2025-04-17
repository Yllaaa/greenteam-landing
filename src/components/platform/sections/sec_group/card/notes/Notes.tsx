"use client";
import React, { useEffect, useState } from "react";
import styles from "./notes.module.scss";
import { useParams } from "next/navigation";
import { getNotes, Note } from "./notes.data";
import { useAppSelector } from "@/store/hooks";

function Notes() {
  const groupId = useParams().groupId as string;
  const groupData = useAppSelector((state) => state.groupState);
  const [data, setData] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch notes if user is a member
    if (groupData && groupData.isUserMember) {
      setLoading(true);
      getNotes(groupId)
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          console.error("Error fetching notes:", err);
          setData([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [groupId, groupData]);

  // Show loading state
  if (loading) {
    return (
      <div className={styles.notes}>
        <div className={styles.note}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Check if user is a member first
  if (!groupData || !groupData.isUserMember) {
    return (
      <div className={styles.notes}>
        <div className={styles.note}>
          <h2>You need to join this group to view notes</h2>
        </div>
      </div>
    );
  }
  // Check if user is admin
  if (groupData.isAdmin) {
    return (
      <div className={styles.notes}>
        <div className={styles.note}>
          <h2>ADMIN FORM</h2>
        </div>
      </div>
    );
  }

  // Show notes or no notes message
  return (
    <>
      <div className={styles.notesContainer}>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className={styles.notes}>
              <div className={styles.note}>
                <h2>{item.title}</h2>
                <p>{item.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.notes}>
            <div className={styles.note}>
              <h2>No notes available</h2>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Notes;
