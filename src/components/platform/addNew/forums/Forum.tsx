"use client";
import React, { useState } from "react";
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

  // get topics and sub topics
  const topics = Topics;

  // handle the form
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostType>({
    defaultValues: {
      headline: "",
      content: "",
      mainTopicId: 0,
      section: "",
      fileType: "image",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    console.log("files", files);
    
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const [header, setheader] = useState<string>("");

  const [selectedOptions, setSelectedOptions] = useState<string>("");
  const onSubmit = (formData: PostType) => {
    // Ensure mainTopicId is a valid integer
    const mainTopicId = parseInt(formData.mainTopicId.toString(), 10);

    if (isNaN(mainTopicId)) {
      ToastNot("Please select a valid topic");
      return;
    }
    try {
      // Create FormData object
      const formDataToSend = new FormData();
      // Append text fields
      formDataToSend.append("headline", formData.headline);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("mainTopicId", String(mainTopicId));
      formDataToSend.append("section", formData.section);
      // Append files

      formDataToSend.append("images", selectedFiles[0]);

      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/forum/add-publication`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userInfo.accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          console.log("data", res.data);
          ToastNot(`Post in ${res.data.section} added successfully`);
          reset();
          setSelectedOptions("");
        })
        .catch((err) => {
          ToastNot(`Error adding forum`);
          console.log(err);
        });
    } catch (err) {
      ToastNot(`Error adding forum`);
      console.log(err);
    }
  };

  // Subcategories selection
  const subTopics = ["need", "doubt", "dream"];
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSelectedOptions(value);
    setValue("section", value);
  };

  // Handle topic change and reset subtopics
  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMainTopic = event.target.value;

    // Ensure the selected value is converted to a number
    const topicId = parseInt(selectedMainTopic, 10);

    // Only set the value if it's a valid number
    if (!isNaN(topicId)) {
      setValue("mainTopicId", topicId);
    }
  };

  return (
    <div className={styles.container}>
      {/* Start header */}
      <div className={styles.header}>
        <h2>
          <Image src={dicusionIcon} alt="addIcon" /> <span>Start Forum</span>
        </h2>
      </div>
      {/* End header */}

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
                <p className={styles.headlineCount}>*{header?.length}/50</p>
              </div>

              <textarea
                placeholder="Add your experiences and tips to make a better future."
                className={styles.textArea}
                {...register("content", { required: true })}
              />
            </div>
          </div>
          {/* End text box section */}

          <div className={styles.addAndCategory}>
            <div className={styles.selectCategory}>
              {/* Main Category */}
              <select
                {...register("mainTopicId", {
                  required: "Please select a topic",
                  validate: (value) =>
                    !isNaN(parseInt(value.toString(), 10)) ||
                    "Invalid topic selection",
                })}
                onChange={handleTopicChange}
              >
                <option value="">-Select-</option>
                {topics?.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
              {errors.mainTopicId && (
                <p className={styles.error}>{errors.mainTopicId.message}</p>
              )}

              {/* Subcategories */}
              <div className={styles.selectSubCategory}>
                {subTopics &&
                  subTopics.map((subTopic, index) => (
                    <label htmlFor={subTopic} key={index}>
                      <input
                        id={subTopic}
                        type="radio"
                        value={subTopic}
                        checked={selectedOptions === subTopic}
                        onChange={handleOptionChange}
                      />
                      {subTopic}
                    </label>
                  ))}
              </div>
            </div>
            <FileUpload
              selectAll={false}
              onFilesSelected={handleFilesSelected}
              maxImages={1}
              maxSizeInMB={2}
            />

            <input type="submit" className={styles.submit} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Forums;
