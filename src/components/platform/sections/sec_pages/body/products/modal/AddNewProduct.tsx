"use client";
import React, { useEffect, useRef, useState } from "react";
import { X, Plus, ChevronDown, AlertCircle } from "lucide-react";
import styles from "./AddNewProduct.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { preventBackgroundScroll } from "@/hooks/preventScroll/preventBackroundScroll";
import addlogo from "@/../public/ZPLATFORM/event/addLogo.svg";
import Image from "next/image";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { Topics } from "@/components/Assets/topics/Topics.data";
import { postPageProduct } from "../functions/productsService";
import { useParams } from "next/navigation";
import { Globe, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
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
  id: string;
  url: string;
  file: File;
}

type AddProductProps = {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  userType: string;
};

const AddNewProduct = ({ setAddNew }: AddProductProps) => {
  const params = useParams();
  const slug = params && params?.pageId;
  const router = useRouter()
  const locale = useLocale()
  const MAX_IMAGES = 4;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formStep, setFormStep] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useOutsideClick(() => setAddNew(false));
  const formRef = useRef<HTMLFormElement>(null);

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
  const validateForm = (step?: number) => {
    const newErrors: Record<string, string> = {};
    const currentStep = step || formStep;

    // In the validateForm function for step 1:
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.price) newErrors.price = "Price is required";
      else if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
      if (!formData.images.length) newErrors.images = "At least one image is required";
      // if (!formData.marketType) newErrors.marketType = "Listing type is required";
    }
    else if (currentStep === 2) {
      if (!formData.description) newErrors.description = "Description is required";
      if (!formData.topicId) newErrors.topicId = "Category is required";
      if (!formData.marketType) newErrors.marketType = "Listing type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Special handling for price to ensure it's a number
    if (name === "price") {
      const numValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field if exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateForm()) {
      setFormStep(2);
      // Scroll to top of form
      if (formRef.current) {
        formRef.current.scrollTop = 0;
      }
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setFormStep(1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(2)) return;
    try {
      setIsSubmitting(true);

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

      try {
        const res = await postPageProduct(passedFormData, slug);

        // Check if response exists
        if (res && res.status === 200) {
          console.log(res.data)
          ToastNot(res.message || "Product created successfully!");
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
          setAddNew(false);
          router.push(`${locale}/feeds/products/${res.data.id}`);
        } else {
          // Handle case where response doesn't have expected structure
          ToastNot(res?.message || "Error creating product. Please try again.");
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        ToastNot("Error creating product. Please try again.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      ToastNot("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image handling functions
  const processSelectedFiles = (files: File[]) => {
    const availableSlots = MAX_IMAGES - imagePreviews.length;

    // First, filter out any files that are too large
    const validSizeFiles = Array.from(files).filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        ToastNot(`File "${file.name}" exceeds 2MB size limit and won't be uploaded`);
        return false;
      }
      return true;
    });

    if (validSizeFiles.length === 0) {
      ToastNot("All files exceed the 2MB size limit");
      return;
    }

    const filesToProcess = validSizeFiles.slice(0, availableSlots);

    if (filesToProcess.length === 0) {
      ToastNot(`Maximum of ${MAX_IMAGES} images allowed`);
      return;
    }

    const newPreviews = filesToProcess.map((file) => ({
      id: Math.random().toString(36).substring(2, 15),
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

    // Show message if some files were not processed due to count limit
    if (validSizeFiles.length > availableSlots) {
      ToastNot(
        `Only ${availableSlots} more images allowed. ${validSizeFiles.length - availableSlots
        } images were not added.`
      );
    }

    // Clear error if it exists
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
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
      images: formData.images.filter((file) => file !== imageToRemove.file)
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
    { id: 1, name: "local", display: "Local", icon: <MapPin size={18} /> },
    { id: 2, name: "online", display: "Online", icon: <Globe size={18} /> },
  ];

  // Render progress indicator
  const renderProgressIndicator = () => (
    <div className={styles.progressIndicator}>
      <div className={`${styles.progressStep} ${formStep >= 1 ? styles.activeStep : ''}`}>
        <span className={styles.stepNumber}>1</span>
        <span className={styles.stepLabel}>Basic Info</span>
      </div>
      <div className={styles.progressLine}>
        <div className={`${styles.progressLineFill} ${formStep >= 2 ? styles.activeProgress : ''}`}></div>
      </div>
      <div className={`${styles.progressStep} ${formStep >= 2 ? styles.activeStep : ''}`}>
        <span className={styles.stepNumber}>2</span>
        <span className={styles.stepLabel}>Details</span>
      </div>
    </div>
  );

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.formContainer}>
        <div className={styles.formHeader}>
          <div className={styles.formTitleContainer}>
            <div className={styles.titleIcon}>
              <Image src={addlogo} alt="Add logo" width={48} height={48} />
            </div>
            <div className={styles.titleText}>
              <h2 className={styles.formTitle}>List a Product for Sale</h2>
              <p className={styles.formDescription}>
                Add a product to the marketplace. Provide details to make it easy
                for customers to understand and purchase.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setAddNew(false)}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {renderProgressIndicator()}

        <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
          {formStep === 1 ? (
            <>
              <div className={styles.formSection}>
                {/* Name */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="product-name">
                    Product Name <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="product-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className={`${styles.input} ${errors.name ? styles.inputError : ""
                        }`}
                    />
                    {errors.name && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.name}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="product-price">
                    Price <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.priceInputContainer}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        id="product-price"
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={formData.price || ""}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className={`${styles.priceInput} ${errors.price ? styles.inputError : ""
                          }`}
                      />
                    </div>
                    {errors.price && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.price}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* IMAGES */}
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Product Images <span className={styles.requiredField}>*</span>
                    <span className={styles.labelHint}>(Maximum 4)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div
                      className={`${styles.imageUploadContainer} ${errors.images ? styles.inputError : ""
                        } ${isDragging ? styles.dragging : ""}`}
                      onClick={handleImageClick}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {imagePreviews.length > 0 ? (
                        <div className={styles.imageGrid}>
                          {imagePreviews.map((preview) => (
                            <div key={preview.id} className={styles.imagePreviewItem}>
                              <div className={styles.imagePreview}>
                                <Image
                                  src={preview.url}
                                  alt="Product preview"
                                  style={{ objectFit: "cover" }}
                                  fill
                                />
                                <button
                                  type="button"
                                  className={styles.removeImageButton}
                                  onClick={(e) => removeImage(preview.id, e)}
                                  aria-label="Remove image"
                                >
                                  <X size={16} className={styles.removeIcon} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {imagePreviews.length < MAX_IMAGES && (
                            <div
                              className={styles.addMoreImagesPlaceholder}
                              onClick={handleImageClick}
                            >
                              <Plus size={24} className={styles.addIcon} />
                              <p>Add more</p>
                              <p className={styles.smallText}>
                                {MAX_IMAGES - imagePreviews.length} remaining
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <div className={styles.uploadIconContainer}>
                            <Plus size={32} className={styles.uploadIcon} />
                          </div>
                          <p className={styles.uploadText}>
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
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.images}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.navigationButtons}>
                <button
                  type="button"
                  onClick={() => setAddNew(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={styles.nextButton}
                >
                  Next <ChevronDown className={styles.nextIcon} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.formSection}>
                {/* DESCRIPTION */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="product-description">
                    Description <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <textarea
                      id="product-description"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your product in detail..."
                      className={`${styles.textarea} ${errors.description ? styles.inputError : ""
                        }`}
                    ></textarea>
                    <div className={styles.charCount}>
                      {formData.description.length} characters
                      {formData.description.length < 10 && (
                        <span className={styles.minChars}> (min: 10)</span>
                      )}
                    </div>
                    {errors.description && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* TOPIC/CATEGORY */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="product-topic">
                    Category <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.selectWrapper}>
                      <select
                        id="product-topic"
                        name="topicId"
                        value={formData.topicId}
                        onChange={handleInputChange}
                        className={`${styles.select} ${errors.topicId ? styles.inputError : ""
                          }`}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {Topics?.map((topic) => (
                          <option key={topic.id} value={topic.id}>
                            {topic.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={styles.selectIcon} />
                    </div>
                    {errors.topicId && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.topicId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* MARKET TYPE */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Listing Type <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.toggleContainer}>
                      {markets.map((market) => (
                        <div
                          key={market.id}
                          className={`${styles.toggleOption} ${formData.marketType === market.name ? styles.toggleActive : ""
                            }`}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, marketType: market.name }));
                            // Clear error if it exists
                            if (errors.marketType) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.marketType;
                                return newErrors;
                              });
                            }
                          }}
                        >
                          <input
                            type="radio"
                            id={`marketType-${market.name}`}
                            value={market.name}
                            checked={formData.marketType === market.name}
                            onChange={() => { }}
                            className={styles.toggleInput}
                          />
                          <label htmlFor={`marketType-${market.name}`} className={styles.toggleLabel}>
                            {market.icon}
                            <span>{market.display}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.marketType && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.marketType}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.navigationButtons}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={styles.backButton}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Product"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddNewProduct;