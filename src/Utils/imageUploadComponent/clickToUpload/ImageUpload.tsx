import React, { useState, useRef, ChangeEvent } from "react";
import styles from "./ImageUpload.module.css";
import Image from "next/image";
import imageIcon from "@/../public/ZPLATFORM/madal/imageIcon.svg";

// Define the types for our component
interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
  uploading: boolean;
  type: "image" | "pdf";
}

interface ImageUploadProps {
  onFilesSelected: (files: File[], type: "image" | "pdf") => void;
  maxImages?: number;
  maxSizeInMB?: number;
  selectAll?: boolean;
}

const FileUpload: React.FC<ImageUploadProps> = ({
  onFilesSelected,
  maxImages = 4,
  maxSizeInMB = 10,
  selectAll = true,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to bytes
  const [uploadMode, setUploadMode] = useState<"image" | "pdf" | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Determine the type of the first file
    const firstFileType = selectAll
      ? selectedFiles[0].type.startsWith("image/")
        ? "image"
        : selectedFiles[0].type === "application/pdf"
          ? "pdf"
          : null
      : "image";

    // If type is not supported or mixed types, show error
    if (!firstFileType) {
      alert("Unsupported file type. Please upload images or a PDF document.");
      return;
    }

    // Check if all files are of the same type
    const hasInvalidType = selectedFiles.some((file) => {
      if (firstFileType === "image") {
        return !file.type.startsWith("image/");
      } else {
        return file.type !== "application/pdf";
      }
    });

    if (hasInvalidType) {
      alert("Please upload only images or only a PDF document, not both.");
      return;
    }

    // If we already have files uploaded and trying to upload a different type
    if (files.length > 0 && files[0].type !== firstFileType) {
      alert(
        `You already have ${files[0].type === "image" ? "images" : "a PDF"
        } uploaded. Please remove them first.`
      );
      return;
    }

    // Set the upload mode if it's the first upload
    if (uploadMode === null) {
      setUploadMode(firstFileType);
    }

    // Apply validation rules based on file type
    if (firstFileType === "image") {
      if (files.length + selectedFiles.length > maxImages) {
        alert(`You can only upload a maximum of ${maxImages} images.`);
        return;
      }
    } else if (firstFileType === "pdf") {
      if (files.length + selectedFiles.length > 1) {
        alert("You can only upload 1 PDF document.");
        return;
      }
    }

    const newFiles: UploadedFile[] = [];
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
      const id = `file-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // For images, create a preview; for PDFs, use a placeholder or icon
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "/pdf-icon.svg"; // You'll need to add a PDF icon to your project

      newFiles.push({
        id,
        file,
        preview,
        progress: 0,
        uploading: true,
        type: firstFileType,
      });

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload process for each file
      newFiles.forEach((file) => {
        simulateUpload(file.id);
      });

      onFilesSelected(validFiles, firstFileType);
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

        setFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, progress, uploading: false } : file
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((file) => (file.id === id ? { ...file, progress } : file))
        );
      }
    }, 300);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== id);

      // If no files left, reset upload mode
      if (updatedFiles.length === 0) {
        setUploadMode(null);
      }

      // Release object URL to avoid memory leaks
      const fileToRemove = prev.find((file) => file.id === id);
      if (fileToRemove && fileToRemove.type === "image") {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      return updatedFiles;
    });
  };

  const getUploadLabel = () => {
    if (uploadMode === null || uploadMode === "image") {
      return `Add media (${files.length} of ${maxImages} images)`;
    } else {
      return `Add PDF document (${files.length} of 1)`;
    }
  };

  return (
    <div className={styles.imageUploadContainer}>
      <div className={styles.uploadArea}>
        {((uploadMode === "image" && files.length < maxImages) ||
          (uploadMode === "pdf" && files.length < 1) ||
          uploadMode === null) && (
            <>
              <input
                type="file"
                accept={
                  uploadMode === "pdf"
                    ? "application/pdf"
                    : uploadMode === "image"
                      ? "image/*"
                      : "image/*,application/pdf"
                }
                multiple={uploadMode !== "pdf"}
                onChange={handleFileChange}
                ref={fileInputRef}
                className={styles.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" className={styles.uploadButton}>
                <Image src={imageIcon} alt={"icon"} />
                <div>
                  <p className={styles.uploadLabel}>
                    {uploadMode === null ? "Add images or PDF" : getUploadLabel()}
                  </p>
                  <div className={styles.uploadInfo}>
                    {uploadMode === null ? (
                      <>
                        Max {maxImages} images or 1 PDF, {maxSizeInMB}MB each
                      </>
                    ) : uploadMode === "image" ? (
                      <>
                        Max {maxImages} images, {maxSizeInMB}MB each
                      </>
                    ) : (
                      <>1 PDF document, max {maxSizeInMB}MB</>
                    )}
                  </div>
                </div>
              </label>
            </>
          )}

        <div className={styles.imagesPreview}>
          {files.map((file) => (
            <div key={file.id} className={styles.imageContainer}>
              {file.type === "image" ? (
                <Image
                  src={file.preview}
                  alt="Preview"
                  className={styles.imagePreview}
                  width={30}
                  height={30}
                />
              ) : (
                <div className={styles.pdfPreview}>
                  <span className={styles.pdfIcon}>PDF</span>
                  <span className={styles.pdfName}>{file.file.name}</span>
                </div>
              )}

              {file.uploading ? (
                <div className={styles.progressOverlay}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <div className={styles.progressText}>{file.progress}%</div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeFile(file.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.uploadStatus}>
        {files.length > 0 ? (
          <div className={styles.imagesCount}>
            {files[0].type === "image"
              ? `${files.length} of ${maxImages} images added`
              : "PDF document added"}
          </div>
        ) : (
          <div className={styles.imagesCount}>No files added</div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
