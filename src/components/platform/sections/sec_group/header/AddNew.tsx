/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import styles from "./header.module.scss";
import cover from "@/../public/ZPLATFORM/groups/cover.png";
// import ImageUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
import { useForm } from "react-hook-form";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { postRequest } from "@/Utils/backendEndpoints/backend-requests";
import Image from "next/image";
// import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";

function AddNew() {
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const handleImagesSelected = (files: File[]) => {
  //   setSelectedFiles((prev) => [...prev, ...files]);

  //   // In a real application, you would typically upload these files to your server
  //   console.log("Files selected:", files);
  // };
  // Form handling
  const { register, reset, handleSubmit } = useForm<any>({
    defaultValues: {
      content: "",
      // images: selectedFiles,
      creatorType: "group_user",
    },
  });

  const onSubmit = async (formData: any) => {
    try {
      postRequest("/api/groups", {
        content: formData.content,
        images: formData.images,
        creatorType: "group_user",
      });

      ToastNot(`Post added successfully`);
      reset();
    } catch (err) {
      console.log(err);
      ToastNot("error occurred while adding post");
    }
  };

  return (
    <>
      <form className={styles.groupForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.contentBar}>
          <Image
            src={cover}
            alt={"member"}
            width={50}
            height={50}
            className={styles.userAvatar}
          />
          <input
            className={styles.contentInput}
            type="text"
            placeholder="Write something..."
            {...register("content", { required: true })}
          />
        </div>
        <div className={styles.postActions}>
          {/* <FileUpload
            onImagesSelected={handleImagesSelected}
            maxImages={4}
            maxSizeInMB={2}
          /> */}
          <button type="submit" className={styles.postButton}>
            Post
          </button>
        </div>
      </form>
    </>
  );
}

export default AddNew;
