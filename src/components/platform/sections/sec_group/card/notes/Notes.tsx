"use client";
import React, { useEffect, useState } from "react";
import styles from "./notes.module.scss";
import { useParams } from "next/navigation";
import { getNotes, Note } from "./notes.data";
import { useAppSelector } from "@/store/hooks";
import { useForm } from "react-hook-form";
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

interface NoteType {
  title: string;
  content: string;
}
function Notes() {
  const userInfo = useAppSelector((state) => state.login.accessToken);
  const params = useParams();
  const groupId = params && params.groupId as string;
  const groupData = useAppSelector((state) => state.groupState);
  const [data, setData] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);
  // Form handling
  const { register, reset, handleSubmit } = useForm<NoteType>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (formData: NoteType) => {
    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("content", formData.content);

      formDataToSend.append("title", formData.title);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/groups/${groupId}/note/upsert-note`,
        {
          title: formData.title,
          content: formData.content,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo}`,
          },
        }
      );

      console.log(response.data);
      ToastNot(`Note added successfully`);

      // Reset form and state
      reset();
    } catch (err) {
      console.log(err);
      ToastNot("Error occurred while adding note");
    }
  };

  useEffect(() => {
    // Only fetch notes if user is a member
    if (groupData && groupData.isUserMember) {
      setLoading(true);
      getNotes(groupId as string)
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
      <>
        <div className={styles.notesForm}>
          <div className={styles.note}>
            <h2>Notes</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="Title"
                {...register("title", { required: true })}
              />
              <textarea
                placeholder="Content"
                {...register("content", { required: true })}
              />
              <button type="submit">Add Note</button>
            </form>
          </div>
        </div>
      </>
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
