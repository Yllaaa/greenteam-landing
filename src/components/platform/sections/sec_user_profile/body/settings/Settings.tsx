import React, { useEffect, useRef, useState } from "react";
import styles from "./settings.module.scss";
import Image from "next/image";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

interface FormData {
  fullName: string;
  bio: string;
  avatar: File | null;
  cover: File | null;
}

function Settings(props: { setSettings: React.Dispatch<React.SetStateAction<boolean>> }) {
  const accessToken = useAppSelector((state) => state.login.accessToken);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  // React Hook Form setup
  const { register, handleSubmit, setValue, reset } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      bio: "",
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

  // Handle cancel
  const handleCancel = () => {
    props.setSettings(false);
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);

    if (!accessToken) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (data.cover) formData.append("cover", data.cover);
      if (data.avatar) formData.append("avatar", data.avatar);
      formData.append("fullName", data.fullName);
      formData.append("bio", data.bio);

      axios
        .put(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/profile`,
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
          ToastNot("Profile updated successfully");
          reset();
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          ToastNot("Error updating profile");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.side}>
            <h6>Profile Settings</h6>

            <p>Manage your profile</p>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className={styles.mainForm}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Avatar</label>
                <div
                  className={`${styles.avatarUploadContainer} ${isDraggingAvatar ? styles.dragging : ""
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
                  className={`${styles.imageUploadContainer} ${isDraggingCover ? styles.dragging : ""
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
            <div className={styles.formName}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
              />
            </div>
            <div className={styles.formDesc}>
              <label htmlFor="bio">Bio</label>
              <textarea
                placeholder="Tell us about yourself"
                {...register("bio")}
              />
            </div>
            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Settings;