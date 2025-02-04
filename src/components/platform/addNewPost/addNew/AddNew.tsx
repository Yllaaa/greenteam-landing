/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import styles from "./AddNew.module.css";
import { useForm } from "react-hook-form";
import addIcon from "@/../public/forum/add.svg";
import Image from "next/image";

function AddNew() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = React.useState<any>({});
  const onSubmit = (data: any) => {
    console.log(data);
    // You can send the data to your server here
    setData(data);
  };

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
            <Image src={addIcon} alt="addIcon" /> <span>Add New Post</span>
          </h2>
        </div>
        <div className={styles.forumBody}>
          <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
            <textarea
              placeholder="Add your experiencies and tips to make a better future."
              className={styles.textArea}
              {...register("Post", { required: true })}
            />
            <div className={styles.addAndCategory}>
              {/* insert image */}
              <div style={{ cursor: "pointer" }} className={styles.insertImage}>
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
              </div>
              {/* main Cat. */}
              <div className={styles.selectCategory}>
                <select
                  {...register("addCatecory", { required: true })}
                  onChange={handleCategoryChange}
                >
                  <option disabled selected value="null">
                    -Select
                  </option>
                  <option value="sub1">sub1 sub1</option>
                  <option value="sub2">sub2 sub2</option>
                  <option value="sub3">sub3 sub3</option>
                </select>
              </div>
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
          </form>
        </div>
      </div>
    </>
  );
}

export default AddNew;
