import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
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
  image: File | null;
  condition: string; // Added condition field
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

const AddNewProduct = (props: addProductProps) => {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const locale = useLocale();

  const { setAddNew, userType } = props;
  const closeModal = useCallback(() => {
    setAddNew(false);
  }, [setAddNew]);

  const modalRef = useOutsideClick(closeModal);

  useEffect(() => {
    preventBackgroundScroll(true);

    return () => {
      preventBackgroundScroll(false);
    };
  }, []);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
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
      image: null,
      condition: "",
    },
  });

  // Form submission handler
  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // check all fields are filled
    if (
      !data.name ||
      !data.description ||
      !data.price ||
      !data.country ||
      !data.city ||
      !data.condition ||
      !data.topicId
    ) {
      ToastNot("Please fill all fields");
      return;
    }
console.log("Form data:", data);
    try {
      // send data to server
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/marketplace/create-product`,
          {
            name: data.name,
            description: data.description,
            price: Number(data.price),
            countryId: Number(data.country),
            cityId: Number(data.city),
            topicId: Number(data.topicId),
            images: data.image,
            // condition: data.condition,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          ToastNot(res.data.message || "Product listed successfully");
          reset();
          setAddNew(false);
        })
        .catch((err) => {
          console.log(err);
          ToastNot("Error adding Product");
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Image upload state and refs
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  // Process the selected file (either from input or drag)
  const processSelectedFile = (file: File) => {
    // Set the file in the form
    setValue("image", file);

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

  // Image click handler
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove image handler
  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("image", null);

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);

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

  const [country, setCountry] = useState<Country[]>();
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [city, setCity] = useState<City[]>();

  const [search, setSearch] = useState<string>("");

  const topics = Topics;

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
      });
  }, [accessToken, countryId, search]);

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
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formSection}>
            {/* Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Name</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={`${styles.input} ${errors.name ? styles.inputError : ""
                    }`}
                  {...register("name", {
                    required: "Product name is required",
                    maxLength: {
                      value: 100,
                      message: "Name cannot exceed 100 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className={styles.errorText}>{errors.name.message}</p>
                )}
              </div>
            </div>
            {/* Price */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Price</label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={`${styles.input} ${errors.price ? styles.inputError : ""
                    }`}
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be a positive number",
                    },
                  })}
                />
                {errors.price && (
                  <p className={styles.errorText}>{errors.price.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* CONDITION - New toggle similar to event type */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Product Condition</label>
            <div className={styles.toggleContainer}>
              <div
                className={`${styles.toggleOption} ${watch("condition") === "new" ? styles.toggleActive : ""}`}
                onClick={() => setValue("condition", "new")}
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
                className={`${styles.toggleOption} ${watch("condition") === "used" ? styles.toggleActive : ""}`}
                onClick={() => setValue("condition", "used")}
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
              <p className={styles.errorText}>{errors.condition.message}</p>
            )}
          </div>

          {/* IMAGE */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Image</label>
              <div
                ref={dropAreaRef}
                className={`${styles.imageUploadContainer} ${errors.image ? styles.inputError : ""
                  } ${isDragging ? styles.dragging : ""}`}
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
                        alt="Product preview"
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
                  ref={fileInputRef}
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
              {errors.image && (
                <p className={styles.errorText}>{errors.image.message}</p>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            {/* DESCRIPTION */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <div className={styles.inputWrapper}>
                <textarea
                  rows={4}
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
                {errors.description && (
                  <p className={styles.errorText}>{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* TOPIC */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <div className={styles.inputWrapper}>
                <select
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
                {errors.topicId && (
                  <p className={styles.errorText}>{errors.topicId.message}</p>
                )}
              </div>
            </div>

            {/* COUNTRY */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Country</label>
              <div className={styles.inputWrapper}>
                <select
                  className={`${styles.select} ${errors.country ? styles.inputError : ""
                    }`}
                  {...register("country", { required: "Country is required" })}
                  onChange={(e) => setCountryId(parseInt(e.target.value))}
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
                {errors.country && (
                  <p className={styles.errorText}>{errors.country.message}</p>
                )}
              </div>
            </div>

            {/* CITY */}
            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <div className={styles.inputWrapper}>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search city"
                    className={styles.input}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select
                    className={`${styles.select} ${errors.city ? styles.inputError : ""
                      }`}
                    {...register("city", { required: "City is required" })}
                  >
                    <option value="" disabled>
                      Select city
                    </option>
                    {city?.map((city, index) => (
                      <option key={index} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.city && (
                  <p className={styles.errorText}>{errors.city.message}</p>
                )}
              </div>
            </div>
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
              List Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProduct;