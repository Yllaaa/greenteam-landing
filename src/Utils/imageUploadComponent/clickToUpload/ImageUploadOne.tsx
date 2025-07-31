import React, { useState, useRef, ChangeEvent } from "react";
import styles from "./ImageUpload.module.css";
import Image from "next/image";
import imageIcon from "@/../public/ZPLATFORM/madal/imageIcon.svg";

// Define the types for our component
interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
  uploading: boolean;
}

interface ImageUploadOneProps {
  onImageSelected: (file: File | null) => void;
  maxSizeInMB?: number;
  buttonLabel?: string;
  infoText?: string;
}

const ImageUploadOne: React.FC<ImageUploadOneProps> = ({
  onImageSelected,
  maxSizeInMB = 10,
  buttonLabel = "Add profile image",
  infoText = "JPEG, PNG or GIF, max 10MB",
}) => {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file is an image
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, GIF, etc.)");
      return;
    }

    // Check file size
    if (selectedFile.size > maxSizeInBytes) {
      alert(`Image exceeds the maximum size of ${maxSizeInMB}MB.`);
      return;
    }

    // Create a unique ID and preview URL
    const id = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const preview = URL.createObjectURL(selectedFile);

    // Create the image object
    const newImage: UploadedImage = {
      id,
      file: selectedFile,
      preview,
      progress: 0,
      uploading: true,
    };

    // If there's an existing image, revoke its object URL
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }

    // Update state
    setImage(newImage);
    
    // Simulate upload
    simulateUpload(id);
    
    // Notify parent component
    onImageSelected(selectedFile);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to simulate upload progress
  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setImage((prev) =>
          prev && prev.id === id ? { ...prev, progress, uploading: false } : prev
        );
      } else {
        setImage((prev) =>
          prev && prev.id === id ? { ...prev, progress } : prev
        );
      }
    }, 300);
  };

  const removeImage = () => {
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    onImageSelected(null);
  };

  return (
    <div className={styles.imageUploadContainer}>
      <div className={styles.uploadArea}>
        {!image ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className={styles.fileInput}
              id="single-image-upload"
            />
            <label htmlFor="single-image-upload" className={styles.uploadButton}>
              <Image src={imageIcon} alt="Upload icon" />
              <div>
                {buttonLabel}
                <div className={styles.uploadInfo}>{infoText}</div>
              </div>
            </label>
          </>
        ) : (
          <div className={styles.singleImagePreview}>
            <div className={styles.imageContainer}>
              <Image
                src={image.preview}
                alt="Image preview"
                className={styles.imagePreview}
                width={80}
                height={80}
              />

              {image.uploading ? (
                <div className={styles.progressOverlay}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${image.progress}%` }}
                    />
                  </div>
                  <div className={styles.progressText}>{image.progress}%</div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={removeImage}
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Option to change the image */}
            <div className={styles.changeImageContainer}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className={styles.fileInput}
                id="change-single-image"
              />
              <label 
                htmlFor="change-single-image" 
                className={styles.changeImageButton}
              >
                Change image
              </label>
            </div>
          </div>
        )}
      </div>

      <div className={styles.uploadStatus}>
        {image ? (
          <div className={styles.imagesCount}>
            Image uploaded: {image.file.name}
          </div>
        ) : (
          <div className={styles.imagesCount}>No image uploaded</div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadOne;