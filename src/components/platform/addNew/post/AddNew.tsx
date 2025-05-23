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
import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { FaChevronDown } from 'react-icons/fa'; // Import chevron icon

// types
type PostType = {
  content: string;
  mainTopicId: string;
  subtopicIds: string[];
  creatorType: "user";
  mediaFiles: File[];
  fileType: "image" | "pdf";
};

function AddNew(props:{setAddPost:React.Dispatch<React.SetStateAction<boolean>>}) {
  const { setAddPost } = props;
  const router = useRouter();
  const locale = useLocale();

  // Get user info
  const userInfo1 = getToken();
  const userInfo = userInfo1 ? userInfo1.accessToken : null;

  // topics and subtopics
  const topics = Topics;
  const [selectedMainTopic, setSelectedMainTopic] = useState<string | any>();
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[] | any>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      formDataToSend.append("creatorType", "user");

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
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/publish-post`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${userInfo}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      ToastNot(`Post added successfully`);

      // Reset form and state
      reset();
      setSelectedFiles([]);
      setFileType("image");
      setAddPost(false);
      setSelectedMainTopic("");
      setSelectedSubtopics([]);

      // Redirect to the new post
      if (response.data && response.data.id) {
        router.push(`/${locale}/feeds/posts/${response.data.id}`);
      }
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

  // Get selected topic name for display
  const getSelectedTopicName = () => {
    if (!selectedMainTopic) return "- Select a Category -";
    const topic = topics.find(t => t.id == selectedMainTopic);
    return topic ? topic.name : "- Select a Category -";
  };

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

          <div className={styles.addActions}>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              maxImages={4}
              maxSizeInMB={2}
            />
            <div className={styles.addAndCategory}>
              {/* Enhanced Category Dropdown */}
              <div className={styles.selectCategory}>
                <div
                  className={styles.customSelect}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={selectedMainTopic ? styles.selectedValue : styles.placeholder}>
                    {getSelectedTopicName()}
                  </span>
                  <FaChevronDown className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.open : ''}`} />

                  {isDropdownOpen && (
                    <div className={styles.dropdownOptions}>
                      {topics.map((topic) => (
                        <div
                          key={topic.id}
                          className={styles.option}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMainTopic(topic.id);
                            setValue("mainTopicId", topic.id);
                            setSelectedSubtopics([]);
                            setValue("subtopicIds", []);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {topic.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hidden select for form submission */}
                <select
                  className={styles.hiddenSelect}
                  {...register("mainTopicId", { required: true })}
                  value={selectedMainTopic || ""}
                  onChange={handleTopicChange}
                >
                  <option value="">- Select a Category -</option>
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
                            ? { backgroundColor: "#74b243" } // Changed to match the submit button color
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

              {/* Submit Button - Aligned with category button */}
              <button type="submit" className={styles.submit}>Publish Post</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNew;