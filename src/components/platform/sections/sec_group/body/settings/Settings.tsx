import React, { useEffect, useRef, useState } from "react";
import styles from "./settings.module.scss";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { setGroupEdit } from "@/store/features/groupState/editGroupSettings";

interface FormData {
  name: string;
  description: string;
  banner: File | null;
}

function Settings() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.login.accessToken);
  const groupId = useAppSelector((state) => state.groupState.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const { register, handleSubmit, setValue, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      banner: null,
    },
  });

  // Updated image upload state and refs
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [bannerChanged, setBannerChanged] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Handle closing settings
  const handleCancel = () => {
    dispatch(setGroupEdit(false));
  };

  // Handle image selection - updated to handle the file properly
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  // Process the selected file (either from input or drag)
  const processSelectedFile = (file: File) => {
    // Set the file in the form
    setValue("banner", file);
    setBannerChanged(true);

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Modified to prevent event bubbling issues
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the parent onClick
    setValue("banner", null);
    setBannerChanged(true);

    // Clean up the object URL if it exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);

    // Clear the input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if it's an image file
      if (file.type.startsWith("image/")) {
        processSelectedFile(file);
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!groupId || !accessToken) return;
    setIsSubmitting(true);

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();

      // Only append values that exist (not empty strings)
      // This is the key change - checking if values exist

      // Handle banner upload (either file or removal)
      if (data.banner) {
        formData.append("banner", data.banner);
      } else if (bannerChanged) {
        // If banner was explicitly removed, send an empty string
        formData.append("banner", "");
      }

      // Only append name if it's not empty
      if (data.name.trim()) {
        formData.append("name", data.name);
      }

      // Only append description if it's not empty
      if (data.description.trim()) {
        formData.append("description", data.description);
      }

      // Check if we have any data to submit
      const hasDataToSubmit =
        formData.has("banner") ||
        formData.has("name") ||
        formData.has("description");

      if (!hasDataToSubmit) {
        ToastNot("No changes to update");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/groups/${groupId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      console.log(response.data);
      ToastNot("Group updated successfully");
      reset();

      // Reset state
      setBannerChanged(false);

      // Close settings instead of reloading
      dispatch(setGroupEdit(false));

      // Reload page to see changes
      window.location.reload();
    } catch (err) {
      console.error(err);
      ToastNot("Error updating group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.side}>
          <h6>Group Settings</h6>
          <p>Manage your group settings</p>
        </div>
        {/* Cancel button */}
        <button
          type="button"
          onClick={handleCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
      <div className={styles.mainForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formName}>
            <label htmlFor="name">Group Name</label>
            <input
              type="text"
              placeholder="Enter group name (optional)"
              {...register("name")}
            />
          </div>
          <div className={styles.formDesc}>
            <label htmlFor="groupDesc">Group Description</label>
            <textarea
              placeholder="Enter group description (optional)"
              {...register("description")}
            />
          </div>
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Group Banner</label>
              <div
                ref={dropAreaRef}
                className={`${styles.imageUploadContainer} ${isDragging ? styles.dragging : ""
                  }`}
                onClick={handleImageClick}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className={styles.imagePreviewWrapper}>
                    <div
                      className={styles.imagePreview}
                      onClick={handleImageClick}
                    >
                      <Image
                        src={imagePreview}
                        alt="Group banner preview"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.removeImageButton}
                      onClick={removeImage}
                      aria-label="Remove image"
                    >
                      <X className={styles.removeIcon} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <Upload size={40} color="#74b243" strokeWidth={1.5} />
                    <p>
                      {isDragging
                        ? "Drop image here"
                        : "Click or drag image here"}
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.saveButton} ${isSubmitting ? styles.submitting : ''}`}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButtonMobile}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;