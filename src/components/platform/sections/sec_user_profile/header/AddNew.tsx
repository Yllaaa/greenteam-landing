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
import { useTranslations } from "next-intl";

function AddNew(props: {
  onPostComplete?: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { onPostComplete, isOpen, onClose } = props;

  const t = useTranslations("web.header");
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
  const [posting, setPosting] = useState(false);

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

  // Validation function
  const validateForm = (formData: any): string | null => {
    // Check if content is empty
    if (!formData.content || formData.content.trim().length === 0) {
      return "post content is empty";
    }

    // Check if category is selected
    if (!selectedMainTopic) {
      return "please select category";
    }

    // Check if subcategory is required and selected (only if subtopics exist for the selected topic)
    if (selectedTopicData && subtopics.length > 0 && selectedSubtopics.length === 0) {
      return "please select subcategory";
    }

    return null; // No errors
  };

  const onSubmit = async (formData: any) => {
    // Validate form
    const validationError = validateForm(formData);
    if (validationError) {
      ToastNot(validationError);
      return;
    }

    setPosting(true);

    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("content", formData.content.trim());
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
      ToastNot("Post added successfully");

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
    } catch (err: any) {
      console.log(err);

      // Handle different types of errors with specific messages
      let errorMessage = "Error occurred while adding post";

      if (err.response) {
        // Server responded with error status
        const { status, data } = err.response;

        switch (status) {
          case 400:
            // Check for specific validation errors from server
            if (data.errors) {
              if (data.errors.content) {
                errorMessage = "post content is empty";
              } else if (data.errors.mainTopicId) {
                errorMessage = "please select category";
              } else if (data.errors.subtopicIds) {
                errorMessage = "please select subcategory";
              } else {
                errorMessage = data.message || "Invalid form data";
              }
            } else {
              errorMessage = data.message || "Invalid form data";
            }
            break;

          case 401:
            errorMessage = "Authentication failed. Please login again";
            break;

          case 403:
            errorMessage = "You don't have permission to create posts";
            break;

          case 413:
            errorMessage = "Files are too large. Please reduce file sizes";
            break;

          case 422:
            errorMessage = "Invalid file format or content";
            break;

          case 500:
            errorMessage = "Server error. Please try again later";
            break;

          default:
            errorMessage = data.message || "Server error occurred";
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your connection";
      } else {
        // Other error
        errorMessage = "An unexpected error occurred";
      }

      ToastNot(errorMessage);
    } finally {
      setPosting(false);
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
                          {t(`topics.${topic.name}`)}
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
                        {t(`topics.${subtopic.name}`)}
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
              maxSizeInMB={10}
            />
            {/* Submit Button */}
            <input
              type="submit"
              className={styles.submit}
              value={posting ? "Posting..." : "Post"}
              disabled={posting}
              style={{ cursor: posting ? "not-allowed" : "pointer" }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNew;