/* eslint-disable react-hooks/exhaustive-deps */
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
  image?: File | null;
  marketType: string;
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

  const { setAddNew } = props;
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
    formState: { errors },
  } = useForm<FormData>({});

  // Form submission handler
  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // check all fields are filled
    if (
      !data.name ||
      !data.description ||
      !data.price ||
      !data.country ||
      !data.marketType ||
      !data.city
    ) {
      ToastNot("Please fill all fields");
    }
    try {
      // send data to server
      console.log(data);

      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/marketplace/create-product`,
          {
            name: data.name,
            description: data.description,
            marketType: data.marketType,
            price: Number(data.price),
            // countryId: Number(data.country),
            // cityId: Number(data.city),
            topicId: Number(data.topicId),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          ToastNot(res.data.message);
          reset();
        })
        .catch((err) => {
          console.log(err);
          ToastNot("Error adding event");
        });
    } catch (err) {
      console.log(err);
    }
  };

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
    setValue("image", null);

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

  const [country, setCountry] = useState<Country[]>();
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [city, setCity] = useState<City[]>();

  const [search, setSearch] = useState<string>("");

  const topics = Topics;
  const markets = [
    { id: 1, name: "local_business" },
    { id: 2, name: "value_driven_business" },
  ]

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
  }, []);

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
  }, [countryId, search]);

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
              <input
                type="text"
                className={`${styles.input} ${
                  errors.name ? styles.inputError : ""
                }`}
                {...register("name", {
                  required: "Title is required",
                  maxLength: {
                    value: 100,
                    message: "Title cannot exceed 100 characters",
                  },
                })}
              />
              {errors.name && (
                <p className={styles.errorText}>{errors.name.message}</p>
              )}
            </div>
            {/* price */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Price</label>
              <input
                type="text"
                className={`${styles.input} ${
                  errors.name ? styles.inputError : ""
                }`}
                {...register("price", {
                  required: "Price is required",
                  maxLength: {
                    value: 100,
                    message: "Title cannot exceed 100 characters",
                  },
                })}
              />
              {errors.price && (
                <p className={styles.errorText}>{errors.price.message}</p>
              )}
            </div>
          </div>
          {/* IMAGE */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Event Image</label>
              <div
                ref={dropAreaRef}
                className={`${styles.imageUploadContainer} ${
                  errors.image ? styles.inputError : ""
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
              {errors.image && (
                <p className={styles.errorText}>{errors.image.message}</p>
              )}
            </div>
          </div>
          <div className={styles.formSection}>
            {/* DESCRIPTION */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                rows={4}
                className={`${styles.textarea} ${
                  errors.description ? styles.inputError : ""
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

            {/* COUNTRY */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Topic</label>
              <select
                className={`${styles.select} ${
                  errors.topicId ? styles.inputError : ""
                }`}
                {...register("topicId", { required: "Country is required" })}
              >
                <option value="" disabled>
                  Select topic
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
            {/* Market type */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Market Type</label>
              <select
                className={`${styles.select} ${
                  errors.marketType ? styles.inputError : ""
                }`}
                {...register("marketType", { required: "Market type is required" })}
              >
                <option value="" disabled>
                  Select market type
                </option>
                {markets?.map((market, index) => (
                  <option key={index} value={market.id}>
                    {market.name}
                  </option>
                ))}
              </select>
              {errors.marketType && (
                <p className={styles.errorText}>{errors.marketType.message}</p>
              )}
            </div>

            {/* COUNTRY */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Country</label>
              <select
                className={`${styles.select} ${
                  errors.country ? styles.inputError : ""
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
            {/* CITY */}

            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Enter city"
                  className={styles.input}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className={`${styles.select} ${
                    errors.city ? styles.inputError : ""
                  }`}
                  {...register("city", { required: "city is required" })}
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  {/* <option value=""> */}
                  {/* </option> */}
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
          <div className={styles.submitContainer}>
            <button
              onClick={() => setAddNew(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProduct;
