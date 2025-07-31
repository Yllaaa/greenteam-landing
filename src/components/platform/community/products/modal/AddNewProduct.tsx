/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { X, AlertCircle, Camera, DollarSign, ChevronDown, Globe, MapPin, Tag, FileText, Plus } from "lucide-react";
import styles from "./AddNewProduct.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { preventBackgroundScroll } from "@/hooks/preventScroll/preventBackroundScroll";
import addlogo from "@/../public/ZPLATFORM/event/addLogo.svg";
import Image from "next/image";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useLocale } from "next-intl";
import { Topics } from "@/components/Assets/topics/Topics.data";

// Define types for better TypeScript support
interface FormData {
  creatorType: string;
  name: string;
  description: string;
  price: number;
  country: number;
  city: number;
  topicId: string | number;
  condition: string;
  marketType: string;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface Country {
  id: number;
  name: string;
  iso: string;
}

interface City {
  id: number;
  name: string;
}

type addProductProps = {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  userType: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGES = 4; // Maximum number of images allowed

const AddNewProduct = (props: addProductProps) => {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const locale = useLocale();

  const { setAddNew, userType } = props;
  const closeModal = useCallback(() => {
    setAddNew(false);
  }, [setAddNew]);

  const modalRef = useOutsideClick(closeModal);
  const [formStep, setFormStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Manage image files separately from form state
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [imageRequired, setImageRequired] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    preventBackgroundScroll(true);

    return () => {
      // Clean up object URLs to prevent memory leaks
      imageFiles.forEach(img => {
        if (img.preview.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
      });

      preventBackgroundScroll(false);
    };
  }, [imageFiles]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      creatorType: userType,
      name: "",
      description: "",
      price: 0,
      country: 0,
      city: 0,
      topicId: "",
      condition: "",
      marketType: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    // Check if at least one image is selected
    if (imageFiles.length === 0) {
      setImageRequired(true);
      setFormStep(1); // Go back to step 1 if image is missing
      return;
    }

    if (
      !data.name ||
      !data.description ||
      !data.price ||
      !data.country ||
      !data.city ||
      !data.condition ||
      !data.topicId ||
      !data.marketType
    ) {
      ToastNot("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // send data to server
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(Number(data.price)));
      formData.append("countryId", String(Number(data.country)));
      formData.append("cityId", String(Number(data.city)));
      formData.append("topicId", String(Number(data.topicId)));
      // Removed condition field from API
      formData.append("marketType", data.marketType);

      // Append all images with the correct field name "images" (plural)
      imageFiles.forEach(imgFile => {
        formData.append("images", imgFile.file);
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/marketplace/create-product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      ToastNot(response.data.message || "Product listed successfully");
      reset();
      setImageFiles([]);
      setAddNew(false);
    } catch (err) {
      console.log(err);
      ToastNot("Error adding Product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate step and move to next
  const handleNextStep = async () => {
    const fieldsToValidate = ['name', 'price', 'condition', 'marketType'];
    const isValid = await trigger(fieldsToValidate as any);

    // Check if at least one image is selected
    if (imageFiles.length === 0) {
      setImageRequired(true);
      return;
    } else {
      setImageRequired(false);
    }

    if (isValid) {
      setFormStep(2);
      if (formRef.current) {
        formRef.current.scrollTop = 0;
      }
    }
  };

  // Image upload refs and state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (files && files.length > 0) {
      processSelectedFiles(Array.from(files));
    }
  };

  // Process multiple files
  const processSelectedFiles = (files: File[]) => {
    const availableSlots = MAX_IMAGES - imageFiles.length;

    if (availableSlots <= 0) {
      ToastNot(`Maximum of ${MAX_IMAGES} images allowed`);
      return;
    }

    // Process only the number of files that will fit in available slots
    const filesToProcess = files.slice(0, availableSlots);

    // Validate and add each file
    const validFiles: ImageFile[] = [];
    // let errors = false;

    filesToProcess.forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File "${file.name}" exceeds 10MB size limit`);
        // errors = true;
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setFileError(`File "${file.name}" is not an image`);
        // errors = true;
        return;
      }

      // Create a unique ID for the image
      const id = Math.random().toString(36).substring(2, 15);

      // Create preview URL
      const preview = URL.createObjectURL(file);

      validFiles.push({ id, file, preview });
    });

    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles]);
      setImageRequired(false);
      setFileError(null);
    }

    if (files.length > availableSlots) {
      ToastNot(`Only added ${availableSlots} image(s). Maximum limit reached.`);
    }
  };

  // Image click handler to open file dialog
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current && imageFiles.length < MAX_IMAGES) {
      fileInputRef.current.click();
    } else if (imageFiles.length >= MAX_IMAGES) {
      ToastNot(`Maximum of ${MAX_IMAGES} images allowed`);
    }
  };

  // Remove a specific image
  const removeImage = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the image to remove
    const imageToRemove = imageFiles.find(img => img.id === id);

    if (imageToRemove && imageToRemove.preview.startsWith("blob:")) {
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Filter out the removed image
    setImageFiles(prev => prev.filter(img => img.id !== id));

    // If no images left, set the required flag
    if (imageFiles.length <= 1) {
      setImageRequired(true);
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
      // Filter only image files
      const imageFiles = Array.from(files).filter(file =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length > 0) {
        processSelectedFiles(imageFiles);
      } else {
        setFileError("Please drop image files only");
      }
    }
  };

  const [country, setCountry] = useState<Country[]>();
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [city, setCity] = useState<City[]>();
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");

  const topics = Topics;

  // Market type options
  const marketTypes = [
    { id: 1, name: "local", display: "Local", icon: <MapPin size={18} /> },
    { id: 2, name: "online", display: "Online", icon: <Globe size={18} /> },
  ];

  // Fetch countries
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/countries?locale=${locale}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setCountry(res.data);
      })
      .catch((err) => {
        console.log(err);
        ToastNot("Error fetching countries");
      });
  }, [accessToken, locale]);

  // Fetch cities when country changes
  useEffect(() => {
    if (countryId === undefined) return;

    setIsLoadingCities(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/cities?countryId=${countryId}&search=${search}&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setCity(res.data);
      })
      .catch((err) => {
        console.log(err);
        ToastNot("Error fetching cities");
      })
      .finally(() => {
        setIsLoadingCities(false);
      });
  }, [accessToken, countryId, search]);

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
        <span className={styles.stepLabel}>Details & Location</span>
      </div>
    </div>
  );

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.formContainer}>
        <div className={styles.formHeader}>
          <div className={styles.formTitleContainer}>
            <div className={styles.titleIcon}>
              <Image src={addlogo} alt="Add Product" width={48} height={48} />
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
            onClick={closeModal}
            className={styles.closeButton}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {renderProgressIndicator()}

        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {formStep === 1 ? (
            // Step 1: Basic product information
            <>
              <div className={styles.formSection}>
                {/* Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="product-name" className={styles.label}>
                    <span className={styles.labelText}>Product Name</span>
                    <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputWithIcon}>
                      <Tag size={18} className={styles.inputIcon} />
                      <input
                        id="product-name"
                        type="text"
                        placeholder="Enter product name"
                        className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                        {...register("name", {
                          required: "Product name is required",
                          maxLength: {
                            value: 100,
                            message: "Name cannot exceed 100 characters",
                          },
                        })}
                      />
                    </div>
                    {errors.name && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.name.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className={styles.formGroup}>
                  <label htmlFor="product-price" className={styles.label}>
                    <span className={styles.labelText}>Price</span>
                    <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.priceInputContainer}>
                      <DollarSign size={18} className={styles.currencySymbol} />
                      <input
                        id="product-price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={`${styles.input} ${styles.priceInput} ${errors.price ? styles.inputError : ""}`}
                        {...register("price", {
                          required: "Price is required",
                          min: {
                            value: 0,
                            message: "Price must be a positive number",
                          },
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {errors.price && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.price.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* MARKET TYPE */}
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>Listing Type</span>
                    <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.toggleContainer}>
                      {marketTypes.map((market) => (
                        <div
                          key={market.id}
                          className={`${styles.toggleOption} ${watch("marketType") === market.name ? styles.toggleActive : ""
                            }`}
                          onClick={() => setValue("marketType", market.name, { shouldValidate: true })}
                        >
                          <input
                            type="radio"
                            id={`marketType-${market.name}`}
                            value={market.name}
                            className={styles.toggleInput}
                            {...register("marketType", { required: "Listing type is required" })}
                          />
                          <label htmlFor={`marketType-${market.name}`} className={styles.toggleLabel}>
                            <span className={styles.toggleIcon}>{market.icon}</span>
                            <span>{market.display}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.marketType && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.marketType.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CONDITION */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>Product Condition</span>
                    <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.toggleContainer}>
                      <div
                        className={`${styles.toggleOption} ${watch("condition") === "new" ? styles.toggleActive : ""
                          }`}
                        onClick={() => setValue("condition", "new", { shouldValidate: true })}
                      >
                        <input
                          type="radio"
                          id="condition-new"
                          value="new"
                          className={styles.toggleInput}
                          {...register("condition", { required: "Condition is required" })}
                        />
                        <label htmlFor="condition-new" className={styles.toggleLabel}>
                          New
                        </label>
                      </div>
                      <div
                        className={`${styles.toggleOption} ${watch("condition") === "used" ? styles.toggleActive : ""
                          }`}
                        onClick={() => setValue("condition", "used", { shouldValidate: true })}
                      >
                        <input
                          type="radio"
                          id="condition-used"
                          value="used"
                          className={styles.toggleInput}
                          {...register("condition", { required: "Condition is required" })}
                        />
                        <label htmlFor="condition-used" className={styles.toggleLabel}>
                          Used
                        </label>
                      </div>
                    </div>
                    {errors.condition && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.condition.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* MULTIPLE IMAGES - Enhanced for multiple image uploads */}
              <div className={styles.formSection}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>Product Images</span>
                    <span className={styles.requiredField}>*</span>
                    <span className={styles.labelHint}>(Up to 4, max 10MB each)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div
                      ref={dropAreaRef}
                      className={`${styles.imageUploadContainer} ${(fileError || imageRequired) ? styles.inputError : ""
                        } ${isDragging ? styles.dragging : ""}`}
                      onClick={handleImageClick}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {imageFiles.length > 0 ? (
                        <div className={styles.imageGrid}>
                          {imageFiles.map((img) => (
                            <div key={img.id} className={styles.imagePreviewItem}>
                              <div className={styles.imagePreview}>
                                <Image
                                  src={img.preview}
                                  alt="Product preview"
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                                <button
                                  type="button"
                                  className={styles.removeImageButton}
                                  onClick={(e) => removeImage(img.id, e)}
                                  aria-label="Remove image"
                                >
                                  <X size={16} className={styles.removeIcon} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Show add more placeholder if we have room for more images */}
                          {imageFiles.length < MAX_IMAGES && (
                            <div
                              className={styles.addMoreImagePlaceholder}
                              onClick={handleImageClick}
                            >
                              <Plus size={24} className={styles.addIcon} />
                              <span className={styles.addMoreText}>
                                Add more images
                              </span>
                              <span className={styles.smallText}>
                                {MAX_IMAGES - imageFiles.length} remaining
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <div className={styles.uploadIconContainer}>
                            <Camera size={24} className={styles.uploadIcon} />
                          </div>
                          <p className={styles.uploadText}>
                            {isDragging ? "Drop images here" : "Click or drag images here"}
                          </p>
                          <p className={styles.smallText}>
                            Upload up to {MAX_IMAGES} images (max 10MB each)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </div>
                    {(fileError || imageRequired) && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>
                          {fileError || "At least one product image is required"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.navigationButtons}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={styles.nextButton}
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            // Step 2: Product details and location
            <>
              <div className={styles.formSection}>
                {/* DESCRIPTION */}
                <div className={styles.formGroup}>
                  <label htmlFor="product-description" className={styles.label}>
                    <span className={styles.labelText}>Description</span>
                    <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.textareaContainer}>
                      <FileText size={18} className={styles.textareaIcon} />
                      <textarea
                        id="product-description"
                        rows={4}
                        placeholder="Describe your product with details such as features, condition, etc."
                        className={`${styles.textarea} ${errors.description ? styles.inputError : ""
                          }`}
                        {...register("description", {
                          required: "Description is required",
                          minLength: {
                            value: 10,
                            message: "Description must be at least 10 characters",
                          },
                        })}
                      ></textarea>
                    </div>
                    <div className={styles.charCounter}>
                      {watch("description")?.length || 0} characters
                      {watch("description")?.length < 10 && (
                        <span className={styles.minChars}> (min: 10)</span>
                      )}
                    </div>
                    {errors.description && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.description.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* TOPIC */}
                <div className={styles.formGroup}>
                  <label htmlFor="product-topic" className={styles.label}>
                    <span className={styles.labelText}>Category</span>
                    <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.selectWrapper}>
                      <select
                        id="product-topic"
                        className={`${styles.select} ${errors.topicId ? styles.inputError : ""
                          }`}
                        {...register("topicId", { required: "Category is required" })}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {topics?.map((topic, index) => (
                          <option key={index} value={topic.id}>
                            {topic.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className={styles.selectIcon} />
                    </div>
                    {errors.topicId && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.topicId.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                {/* COUNTRY */}
                <div className={styles.formGroup}>
                  <label htmlFor="product-country" className={styles.label}>
                    <span className={styles.labelText}>Country</span>
                    <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.selectWrapper}>
                      <select
                        id="product-country"
                        className={`${styles.select} ${errors.country ? styles.inputError : ""
                          }`}
                        {...register("country", { required: "Country is required" })}
                        onChange={(e) => {
                          const id = parseInt(e.target.value);
                          setCountryId(id);
                          setValue("city", 0); // Reset city when country changes
                        }}
                      >
                        <option value="" disabled>
                          Select Country
                        </option>
                        {country?.map((country, index) => (
                          <option key={index} value={country.id}>
                            {country.iso}_{country.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className={styles.selectIcon} />
                    </div>
                    {errors.country && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.country.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CITY */}
                <div className={styles.formGroup}>
                  <label htmlFor="product-city" className={styles.label}>
                    <span className={styles.labelText}>City</span>
                    <span className={styles.requiredField}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.cityContainer}>
                      <input
                        type="text"
                        id="city-search"
                        placeholder="Search for a city..."
                        className={styles.input}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={!countryId}
                      />

                      <div className={styles.selectWrapper}>
                        <select
                          id="product-city"
                          className={`${styles.select} ${errors.city ? styles.inputError : ""
                            }`}
                          {...register("city", { required: "City is required" })}
                          disabled={!countryId || isLoadingCities}
                        >
                          <option value="" disabled>
                            {isLoadingCities
                              ? "Loading cities..."
                              : countryId
                                ? "Select city"
                                : "Select a country first"}
                          </option>
                          {city?.map((city, index) => (
                            <option key={index} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className={styles.selectIcon} />
                      </div>
                    </div>
                    {errors.city && (
                      <div className={styles.errorContainer}>
                        <AlertCircle size={16} className={styles.errorIcon} />
                        <p className={styles.errorText}>{errors.city.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.navigationButtons}>
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className={styles.backButton}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner}></span>
                      Creating...
                    </>
                  ) : (
                    "List Product"
                  )}
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