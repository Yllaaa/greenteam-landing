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
import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
import { useTranslations } from "next-intl";
function AddNewModal(props: {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  addNew: boolean;
  challengeId: string;
  endpoint: string;
}) {
  const params = useParams();
  console.log(params);

  const accessToken = useAppSelector((state) => state.login.accessToken);
  const { setAddNew , endpoint} = props;
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
    // Create FormData object
    const formDataToSend = new FormData();

    // Append text fields
    formDataToSend.append("content", formData.content);

    // Append each image file
    if (fileType === "image") {
      selectedFiles.forEach((file) => {
        formDataToSend.append(`images`, file);
      });
    } else if (fileType === "pdf" && selectedFiles.length > 0) {
      formDataToSend.append("document", selectedFiles[0]);
    }

    try {
      // Fix: Don't convert formDataToSend to a new FormData object
      // The correct usage is to just pass formDataToSend directly

      const response = await axios.post(
        endpoint,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response) {
        ToastNot(`Post added successfully`);
        reset();
        setAddNew(false);
      }
    } catch (err) {
      console.log(err);
      ToastNot("Error occurred while adding post");
    }
  };
const t = useTranslations("web.subHeader.green");
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
              {t("build")}
            </h2>
            {/* Text Area */}
            <textarea
              placeholder="Add your experiences and tips to make a better future."
              className={styles.textArea}
              {...register("content", { required: true })}
            />
            <div className={styles.buttons}>
              {/*  */}
              <FileUpload
                onFilesSelected={handleFilesSelected}
                maxImages={4}
                maxSizeInMB={2}
              />
              {/* Submit Button */}
              <input type="submit" className={styles.submit} value={t("post")} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddNewModal;
