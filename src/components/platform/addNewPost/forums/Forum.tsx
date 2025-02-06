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
  content: string;
  mainTopicId: string;
  subtopicIds: string[];
  creatorType: "user";
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
  const { register, handleSubmit, setValue, getValues } = useForm<PostType>({
    defaultValues: {
      content: "",
      mainTopicId: "",
      subtopicIds: [],
      creatorType: "user",
    },
  });

  const [data, setData] = useState<PostType | null>(null);

  const onSubmit = (formData: PostType) => {
    setData(formData);
    console.log(formData);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/posts/publish-post`,
        {
          content: formData.content,
          mainTopicId: formData.mainTopicId,
          subtopicIds: formData.subtopicIds,
          creatorType: "user",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
          // withCredentials: true,
        }
      )
      .then((res) => {
        console.log("data",res.data);
        ToastNot(`Post in ${res.data.mainTopic.name} added successfully`);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(data);
  };

  // Subcategories selection
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    let updatedSelections = [...selectedOptions];

    if (checked) {
      updatedSelections.push(value);
    } else {
      updatedSelections = updatedSelections.filter((id) => id !== value);
    }

    setSelectedOptions(updatedSelections);
    setValue("subtopicIds", updatedSelections);
  };

  // Find the parent category
  const subTopic = topics?.find(
    (topic) => topic.id === getValues("mainTopicId")
  )?.parent;

  // Handle topic change and reset subtopics
  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMainTopic = event.target.value;
    setValue("mainTopicId", selectedMainTopic);
    setSelectedOptions([]); // Reset selected subtopics
    setValue("subtopicIds", []); // Clear selected options in form state
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
            <textarea
              placeholder="Add your experiences and tips to make a better future."
              className={styles.textArea}
              {...register("content", { required: true })}
            />
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
                {subTopic && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        value={subTopic.id}
                        checked={selectedOptions.includes(subTopic.id)}
                        onChange={handleOptionChange}
                      />{" "}
                      {subTopic.name}
                    </label>
                  </>
                )}
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
