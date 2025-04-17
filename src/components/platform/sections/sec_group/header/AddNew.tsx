/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import styles from "./header.module.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { number } from "yup";
import { Topics } from "@/components/Assets/topics/Topics.data";
import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload"; // Updated import
import { getToken } from "@/Utils/userToken/LocalToken";
import { useParams } from "next/navigation";

// types
type PostType = {
  content: string;
  mainTopicId: string;
  subtopicIds: string[];
  creatorType: "user";
  mediaFiles: File[];
  fileType: "image" | "pdf";
};

function AddNew() {
  const groupId = useParams().groupId as string;

  // Get user info
  const userInfo1 = getToken();
  const userInfo = userInfo1 ? userInfo1.accessToken : null;
  console.log(userInfo);

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
      mediaFiles: [],
      fileType: "image",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"image" | "pdf">("image");

  const handleFilesSelected = (files: File[], type: "image" | "pdf") => {
    setSelectedFiles((prev) => [...prev, ...files]);
    setFileType(type);
    setValue("fileType", type);
  };

  const onSubmit = async (formData: PostType) => {
    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("content", formData.content);
      formDataToSend.append(
        "mainTopicId",
        String(Number(formData.mainTopicId))
      );

      // Append subtopicIds as an array
      formData.subtopicIds.forEach((id, index) => {
        formDataToSend.append(`subtopicIds[${index}]`, String(Number(id)));
      });

      // Append each media file
      if (fileType === "image") {
        selectedFiles.forEach((file) => {
          formDataToSend.append(`images`, file);
        });
      } else if (fileType === "pdf" && selectedFiles.length > 0) {
        formDataToSend.append("document", selectedFiles[0]);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/groups/${groupId}/posts/publish-post`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${userInfo}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      ToastNot(`Post added successfully`);

      // Reset form and state
      reset();
      setSelectedFiles([]);
      setFileType("image");
      setSelectedMainTopic("");
      setSelectedSubtopics([]);
    } catch (err) {
      console.log(err);
      ToastNot("Error occurred while adding post");
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
    <div className={styles.groupForm}>
      <div className={styles.contentBar}>
        <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
          {/* Text Area */}
          <textarea
            placeholder="Add your experiences and tips to make a better future."
            className={styles.textArea}
            {...register("content", { required: true })}
          />

          <div className={styles.addAndCategory}>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              maxImages={4}
              maxSizeInMB={2}
            />

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
          <div className={styles.postActions}>
            <input
              type="submit"
              className={styles.submit}
              value="Publish Post"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNew;
