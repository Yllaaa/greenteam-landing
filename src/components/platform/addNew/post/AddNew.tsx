/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import styles from "./AddNew.module.css";
import { useForm } from "react-hook-form";
import addIcon from "@/../public/forum/add.svg";
import Image from "next/image";
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { number } from "yup";
import { Topics } from "@/components/Assets/topics/Topics.data";

// types

type PostType = {
  content: string;
  mainTopicId: string;
  subtopicIds: string[];
  creatorType: "user";
};

function AddNew() {
  // Get user info
  const userInfo1 = localStorage.getItem("user");
  const userInfo = userInfo1 ? JSON.parse(userInfo1) : null;

  // topics and subtopics
  const topics = Topics;
  const [selectedMainTopic, setSelectedMainTopic] = useState<string | any>();
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[] | any>(
    []
  );

  // Form handling
  const { register, reset, handleSubmit, setValue } = useForm<PostType | any>({
    defaultValues: {
      content: "",
      mainTopicId: number,
      subtopicIds: [number],
      creatorType: "user",
    },
  });

  const onSubmit = async (formData: PostType) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/publish-post`,
        {
          content: formData.content,
          mainTopicId: Number(formData.mainTopicId),
          subtopicIds: formData.subtopicIds.map((id) => Number(id)),
          creatorType: "user",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.accessToken}`,
          },
        }
      );
      console.log(response.data);

      ToastNot(`Post added successfully`);
      reset();
      setSelectedMainTopic(""); // Reset topic selection
      setSelectedSubtopics([]); // Reset subtopics selection
    } catch (err) {
      console.log(err);
      ToastNot("error occured while adding post");
    }
  };

  // Handle topic selection
  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const topicId = Number(event.target.value);

    setSelectedMainTopic(topicId);
    setValue("mainTopicId", topicId);
    setSelectedSubtopics([]); // Reset selected subtopics
    setValue("subtopicIds", []); // Clear selected options in form state
  };

  // Handle subtopic selection
  const handleSubtopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    let updatedSubtopics = [...selectedSubtopics];

    if (checked) {
      updatedSubtopics.push(value);
    } else {
      updatedSubtopics = updatedSubtopics.filter((id) => id !== value);
    }

    setSelectedSubtopics(updatedSubtopics);
    setValue("subtopicIds", updatedSubtopics);
  };

  // Get subtopics based on selected topic
  const selectedTopic = topics.find((topic) => topic.id == selectedMainTopic);
  const subtopics = selectedTopic?.subtopics || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          <Image src={addIcon} alt="addIcon" /> <span>Add New Post</span>
        </h2>
      </div>
      <div className={styles.forumBody}>
        <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
          {/* Text Area */}
          <textarea
            placeholder="Add your experiences and tips to make a better future."
            className={styles.textArea}
            {...register("content", { required: true })}
          />

          <div className={styles.addAndCategory}>
            {/* Main Topic Selection */}
            <div className={styles.selectCategory}>
              <select
                {...register("mainTopicId", { required: true })}
                onChange={handleTopicChange}
              >
                <option value="">- Select a Topic -</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subtopic Selection (Checkboxes) */}
            {selectedMainTopic && (
              <div className={styles.selectSubCategory}>
                {subtopics.length > 0 ? (
                  subtopics.map((subtopic) => (
                    <label
                      style={
                        selectedSubtopics.includes(`${subtopic.id}`)
                          ? { backgroundColor: "green" }
                          : {}
                      }
                      key={subtopic.id}
                      className={styles.checkboxLabel}
                    >
                      <input
                        type="checkbox"
                        value={`${subtopic.id}`}
                        checked={selectedSubtopics.includes(`${subtopic.id}`)}
                        onChange={handleSubtopicChange}
                      />
                      {subtopic.name}
                    </label>
                  ))
                ) : (
                  <p className={styles.noSubtopics}>
                    No subtopics available for this topic.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <input type="submit" className={styles.submit} value="Publish Post" />
        </form>
      </div>
    </div>
  );
}

export default AddNew;
