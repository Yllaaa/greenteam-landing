import React, { useEffect, useRef, useState } from "react";
import styles from "./settings.module.scss";
import Image from "next/image";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { Topics } from "@/components/Assets/topics/Topics.data";

interface FormData {
  name: string;
  description: string;

  what: string;
  why: string;
  how: string;
  topicId: string;
  category: string;
  avatar: File | null;
  cover: File | null;
}

function Settings(props: { slug: string }) {
  const { slug } = props;
  const accessToken = useAppSelector((state) => state.login.accessToken);
  const topics = Topics;
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",

      what: "",
      why: "",
      how: "",
      topicId: "",
      category: "",

      avatar: null,
      cover: null,
    },
  });

  // Separate state for avatar and cover previews
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Separate drag states for both upload areas
  const [isDraggingCover, setIsDraggingCover] = useState<boolean>(false);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState<boolean>(false);

  // Separate refs for both file inputs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Handle cover image selection
  const handleImageCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      processSelectedCover(file);
    }
  };

  // Handle avatar image selection
  const handleImageAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      processSelectedAvatar(file);
    }
  };

  // Process the selected cover file
  const processSelectedCover = (file: File) => {
    setValue("cover", file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
  };

  // Process the selected avatar file
  const processSelectedAvatar = (file: File) => {
    setValue("avatar", file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [coverPreview, avatarPreview]);

  // Cover image click handler
  const handleCoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  // Avatar image click handler
  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  // Remove cover image
  const removeCoverImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("cover", null);

    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverPreview(null);

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  // Remove avatar image
  const removeAvatarImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("avatar", null);

    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarPreview(null);

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  // Cover drag and drop handlers
  const handleCoverDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(true);
  };

  const handleCoverDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);
  };

  const handleCoverDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingCover) {
      setIsDraggingCover(true);
    }
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        processSelectedCover(file);
      }
    }
  };

  // Avatar drag and drop handlers
  const handleAvatarDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAvatar(true);
  };

  const handleAvatarDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAvatar(false);
  };

  const handleAvatarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingAvatar) {
      setIsDraggingAvatar(true);
    }
  };

  const handleAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAvatar(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        processSelectedAvatar(file);
      }
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);

    if (!accessToken) return;

    try {
      const formData = new FormData();
      if (data.cover) formData.append("cover", data.cover);
      if (data.avatar) formData.append("avatar", data.avatar);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("what", data.what);
      formData.append("why", data.why);
      formData.append("how", data.how);
      formData.append("topicId", data.topicId);
      formData.append("category", data.category);

      axios
        .put(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${slug}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          ToastNot("Group updated successfully");
          reset();
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          ToastNot("Error updating group");
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.side}>
          <h6>Profile Settings</h6>
          <p>Manage your profile</p>
        </div>
        <div className={styles.mainForm}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Avatar</label>
                <div
                  className={`${styles.avatarUploadContainer} ${
                    isDraggingAvatar ? styles.dragging : ""
                  }`}
                  onClick={handleAvatarClick}
                  onDragEnter={handleAvatarDragEnter}
                  onDragOver={handleAvatarDragOver}
                  onDragLeave={handleAvatarDragLeave}
                  onDrop={handleAvatarDrop}
                >
                  {avatarPreview ? (
                    <div className={styles.imagePreviewWrapper}>
                      <div
                        className={styles.imagePreview}
                        onClick={handleAvatarClick}
                      >
                        <Image
                          src={avatarPreview}
                          alt="Banner preview"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.removeImageButton}
                        onClick={removeAvatarImage}
                      >
                        <X className={styles.removeIcon} />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <p>
                        {isDraggingAvatar
                          ? "Drop banner image here"
                          : "Click or drag banner image here"}
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleImageAvatar}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cover</label>
                <div
                  className={`${styles.imageUploadContainer} ${
                    isDraggingCover ? styles.dragging : ""
                  }`}
                  onClick={handleCoverClick}
                  onDragEnter={handleCoverDragEnter}
                  onDragOver={handleCoverDragOver}
                  onDragLeave={handleCoverDragLeave}
                  onDrop={handleCoverDrop}
                >
                  {coverPreview ? (
                    <div className={styles.imagePreviewWrapper}>
                      <div
                        className={styles.imagePreview}
                        onClick={handleCoverClick}
                      >
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.removeImageButton}
                        onClick={removeCoverImage}
                      >
                        <X className={styles.removeIcon} />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <p>
                        {isDraggingCover
                          ? "Drop cover image here"
                          : "Click or drag cover image here"}
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleImageCover}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>
            {/* ,,,,,,,,,,,,,,,,,,,,, */}
            <div className={styles.formName}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Enter page name"
                {...register("name")}
              />
            </div>
            {/* /////////////////// */}
            {/* ,,,,,,,,,,,,,,,,,,,,, */}
            <div className={styles.formDesc}>
              <label htmlFor="groupDesc">Description</label>
              <textarea
                placeholder="Enter group descripton"
                {...register("description")}
              />
            </div>
            {/* /////////////////// */}
            {/* ,,,,,,,,,,,,,,,,,,,,, */}
            <div className={styles.formName}>
              <label htmlFor="name">Why</label>
              <input type="text" placeholder="Why" {...register("why")} />
            </div>
            {/* /////////////////// */}
            {/* ,,,,,,,,,,,,,,,,,,,,, */}
            <div className={styles.formName}>
              <label htmlFor="name">What</label>
              <input type="text" placeholder="What" {...register("what")} />
            </div>
            {/* /////////////////// */}
            {/* ,,,,,,,,,,,,,,,,,,,,, */}
            <div className={styles.formName}>
              <label htmlFor="name">How</label>
              <input type="text" placeholder="How" {...register("how")} />
            </div>
            {/* /////////////////// */}
            <div className={styles.formName}>
              <label className={styles.label}>Topic</label>
              <select
                className={`${styles.select} ${
                  errors.topicId ? styles.inputError : ""
                }`}
                {...register("topicId", { required: "Topic is required" })}
              >
                <option value="" disabled>
                  Select Topic
                </option>
                {topics.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.topicId && (
                <p className={styles.errorText}>{errors.topicId.message}</p>
              )}
            </div>
            {/* ///////////// */}
            <div className={styles.formName}>
              <label className={styles.label}>Category</label>
              <select
                className={`${styles.select} ${
                  errors.topicId ? styles.inputError : ""
                }`}
                {...register("category", { required: "Topic is required" })}
              >
                <option value="" disabled>
                  Select Topic
                </option>
                {["Project", "Business"].map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className={styles.errorText}>{errors.category.message}</p>
              )}
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Settings;
