import React, { useEffect, useRef, useState } from "react";
import styles from "./settings.module.scss";
import Image from "next/image";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

interface FormData {
  name: string;
  description: string;
  banner: File | null;
}
function Settings() {
  const accessToken = useAppSelector((state) => state.login.accessToken);
  const groupId = useAppSelector((state) => state.groupState.id);
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

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

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    
    // check if dates are valid
    if (!groupId || !accessToken) return;
    try {
      // send data to server
      const formData = new FormData();
      formData.append("banner", data.banner || "");
      formData.append("name", data.name);
      formData.append("description", data.description);

      axios
        .put(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/groups/${groupId}`,
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
          <h6>Group Settings</h6>
          <p>Manage your group settings</p>
        </div>
        <div className={styles.mainForm}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formName}>
              <label htmlFor="name">Group Name</label>
              <input
                type="text"
                placeholder="Enter group name"
                {...register("name")}
              />
            </div>
            <div className={styles.formDesc}>
              <label htmlFor="groupDesc">Group Description</label>
              <textarea
                placeholder="Enter group descripton"
                {...register("description")}
              />
            </div>
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Group Banner</label>
                <div
                  ref={dropAreaRef}
                  className={`${styles.imageUploadContainer} ${
                    isDragging ? styles.dragging : ""
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
                        onClick={handleImageClick} // Add onClick handler here
                      >
                        <Image
                          src={imagePreview}
                          alt="Event preview"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.removeImageButton}
                        onClick={removeImage}
                      >
                        <X className={styles.removeIcon} />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <p>
                        {isDragging
                          ? "Drop image here"
                          : "Click or drag image here"}
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef} // Add the ref here
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleImageChange}
                    style={{ display: "none" }} // Hide the actual input
                  />
                </div>
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Settings;
