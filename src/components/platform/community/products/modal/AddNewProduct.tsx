"use client";
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import styles from "./AddNewProduct.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { preventBackgroundScroll } from "@/hooks/preventScroll/preventBackroundScroll";
import addlogo from "@/../public/ZPLATFORM/event/addLogo.svg";
import Image from "next/image";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { Topics } from "@/components/Assets/topics/Topics.data";
import { postPageProduct } from "../functions/productsService";
import { useParams } from "next/navigation";

// Define types
interface FormData {
  name: string;
  description: string;
  price: number;
  topicId: string | number;
  marketType: string;
  images: File[];
}

interface ImagePreview {
  id: string; // Added unique ID for each image
  url: string;
  file: File;
}

type AddProductProps = {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  userType: string;
};

const AddNewProduct = ({ setAddNew }: AddProductProps) => {
  const params = useParams();
  const slug = params?.pageId;
  const MAX_IMAGES = 4;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    topicId: "",
    marketType: "",
    images: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useOutsideClick(() => setAddNew(false));

  // Handle modal effects
  useEffect(() => {
    preventBackgroundScroll(true);
    return () => {
      // Clean up object URLs to prevent memory leaks
      imagePreviews.forEach((preview) => {
        if (preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url);
        }
      });
      preventBackgroundScroll(false);
    };
  }, [imagePreviews]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    else if (formData.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.topicId) newErrors.topicId = "Topic is required";
    if (!formData.marketType) newErrors.marketType = "Market type is required";
    if (!formData.images.length)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const passedFormData = new FormData();
      passedFormData.append("name", formData.name);
      passedFormData.append("description", formData.description);
      passedFormData.append("marketType", formData.marketType);
      passedFormData.append("price", String(formData.price));
      passedFormData.append("topicId", String(formData.topicId));

      // Append all images to the FormData
      formData.images.forEach((image) => {
        passedFormData.append("images", image);
      });

      postPageProduct(passedFormData, slug).then((res) => {
        if (res.status === 200) {
          ToastNot(res.message);
          // Reset form
          setFormData({
            name: "",
            description: "",
            price: 0,
            topicId: "",
            marketType: "",
            images: [],
          });
          setImagePreviews([]);
        } else {
          ToastNot(res.message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Image handling functions
  const processSelectedFiles = (files: File[]) => {
    const availableSlots = MAX_IMAGES - imagePreviews.length;
    const filesToProcess = files.slice(0, availableSlots);

    if (filesToProcess.length === 0) {
      ToastNot(`Maximum of ${MAX_IMAGES} images allowed`);
      return;
    }

    // Create new previews with unique IDs
    const newPreviews = filesToProcess.map((file) => ({
      id: Math.random().toString(36).substring(2, 15), // Generate unique ID
      url: URL.createObjectURL(file),
      file: file,
    }));

    // Update previews
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Update form value
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...filesToProcess],
    }));

    // Show message if some files were not processed
    if (files.length > availableSlots) {
      ToastNot(
        `Only ${availableSlots} more images allowed. ${
          files.length - availableSlots
        } images were not added.`
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (files && files.length > 0) {
      processSelectedFiles(Array.from(files));
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current && imagePreviews.length < MAX_IMAGES) {
      fileInputRef.current.click();
    } else if (imagePreviews.length >= MAX_IMAGES) {
      ToastNot(`Maximum of ${MAX_IMAGES} images allowed`);
    }
  };

  // Fixed remove image function to use IDs instead of indexes
  const removeImage = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the image to remove
    const imageToRemove = imagePreviews.find((img) => img.id === id);
    if (!imageToRemove) return;

    // Remove from previews using filter
    const newPreviews = imagePreviews.filter((img) => img.id !== id);
    setImagePreviews(newPreviews);

    // Remove from form data
    setFormData((prev) => ({
      ...prev,
      images: formData.images.filter(
        (file) =>
          // Filter by comparing to the file in the removed preview
          file !== imageToRemove.file
      ),
    }));

    // Revoke the object URL
    if (imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
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
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Filter only image files
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (imageFiles.length > 0) {
        processSelectedFiles(imageFiles);
      }
    }
  };

  const markets = [
    { id: 1, name: "local_business" },
    { id: 2, name: "value_driven_business" },
  ];

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.formContainer}>
        <div className={styles.formTitleContainer}>
          <div className={styles.titleIcon}>
            <Image src={addlogo} alt="addlogo" />
          </div>
          <div className={styles.titleText}>
            <h2 className={styles.formTitle}>List a Product for Sale</h2>
            <p className={styles.formDescription}>
              Add a product to the marketplace. Provide details to make it easy
              for customers to understand and purchase
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            {/* Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.name ? styles.inputError : ""
                }`}
              />
              {errors.name && <p className={styles.errorText}>{errors.name}</p>}
            </div>

            {/* Price */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.price ? styles.inputError : ""
                }`}
              />
              {errors.price && (
                <p className={styles.errorText}>{errors.price}</p>
              )}
            </div>
          </div>

          {/* IMAGES */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Images (Maximum 4)</label>
              <div
                className={`${styles.imageUploadContainer} ${
                  errors.images ? styles.inputError : ""
                } ${isDragging ? styles.dragging : ""}`}
                onClick={handleImageClick}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreviews.length > 0 ? (
                  <div className={styles.multipleImagePreviewWrapper}>
                    {imagePreviews.map((preview) => (
                      <div key={preview.id} className={styles.imagePreviewItem}>
                        <div className={styles.imagePreview}>
                          <Image
                            src={preview.url}
                            alt={`Product preview`}
                            style={{ objectFit: "cover" }}
                            width={100}
                            height={100}
                          />
                        </div>
                        <button
                          type="button"
                          className={styles.removeImageButton}
                          onClick={(e) => removeImage(preview.id, e)}
                        >
                          <X className={styles.removeIcon} />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < MAX_IMAGES && (
                      <div
                        className={styles.addMoreImagesPlaceholder}
                        onClick={handleImageClick}
                      >
                        <p>+ Add more images</p>
                        <p className={styles.smallText}>
                          {MAX_IMAGES - imagePreviews.length} remaining
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <p>
                      {isDragging
                        ? "Drop images here"
                        : "Click or drag images here"}
                    </p>
                    <p className={styles.smallText}>
                      Upload up to {MAX_IMAGES} images
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  className={styles.fileInput}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
              {errors.images && (
                <p className={styles.errorText}>{errors.images}</p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`${styles.textarea} ${
                errors.description ? styles.inputError : ""
              }`}
            ></textarea>
            {errors.description && (
              <p className={styles.errorText}>{errors.description}</p>
            )}
          </div>

          {/* TOPIC */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Topic</label>
            <select
              name="topicId"
              value={formData.topicId}
              onChange={handleInputChange}
              className={`${styles.select} ${
                errors.topicId ? styles.inputError : ""
              }`}
            >
              <option value="" disabled>
                Select topic
              </option>
              {Topics?.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            {errors.topicId && (
              <p className={styles.errorText}>{errors.topicId}</p>
            )}
          </div>

          {/* Market type */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Market Type</label>
            <select
              name="marketType"
              value={formData.marketType}
              onChange={handleInputChange}
              className={`${styles.select} ${
                errors.marketType ? styles.inputError : ""
              }`}
            >
              <option value="" disabled>
                Select market type
              </option>
              {markets?.map((market) => (
                <option key={market.id} value={market.name}>
                  {market.name}
                </option>
              ))}
            </select>
            {errors.marketType && (
              <p className={styles.errorText}>{errors.marketType}</p>
            )}
          </div>

          <div className={styles.submitContainer}>
            <button
              type="button"
              onClick={() => setAddNew(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProduct;
