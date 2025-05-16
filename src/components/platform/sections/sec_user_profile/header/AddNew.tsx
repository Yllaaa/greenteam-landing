/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./AddNewModal.module.css";
import { useForm } from "react-hook-form";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import Image from "next/image";
import plusIcon from "@/../public/ZPLATFORM/madal/plusIcon.svg";
import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";

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

  // Form handling
  const { register, reset, handleSubmit, setValue } = useForm<any>({
    defaultValues: {
      content: "",
      images: selectedFiles,
      creatorType: "user",
    },
  });

  const [fileType, setFileType] = useState<"image" | "pdf">("image");

  const handleFilesSelected = (files: File[], type: "image" | "pdf") => {
    setSelectedFiles((prev) => [...prev, ...files]);
    setFileType(type);
    setValue("fileType", type);
  };

  const onSubmit = async (formData: any) => {
    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("content", formData.content);

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

      // Call onPostComplete if provided
      if (onPostComplete) {
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