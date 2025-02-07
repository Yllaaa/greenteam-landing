"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddNew.module.css";
import { useForm } from "react-hook-form";
import addIcon from "@/../public/forum/add.svg";
import Image from "next/image";
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
function AddNew() {
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
  const {
    register,

    reset,
    handleSubmit,
    setValue,
    getValues,
  } = useForm<PostType>({
    defaultValues: {
      content: "",
      mainTopicId: "",
      subtopicIds: [],
      creatorType: "user",
    },
  });

  const onSubmit = (formData: PostType) => {
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
        console.log("data", res.data);
        ToastNot(`Post in ${res.data.mainTopic.name} added successfully`);
      })
      .catch((err) => {
        console.log(err);
        ToastNot(err.response.data.message);
      });
    reset();
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
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            <Image src={addIcon} alt="addIcon" /> <span>Add New Post</span>
          </h2>
        </div>
        <div className={styles.forumBody}>
          <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
            <textarea
              placeholder="Add your experiencies and tips to make a better future."
              className={styles.textArea}
              {...register("content", { required: true })}
            />
            <div className={styles.addAndCategory}>
              {/* insert image */}

              {/* <div style={{ cursor: "pointer" }} className={styles.insertImage}>
                <div className={styles.imageButton}>
                  <button>Add Media</button>
                </div>
                <div className={styles.imageFunc}>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: true })}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        console.log(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div> */}

              {/* main Cat. */}
              <div className={styles.selectCategory}>
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
              </div>
              {/* sub Cat. */}
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
          </form>
        </div>
      </div>
    </>
  );
}

export default AddNew;
