/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import styles from "./AddNewModal.module.css";
import { useForm } from "react-hook-form";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import Image from "next/image";
import plusIcon from "@/../public/ZPLATFORM/madal/plusIcon.svg";
import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { FaChevronDown } from 'react-icons/fa';
import { Topics } from "@/components/Assets/topics/Topics.data";

function AddNew(props: {
  onPostComplete?: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { onPostComplete, isOpen, onClose } = props;

  // Get user info
  const userInfo1 = getToken();
  const userInfo = userInfo1 ? userInfo1.accessToken : null;

  // Handle modal close
  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const modalRef = useOutsideClick(closeModal);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedMainTopic, setSelectedMainTopic] = useState<number | null>(null);
  const [selectedSubtopics, setSelectedSubtopics] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Form handling
  const { register, reset, handleSubmit, setValue } = useForm<any>({
    defaultValues: {
      content: "",
      images: selectedFiles,
      mainTopicId: null,
      subtopicIds: [],
      creatorType: "user",
    },
  });

  const [fileType, setFileType] = useState<"image" | "pdf">("image");

  const handleFilesSelected = (files: File[], type: "image" | "pdf") => {
    setSelectedFiles((prev) => [...prev, ...files]);
    setFileType(type);
    setValue("fileType", type);
  };

  // Handle topic selection
  const handleTopicSelect = (topicId: number) => {
    setSelectedMainTopic(topicId);
    setValue("mainTopicId", topicId);

    // Reset subtopics when main topic changes
    setSelectedSubtopics([]);
    setValue("subtopicIds", []);

    setIsDropdownOpen(false);
  };

  // Handle subtopic selection
  const handleSubtopicChange = (subtopicId: number) => {
    setSelectedSubtopics(prev => {
      const isSelected = prev.includes(subtopicId);

      // If already selected, remove it
      if (isSelected) {
        const updated = prev.filter(id => id !== subtopicId);
        setValue("subtopicIds", updated);
        return updated;
      }

      // If not selected, add it
      const updated = [...prev, subtopicId];
      setValue("subtopicIds", updated);
      return updated;
    });
  };

  // Get subtopics based on selected topic
  const selectedTopicData = Topics.find((topic) => topic.id === selectedMainTopic);
  const subtopics = selectedTopicData?.subtopics || [];

  // Get selected topic name for display
  const getSelectedTopicName = () => {
    if (!selectedMainTopic) return "- Select a Category -";
    const topic = Topics.find(t => t.id === selectedMainTopic);
    return topic ? topic.name : "- Select a Category -";
  };

  const onSubmit = async (formData: any) => {
    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("content", formData.content);
      formDataToSend.append("creatorType", "user");

      // Append mainTopicId if selected
      if (selectedMainTopic) {
        formDataToSend.append("mainTopicId", String(selectedMainTopic));
      }

      // Append subtopicIds as an array
      selectedSubtopics.forEach((id, index) => {
        formDataToSend.append(`subtopicIds[${index}]`, String(id));
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

      console.log(response.data);
      ToastNot(`Post added successfully`);

      // Reset form and state
      reset();
      setSelectedFiles([]);
      setFileType("image");
      setSelectedMainTopic(null);
      setSelectedSubtopics([]);

      // Call onPostComplete if provided
      if (onPostComplete) {
        window.location.reload();
        onPostComplete();
      }

      // Close modal
      onClose();
    } catch (err) {
      console.log(err);
      ToastNot("Error occurred while adding post");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.modalcontent}>
        <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
          <h2 className={styles.title}>
            <Image
              src={plusIcon}
              alt="plusIcon"
              loading="lazy"
              width={48}
              height={48}
            />
            Build sustainable culture Sharing your experience
          </h2>
          {/* Text Area */}
          <textarea
            placeholder="Add your experiences and tips to make a better future."
            className={styles.textArea}
            {...register("content", { required: true })}
          />

          {/* Topic Selection */}
          <div className={styles.topicContainer}>
            <div className={styles.topicSelection}>
              <div className={styles.selectCategory} ref={dropdownRef}>
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
                      {Topics.map((topic) => (
                        <div
                          key={topic.id}
                          className={`${styles.option} ${selectedMainTopic === topic.id ? styles.selectedOption : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTopicSelect(topic.id);
                          }}
                        >
                          {topic.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Subtopic Selection - Only show if a main topic is selected */}
              {selectedMainTopic && subtopics.length > 0 && (
                <div className={styles.subtopicsWrapper}>
                  <div className={styles.subtopicsLabel}>Select subtopics:</div>
                  <div className={styles.subtopics}>
                    {subtopics.map((subtopic) => (
                      <div
                        key={subtopic.id}
                        className={`${styles.subtopicTag} ${selectedSubtopics.includes(subtopic.id) ? styles.selected : ''
                          }`}
                        onClick={() => handleSubtopicChange(subtopic.id)}
                      >
                        {subtopic.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.buttons}>
            {/* File Upload */}
            <FileUpload
              onFilesSelected={handleFilesSelected}
              maxImages={4}
              maxSizeInMB={2}
            />
            {/* Submit Button */}
            <input
              type="submit"
              className={styles.submit}
              value="Post"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNew;