/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import styles from "./AddNewModal.module.css";
import { useForm } from "react-hook-form";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import preventBackgroundScroll from "@/hooks/preventScroll/preventBackroundScroll";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { useParams } from "next/navigation";
import plusIcon from "@/../public/ZPLATFORM/madal/plusIcon.svg";
import Image from "next/image";
import ImageUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
function AddNewModal(props: {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  addNew: boolean;
  challengeId: string;
}) {
  const params = useParams();
  console.log(params);

  const accessToken = useAppSelector((state) => state.login.accessToken);
  const { setAddNew, challengeId } = props;
  const closeModal = useCallback(() => {
    setAddNew(false);
  }, [setAddNew]);

  const modalRef = useOutsideClick(closeModal);

  useEffect(() => {
    preventBackgroundScroll(true);

    return () => {
      preventBackgroundScroll(false);
    };
  }, []);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const handleImagesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);

    // In a real application, you would typically upload these files to your server
    console.log("Files selected:", files);
  };
  // Form handling
  const { register, reset, handleSubmit } = useForm<any>({
    defaultValues: {
      content: "",
      images: selectedFiles,
      creatorType: "user",
    },
  });

  const onSubmit = async (formData: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/green-challenges/${challengeId}/done-with-post`,
        {
          content: formData.content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response) {
        ToastNot(`Post added successfully`);
        reset();
        setAddNew(false);
      }

      ToastNot(`Post added successfully`);
      reset();
    } catch (err) {
      console.log(err);
      ToastNot("error occurred while adding post");
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontent}>
          <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.title}>
              <Image
                src={plusIcon}
                alt="plusIcon"
                loading="lazy"
                width={20}
                height={20}
              />
              Talk about these challenge
            </h2>
            {/* Text Area */}
            <textarea
              placeholder="Add your experiences and tips to make a better future."
              className={styles.textArea}
              {...register("content", { required: true })}
            />
            <div className={styles.buttons}>
              {/*  */}
              <ImageUpload
                onImagesSelected={handleImagesSelected}
                maxImages={4}
                maxSizeInMB={2}
              />
              {/* Submit Button */}
              <input type="submit" className={styles.submit} value="Post" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddNewModal;
