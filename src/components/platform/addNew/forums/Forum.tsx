"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Forum.module.css";
import { useForm } from "react-hook-form";
import dicusionIcon from "@/../public/forum/discution.svg";
import Image from "next/image";
import defaultAvatar from "@/../public/auth/user.png";
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { getToken } from "@/Utils/userToken/LocalToken";
import { Topics } from "@/components/Assets/topics/Topics.data";
import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
import { FaChevronDown, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useLocale } from 'next-intl';
type PostType = {
  headline: string;
  content: string;
  mainTopicId: number;
  section: string;
  fileType: "image" | "pdf";
};

function Forums() {
  // get the user info
  const userInfo1 = getToken();
  const userInfo = userInfo1 ? userInfo1 : null;
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter()
  const locale = useLocale()
  // get topics and sub topics
  const topics = Topics;

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // handle the form
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostType>({
    defaultValues: {
      headline: "",
      content: "",
      mainTopicId: 0,
      section: "",
      fileType: "image",
    },
    mode: "onChange" // Validate form as user types
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const headlineValue = watch("headline");
  const contentValue = watch("content");
  const mainTopicIdValue = watch("mainTopicId");
  const sectionValue = watch("section");

  // Compute form validity manually to ensure button state is properly managed
  const [formIsValid, setFormIsValid] = useState(false);

  // Check form validity based on required fields
  useEffect(() => {
    const isValid =
      !!headlineValue &&
      !!contentValue &&
      contentValue.length >= 10 &&
      !!mainTopicIdValue &&
      !!sectionValue;

    setFormIsValid(isValid);
  }, [headlineValue, contentValue, mainTopicIdValue, sectionValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click was OUTSIDE the dropdown (note the ! operator)
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Track form completion percentage
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    let percentage = 0;
    if (headlineValue && headlineValue.length > 0) percentage += 25;
    if (contentValue && contentValue.length >= 10) percentage += 25;
    if (mainTopicIdValue && mainTopicIdValue !== 0) percentage += 25;
    if (sectionValue && sectionValue.length > 0) percentage += 25;

    setCompletionPercentage(percentage);
  }, [headlineValue, contentValue, mainTopicIdValue, sectionValue]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);

      // Create preview URL for the first image
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFiles([]);
  };

  const [header, setheader] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string>("");

  const onSubmit = async (formData: PostType) => {
    // Ensure mainTopicId is a valid integer
    const mainTopicId = parseInt(formData.mainTopicId.toString(), 10);

    if (isNaN(mainTopicId)) {
      ToastNot("Please select a valid topic");
      return;
    }

    // Check minimum content length
    if (formData.content.length < 10) {
      ToastNot("Content must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      // Append text fields
      formDataToSend.append("headline", formData.headline);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("mainTopicId", String(mainTopicId));
      formDataToSend.append("section", formData.section);

      // Append files if any are selected (now optional)
      if (selectedFiles.length > 0) {
        formDataToSend.append("images", selectedFiles[0]);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/forum/add-publication`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      router.push(`/${locale}/feeds`);

      // Show success message with animation
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      ToastNot(`Post in ${response.data.section} added successfully`);

      // Clean up
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFiles([]);
      setSelectedOptions("");
      reset();

    } catch (err) {
      ToastNot(`Error adding forum`);
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Subcategories selection
  const subTopics = ["need", "doubt", "dream"];

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedOptions(value);
    setValue("section", value);
  };

  // Get selected topic name for display
  const getSelectedTopicName = () => {
    if (!mainTopicIdValue || mainTopicIdValue === 0) return "- Select Category -";
    const topic = topics.find(t => t.id == mainTopicIdValue);
    return topic ? topic.name : "- Select Category -";
  };

  // Handle topic change and reset subtopics
  const handleTopicChange = (topicId: number) => {
    // Ensure the selected value is converted to a number
    if (!isNaN(topicId)) {
      setValue("mainTopicId", topicId);
      setIsDropdownOpen(false);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Start header */}
      <div className={styles.header}>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Image src={dicusionIcon} alt="addIcon" /> <span>Start Forum</span>
        </motion.h2>
      </div>
      {/* End header */}

      {/* Form progress indicator */}
      <div className={styles.progressContainer}>
        <motion.div
          className={styles.progressBar}
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
        <div className={styles.progressSteps}>
          <div className={`${styles.step} ${headlineValue ? styles.completed : ''}`}>Title</div>
          <div className={`${styles.step} ${contentValue && contentValue.length >= 10 ? styles.completed : ''}`}>Content</div>
          <div className={`${styles.step} ${mainTopicIdValue ? styles.completed : ''}`}>Category</div>
          <div className={`${styles.step} ${sectionValue ? styles.completed : ''}`}>Type</div>
        </div>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            className={styles.successMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.successIcon}>✓</div>
            Your post was successfully created!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start form */}
      <div className={styles.forumBody}>
        <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
          {/* Text box section */}
          <div className={styles.boxContainer}>
            <div className={styles.userAvatar}>
              {userInfo?.avatar ? (
                <Image
                  src={userInfo.avatar}
                  alt="userAvatar"
                  width={50}
                  height={50}
                />
              ) : (
                <Image
                  src={defaultAvatar}
                  alt="userAvatar"
                  width={50}
                  height={50}
                />
              )}
              <div className={styles.avatarBadge}></div>
            </div>
            <div className={styles.textAreaContainer}>
              <div className={styles.headline}>
                <textarea
                  placeholder="Add your headline"
                  className={styles.headlineArea}
                  maxLength={50}
                  {...register("headline", { required: true, maxLength: 50 })}
                  onChange={(event) => {
                    setheader(event.target.value);
                  }}
                />
                <p className={`${styles.headlineCount} ${header?.length > 40 ? styles.almostFull : ''} ${header?.length === 50 ? styles.full : ''}`}>
                  {header?.length}/50
                </p>
                {errors.headline && <span className={styles.errorMessage}>Headline is required</span>}
              </div>

              <textarea
                placeholder="Add your experiences and tips to make a better future."
                className={styles.textArea}
                {...register("content", {
                  required: true,
                  minLength: {
                    value: 10,
                    message: "Content must be at least 10 characters"
                  }
                })}
              />
              {errors.content && (
                <span className={styles.errorMessage}>
                  {errors.content.type === "minLength"
                    ? "Content must be at least 10 characters"
                    : "Content is required"}
                </span>
              )}
              {contentValue && contentValue.length < 10 && (
                <span className={styles.charCount}>
                  {contentValue.length}/10 characters minimum
                </span>
              )}
            </div>
          </div>
          {/* End text box section */}

          <div className={styles.addAndCategory}>
            <div className={styles.leftControls}>
              {/* Enhanced Category Dropdown */}
              <div className={styles.selectCategory} ref={dropdownRef}>
                <div
                  className={`${styles.customSelect} ${errors.mainTopicId ? styles.error : ''} ${mainTopicIdValue ? styles.selected : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={mainTopicIdValue ? styles.selectedValue : styles.placeholder}>
                    {getSelectedTopicName()}
                  </span>
                  <FaChevronDown className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.open : ''}`} />

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className={styles.dropdownOptions}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {topics?.map((topic) => (
                          <motion.div
                            key={topic.id}
                            className={`${styles.option} ${mainTopicIdValue === topic.id ? styles.selected : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTopicChange(topic.id);
                            }}
                            whileHover={{ backgroundColor: "#262626" }}
                            transition={{ duration: 0.1 }}
                          >
                            {topic.name}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hidden select for form submission */}
                <select
                  className={styles.hiddenSelect}
                  {...register("mainTopicId", {
                    required: "Please select a topic",
                    validate: (value) =>
                      !isNaN(parseInt(value.toString(), 10)) ||
                      "Invalid topic selection",
                  })}
                  value={mainTopicIdValue || ""}
                  onChange={(e) => handleTopicChange(parseInt(e.target.value, 10))}
                >
                  <option value="">-Select-</option>
                  {topics?.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
                {errors.mainTopicId && (
                  <p className={styles.errorMessage}>{errors.mainTopicId.message}</p>
                )}
              </div>

              {/* Enhanced Subcategories */}
              <div className={styles.selectSubCategory}>
                {subTopics &&
                  subTopics.map((subTopic, index) => (
                    <motion.label
                      htmlFor={subTopic}
                      key={index}
                      className={`${styles.radioLabel} ${selectedOptions === subTopic ? styles.selected : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <input
                        id={subTopic}
                        type="radio"
                        value={subTopic}
                        checked={selectedOptions === subTopic}
                        onChange={handleOptionChange}
                        className={styles.radioInput}
                      />
                      <div className={styles.radioCircle}></div>
                      {subTopic}
                    </motion.label>
                  ))}
              </div>
              {errors.section && <span className={styles.errorMessage}>Please select a forum type</span>}
            </div>

            <div className={styles.rightControls}>
              {/* File upload with preview (now optional) */}
              <div className={styles.fileUploadContainer}>
                {previewUrl ? (
                  <motion.div
                    className={styles.imagePreview}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={40}
                      height={40}
                      className={styles.previewImage}
                    />
                    <motion.button
                      type="button"
                      className={styles.removeButton}
                      onClick={removeImage}
                      whileHover={{ scale: 1.1, backgroundColor: "#ff3b30" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimes />
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className={styles.uploadButtonWrapper}>
                    <FileUpload
                      selectAll={false}
                      onFilesSelected={handleFilesSelected}
                      maxImages={1}
                      maxSizeInMB={2}
                    />
                    {/* <div className={styles.customUploadButton}>
                      <FaImage />
                      <span className={styles.uploadText}>Add Image</span>
                    </div> */}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className={`${styles.submit} ${formIsValid ? styles.active : styles.disabled}`}
                disabled={isSubmitting || !formIsValid}
                whileHover={formIsValid ? { scale: 1.05, y: -2 } : {}}
                whileTap={formIsValid ? { scale: 0.95 } : {}}
                transition={{ duration: 0.2 }}
              >
                {isSubmitting ? (
                  <div className={styles.loadingSpinner}></div>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span className={styles.submitText}>Post</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Form tips */}
          <div className={styles.formTips}>
            <div className={styles.tipIcon}>💡</div>
            <p>
              <strong>Tip:</strong> Adding a clear headline and choosing the right category will help
              others find and engage with your forum post. Images are optional but recommended.
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Forums;