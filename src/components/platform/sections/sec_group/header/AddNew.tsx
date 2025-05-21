/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef } from "react";
import styles from "./header.module.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { Topics } from "@/components/Assets/topics/Topics.data";
import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useParams } from "next/navigation";
import { FiSend } from "react-icons/fi";
import { IoIosImages } from "react-icons/io";
import { MdOutlineCategory } from "react-icons/md";
import { BiTag } from "react-icons/bi";


// types
type PostType = {
  content: string;
  mainTopicId: string;
  subtopicIds: string[];
  creatorType: "user";
  mediaFiles: File[];
  fileType: "image" | "pdf";
};

function AddNew({ onPostComplete }: { onPostComplete?: () => void }) {
  const groupId = useParams().groupId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get user info
  const userInfo1 = getToken();
  const userInfo = userInfo1 ? userInfo1.accessToken : null;

  // topics and subtopics
  const topics = Topics;
  const [selectedMainTopic, setSelectedMainTopic] = useState<string | any>();
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[] | any>([]);

  // Form handling
  const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm<PostType | any>({
    defaultValues: {
      content: "",
      mainTopicId: "",
      subtopicIds: [],
      creatorType: "user",
      mediaFiles: [],
      fileType: "image",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"image" | "pdf">("image");

  const handleFilesSelected = (files: File[], type: "image" | "pdf") => {
    // Create object URLs for previews


    setSelectedFiles(prev => [...prev, ...files]);

    setFileType(type);
    setValue("fileType", type);
  };



  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCharCount(value.length);

    // Auto-resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const onSubmit = async (formData: PostType) => {
    if (!formData.content.trim() && selectedFiles.length === 0) {
      ToastNot("Please add content or media to your post");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData object
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("content", formData.content);

      if (formData.mainTopicId) {
        formDataToSend.append("mainTopicId", String(Number(formData.mainTopicId)));

        // Append subtopicIds as an array if main topic is selected
        if (formData.subtopicIds && formData.subtopicIds.length > 0) {
          formData.subtopicIds.forEach((id: string, index: number) => {
            formDataToSend.append(`subtopicIds[${index}]`, String(Number(id)));
          });
        }
      }

      // Append each media file
      if (fileType === "image" && selectedFiles.length > 0) {
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
      ToastNot(`Post published successfully`);

      // Reset form and state
      reset();
      setSelectedFiles([]);
      setFileType("image");
      setSelectedMainTopic("");
      setSelectedSubtopics([]);
      setCharCount(0);
      window.location.reload();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Call onPostComplete if provided
      if (onPostComplete) {
        onPostComplete();
      }
    } catch (err) {
      console.log(err);
      ToastNot("Error occurred while publishing post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle topic selection
  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const topicId = event.target.value;
    if (!topicId) {
      setSelectedMainTopic("");
      setValue("mainTopicId", "");
      setSelectedSubtopics([]);
      setValue("subtopicIds", []);
      return;
    }

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
      <div className={styles.formHeader}>
        <h3>Create Post</h3>
        <p>Share your thoughts, experiences, and media with the group</p>
      </div>

      <div className={styles.contentBar}>
        <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
          {/* Text Area with character count */}
          <div className={styles.textAreaContainer}>
            <textarea
              // ref={textareaRef}
              placeholder="What's on your mind? Share your experiences, tips or questions..."
              className={styles.textArea}
              {...register("content")}
              onChange={(e) => {
                register("content").onChange(e);
                handleTextAreaChange(e);
              }}
            />
            <div className={styles.charCount}>
              <span className={charCount > 1000 ? styles.charCountWarning : ''}>
                {charCount}/2000
              </span>
            </div>
          </div>



          <div className={styles.addAndCategory}>
            {/* Upload Section */}
            <div className={styles.uploadSection}>
              <div className={styles.uploadLabel}>
                <IoIosImages className={styles.uploadIcon} />
                <span>Add Media</span>
              </div>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                maxImages={4}
                maxSizeInMB={2}
              />
            </div>

            {/* Main Topic Selection */}
            <div className={styles.categoriesSection}>
              <div className={styles.categoryLabel}>
                <MdOutlineCategory className={styles.categoryIcon} />
                <span>Category</span>
              </div>
              <div className={styles.selectCategory}>
                <select
                  {...register("mainTopicId")}
                  onChange={handleTopicChange}
                  className={errors.mainTopicId ? styles.errorInput : ''}
                >
                  <option value="">Select a Topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
                {errors.mainTopicId && (
                  <p className={styles.errorText}>Please select a topic</p>
                )}
              </div>
            </div>
          </div>

          {/* Subtopic Selection (Checkboxes) */}
          {selectedMainTopic && (
            <div className={styles.subtopicsSection}>
              <div className={styles.subtopicLabel}>
                <BiTag className={styles.subtopicIcon} />
                <span>Subtopics</span>
              </div>
              <div className={styles.selectSubCategory}>
                {subtopics.length > 0 ? (
                  subtopics.map((subtopic) => (
                    <label
                      key={subtopic.id}
                      className={`${styles.checkboxLabel} ${selectedSubtopics.includes(`${subtopic.id}`) ? styles.selectedSubtopic : ''
                        }`}
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
                    No subtopics available for this category.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className={styles.postActions}>
            <button
              type="submit"
              className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
              disabled={isSubmitting}
            >
              <FiSend className={styles.sendIcon} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNew;