/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import styles from "./AddNewModal.module.css";
import { useForm } from "react-hook-form";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import preventBackgroundScroll from "@/hooks/preventScroll/preventBackroundScroll";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import plusIcon from "@/../public/ZPLATFORM/madal/plusIcon.svg";
import Image from "next/image";
import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
import { Topics } from "@/components/Assets/topics/Topics.data";
function AddNewModal(props: {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  addNew: boolean;
  slug: string | string[] | undefined;
}) {
  const topic = useAppSelector((state) => state.pageState.topic);
  const allMainTopics = Topics;
  const topicDetails =
    topic.id !== 0 && allMainTopics.find((item) => item.id === topic.id);

  const accessToken = useAppSelector((state) => state.login.accessToken);
  const { setAddNew, slug } = props;
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

  // const [fileType, setFileType] = useState<"image" | "pdf">("image");

  const handleFilesSelected = (files: File[], type: "image" | "pdf") => {
    setSelectedFiles((prev) => [...prev, ...files]);
    // setFileType(type);
    setValue("fileType", type);
  };
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[] | any>(
    []
  );

  const handleSubtopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    let updatedSubtopics = [...selectedSubtopics];

    if (checked) {
      updatedSubtopics.push(value);
    } else {
      updatedSubtopics = updatedSubtopics.filter((id) => id !== value);
    }

    setSelectedSubtopics(updatedSubtopics);
    setValue("subtopicIds", updatedSubtopics);
  };

  const onSubmit = async (formData: any) => {
    // Create FormData object
    const formDataToSend = new FormData();

    // Append text fields
    formDataToSend.append("content", formData.content);
    const intSubtopics = selectedSubtopics.map((id: string) => parseInt(id));
    intSubtopics.forEach((id: number) => {
      formDataToSend.append("subtopicIds[]", id.toString());
    });
    formDataToSend.append("creatorType", "page");

    // Append each image file

    selectedFiles.forEach((file) => {
      formDataToSend.append(`images`, file);
    });

    try {

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${slug}/posts/publish-post`,
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
              <div className={styles.fileUpload}>
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  maxImages={4}
                  maxSizeInMB={2}
                  selectAll={false}
                />
              </div>
              {topicDetails && (
                <div className={styles.selectSubCategory}>
                  {topicDetails &&
                  topicDetails.subtopics &&
                  topicDetails?.subtopics?.length > 0 ? (
                    topicDetails?.subtopics?.map((subtopic) => (
                      <label
                        style={
                          selectedSubtopics.includes(`${subtopic.id}`)
                            ? { backgroundColor: "green" }
                            : {}
                        }
                        key={subtopic.id}
                        className={styles.checkboxLabel}
                      >
                        <input
                          type="checkbox"
                          value={`${subtopic.id}`}
                          checked={selectedSubtopics.includes(`${subtopic.id}`)}
                          onChange={handleSubtopicChange}
                        />
                        {subtopic.name}
                      </label>
                    ))
                  ) : (
                    <p className={styles.noSubtopics}>
                      No subtopics available for this topic.
                    </p>
                  )}
                </div>
              )}
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
