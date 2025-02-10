"use client";
import React, { useEffect, useState } from "react";
import styles from "./Forum.module.css";
import { useForm } from "react-hook-form";
import dicusionIcon from "@/../public/forum/discution.svg";
import Image from "next/image";
import defaultAvatar from "@/../public/auth/user.png";
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

// topics
type ParentType = {
  id: string;
  name: string;
};

type ItemType = {
  id: string;
  name: string;
  parentId: string;
  parent: ParentType;
};

// post
type PostType = {
  headline: string;
  content: string;
  mainTopicId: string;
  section: string;
};

function Forums() {
  // get the user info
  const userInfo1 = localStorage.getItem("user");
  const userInfo = userInfo1 ? JSON.parse(userInfo1) : null;

  // get topics and sub topics
  const [topics, setTopics] = useState<ItemType[]>();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/topics`)
      .then((res) => {
        setTopics(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // handle the form
  const { register, reset, handleSubmit, setValue } = useForm<PostType>({
    defaultValues: {
      headline: "",
      content: "",
      mainTopicId: "",
      section: "",
    },
  });

  const [header, setheader] = useState<string>("");

  const [selectedOptions, setSelectedOptions] = useState<string>("");
  const onSubmit = (formData: PostType) => {
    console.log(formData);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/forum/add-publication`,
        {
          headline: formData.headline,
          content: formData.content,
          mainTopicId: formData.mainTopicId,
          section: formData.section,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        console.log("data", res.data);
        ToastNot(`Post in ${res.data.section} added successfully`);
      })
      .catch((err) => {
        ToastNot(`Error adding forum`);
        console.log(err);
      });
    reset();
    setSelectedOptions("");
  };

  // Subcategories selection

  const subTopics = ["need", "doubt", "dream"];
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSelectedOptions(value);

    // setSelectedOptions(value as "" | "dream" | "need" | "doubt");
    setValue("section", value);
  };

  // Handle topic change and reset subtopics
  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMainTopic = event.target.value;
    setValue("mainTopicId", selectedMainTopic);
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
                {...register("mainTopicId", { required: true })}
                onChange={handleTopicChange}
              >
                <option value="">-Select-</option>
                {topics?.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>

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

            <input type="submit" className={styles.submit} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Forums;
