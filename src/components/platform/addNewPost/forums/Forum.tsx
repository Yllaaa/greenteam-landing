/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./Forum.module.css";
import { useForm } from "react-hook-form";
import dicusionIcon from "@/../public/forum/discution.svg";
import Image from "next/image";
import defaultAvatar from "@/../public/auth/user.png";
import axios from "axios";

function Forums() {
  const [topics, setTopics] = useState<any>([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/topics`)
      .then((res) => {
        setTopics(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const userInfo1 = localStorage.getItem("user");
  const userInfo = userInfo1 ? JSON.parse(userInfo1) : null;

  const { register, handleSubmit } = useForm();
  const [data, setData] = React.useState<any>({});
  const onSubmit = (data: any) => {
    // You can send the data to your server here
    setData(data);
  };
console.log(data);

  // Subcategories selection
  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  const handleOptionChange = (event: any) => {
    const { value, checked } = event.target;
    if (checked) {
      // Add the option to the selected options
      setSelectedOptions([...selectedOptions, value]);
    } else {
      // Remove the option from the selected options
      setSelectedOptions(
        selectedOptions.filter((option: any) => option !== value)
      );
    }
  };

  // Reset selected options when subcategory changes
  const handleCategoryChange = (event: any) => {
    const selectedSubcategory = event.target.value;
    setData({ ...data, addCatecory: selectedSubcategory });
    setSelectedOptions([]); // Clear selected options
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            <Image src={dicusionIcon} alt="addIcon" /> <span>Start Forum</span>
          </h2>
        </div>
        <div className={styles.forumBody}>
          <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.boxContainer}>
              <div className={styles.userAvatar}>
                {userInfo.avatar ? (
                  <Image
                    src={userInfo?.avatar}
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
                placeholder="Add your experiencies and tips to make a better future."
                className={styles.textArea}
                {...register("Post", { required: true })}
              />
            </div>
            <div className={styles.addAndCategory}>
              {/* main Cat. */}
              <div className={styles.selectCategory}>
                <select
                  {...register("addCatecory", { required: true })}
                  onChange={handleCategoryChange}
                >
                  <option disabled selected value="null">
                    -Select
                  </option>
                  {topics?.map((topic: any) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>

                {/* sub Cat. */}
                <div className={styles.selectSubCategory}>
                  {data?.addCatecory && (
                    <>
                      <label>
                        <input
                          type="checkbox"
                          name="option"
                          value="option1"
                          checked={selectedOptions.includes("option1")}
                          onChange={handleOptionChange}
                        />{" "}
                        Option 1
                      </label>

                      {/* Option 2 */}
                      <label>
                        <input
                          type="checkbox"
                          name="option"
                          value="option2"
                          checked={selectedOptions.includes("option2")}
                          onChange={handleOptionChange}
                        />{" "}
                        Option 2
                      </label>

                      {/* Option 3 */}
                      <label>
                        <input
                          type="checkbox"
                          name="option"
                          value="option3"
                          checked={selectedOptions.includes("option3")}
                          onChange={handleOptionChange}
                        />{" "}
                        Option 3
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
    </>
  );
}

export default Forums;
