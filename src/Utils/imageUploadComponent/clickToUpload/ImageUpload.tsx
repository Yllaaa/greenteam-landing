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

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
  maxSizeInMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesSelected,
  maxImages = 4,
  maxSizeInMB = 2,
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (images.length + selectedFiles.length > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    const newImages: UploadedImage[] = [];
    const validFiles: File[] = [];

    selectedFiles.forEach((file) => {
      // Check file size
      if (file.size > maxSizeInBytes) {
        alert(
          `File "${file.name}" exceeds the maximum size of ${maxSizeInMB}MB.`
        );
        return;
      }

      // Create a preview URL
      const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const preview = URL.createObjectURL(file);

      newImages.push({
        id,
        file,
        preview,
        progress: 0,
        uploading: true,
      });

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...newImages]);

      // Simulate upload process for each file
      newImages.forEach((img) => {
        simulateUpload(img.id);
      });

      onImagesSelected(validFiles);
    }

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

        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, progress, uploading: false } : img
          )
        );
      } else {
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, progress } : img))
        );
      }
    }, 300);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updatedImages = prev.filter((img) => img.id !== id);

      // Release object URL to avoid memory leaks
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return updatedImages;
    });
  };

  return (
    <div className={styles.imageUploadContainer}>
      <div className={styles.uploadArea}>
        {images.length < maxImages && (
          <>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className={styles.fileInput}
              id="image-upload"
            />
            <label htmlFor="image-upload" className={styles.uploadButton}>
              <Image src={imageIcon} alt={"icon"} />
              <div>
                Add media
                <div className={styles.uploadInfo}>
                  Max {maxImages} images, {maxSizeInMB}MB each
                </div>
              </div>
            </label>
          </>
        )}

        <div className={styles.imagesPreview}>
          {images.map((img) => (
            <div key={img.id} className={styles.imageContainer}>
              <Image
                src={img.preview}
                alt="Preview"
                className={styles.imagePreview}
                width={30}
                height={30}
              />

              {img.uploading ? (
                <div className={styles.progressOverlay}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${img.progress}%` }}
                    />
                  </div>
                  <div className={styles.progressText}>{img.progress}%</div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeImage(img.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.uploadStatus}>
        {images.length > 0 ? (
          <div className={styles.imagesCount}>
            {images.length} of {maxImages} images added
          </div>
        ) : (
          <div className={styles.imagesCount}>No images added</div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
