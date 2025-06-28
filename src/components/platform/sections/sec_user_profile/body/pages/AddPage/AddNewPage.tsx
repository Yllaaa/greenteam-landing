/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom"
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import styles from "./AddNewPage.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { preventBackgroundScroll } from "@/hooks/preventScroll/preventBackroundScroll";
import addlogo from "@/../public/ZPLATFORM/event/addLogo.svg";
import Image from "next/image";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { Topics } from "@/components/Assets/topics/Topics.data";
import { useLocale } from "next-intl";
// Define types for better TypeScript support
interface FormData {
  name: string;
  description: string;
  slug: string;
  why: string;
  what: string;
  how: string;
  topicId: string | number;
  countryId: string | number;
  cityId: string | number;
  category: string;
  avatar: File | null;
  cover: File | null;
  websiteUrl: string;
}

// interface Category {
//   value: string;
//   name: string;
// }
type addEventProps = {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
};
interface Country {
  id: number;
  name: string;
  iso: string;
}
interface City {
  id: number;
  name: string;
}
// // Sample topics for the dropdown
// const category: Category[] = [
//   { value: "volunteering&work", name: "Volunteering & Work" },
//   { value: "social", name: "Social" },
//   { value: "talks&workshops", name: "Talks & Workshops" },
// ];

const AddNewPage = (props: addEventProps) => {
  const locale = useLocale();
  const token = getToken();
  const accessToken = token ? token.accessToken : null;

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
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      why: "",
      what: "",
      how: "",
      topicId: "",
      countryId: "",
      cityId: "",
      category: "",
      avatar: null,
      cover: null,
      websiteUrl: "",
    },
  });

  // Form submission handler
  const [slugTaken, setSlugTaken] = useState(false);
  const checkSlugTaken = (data: FormData) => {
    try {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/check-slug-taken?slug=${data.slug}`
        )
        .then((res) => {
          setSlugTaken(res.data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // check all fields are filled
    if (
      !data.name ||
      !data.description ||
      !data.slug ||
      !data.cityId ||
      !data.countryId
    ) {
      ToastNot("Please fill all fields");
    }
    // check slug is unique
    checkSlugTaken(data);
    if (slugTaken) {
      ToastNot("Slug already taken");
    }

    try {
      // send data to server
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/create-page`,
          {
            name: data.name,
            description: data.description,
            slug: data.slug,
            why: data.why,
            what: data.what,
            how: data.how,
            topicId: data.topicId,
            countryId: data.countryId,
            cityId: data.cityId,
            category: data.category,
            avatar: data.avatar,
            cover: data.cover,
            websiteUrl: data.websiteUrl,
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
          console.log(res.data);
          ToastNot("Page created successfully");
          reset();

        }).then(()=>{
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          ToastNot("Error creating page");
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Updated image upload state and refs
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Handle image selection - updated to handle the file properly
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      processSelectedAvatar(file);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  // Process the selected file (either from input or drag)
  const processSelectedAvatar = (file: File) => {
    // Set the file in the form
    setValue("avatar", file);

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };
  const processSelectedFile = (file: File) => {
    // Set the file in the form
    setValue("cover", file);

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
  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAvatar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the parent onClick
    setValue("avatar", null);

    // Clean up the object URL if it exists
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarPreview(null);

    // Clear the input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the parent onClick
    setValue("cover", null);

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

  const handleDropAvatar = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if it's an image file
      if (file.type.startsWith("image/")) {
        processSelectedAvatar(file);
      }
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

  return ReactDOM.createPortal(
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.formContainer}>
        <div className={styles.formTitleContainer}>
          <div className={styles.titleIcon}>
            <Image src={addlogo} alt="addlogo" />
          </div>
          <div className={styles.titleText}>
            <h2 className={styles.formTitle}>Host Your Page</h2>
            <p className={styles.formDescription}>
              Plan and promote your upcoming event. Share details to help
              attendees find and join your event
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formSection}>
            {/* name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Page Name</label>
              <input
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ""
                  }`}
                {...register("name", {
                  required: "name is required",
                  maxLength: {
                    value: 100,
                    message: "name cannot exceed 100 characters",
                  },
                })}
              />
              {errors.name && (
                <p className={styles.errorText}>{errors.name.message}</p>
              )}
            </div>
            {/* slug */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Page Slug</label>
              <input
                type="text"
                className={`${styles.input} ${errors.slug ? styles.inputError : ""
                  }`}
                {...register("slug", {
                  required: "slug is required",
                  maxLength: {
                    value: 100,
                    message: "slug cannot exceed 100 characters",
                  },
                })}
              />
              {errors.slug && (
                <p className={styles.errorText}>{errors.slug.message}</p>
              )}
            </div>
            {/* website */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Page Website</label>
              <input
                type="text"
                className={`${styles.input} ${errors.websiteUrl ? styles.inputError : ""
                  }`}
                {...register("websiteUrl", {
                  required: "webtite is required",
                })}
              />
              {errors.websiteUrl && (
                <p className={styles.errorText}>{errors.websiteUrl.message}</p>
              )}
            </div>
          </div>
          {/* media */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Page Media</label>
              <div className={styles.media}>
                {/* avatar */}
                <div
                  ref={dropAreaRef}
                  className={`${styles.AvatarUploadContainer} ${errors.avatar ? styles.inputError : ""
                    } ${isDragging ? styles.dragging : ""}`}
                  onClick={handleAvatarClick}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDropAvatar}
                >
                  {avatarPreview ? (
                    <div className={styles.avatarPreviewWrapper}>
                      <div
                        className={styles.avatarPreview}
                        onClick={handleAvatarClick} // Add onClick handler here
                      >
                        <Image
                          src={avatarPreview}
                          alt="Event preview"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.removeImageButton}
                        onClick={removeAvatar}
                      >
                        <X className={styles.removeIcon} />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadAvatarPlaceholder}>
                      <p>
                        {isDragging
                          ? "Drop image here"
                          : "Click or drag image here"}
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </div>
                {/* cover */}
                <div
                  ref={dropAreaRef}
                  className={`${styles.imageUploadContainer} ${errors.cover ? styles.inputError : ""
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
                    ref={fileInputRef}
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
                {errors.avatar && (
                  <p className={styles.errorText}>{errors.avatar.message}</p>
                )}
                {errors.cover && (
                  <p className={styles.errorText}>{errors.cover.message}</p>
                )}
              </div>
            </div>
          </div>
          {/* location */}
          <div className={styles.formSection}>
            {/* COUNTRY */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Country</label>
              <select
                className={`${styles.select} ${errors.countryId ? styles.inputError : ""
                  }`}
                {...register("countryId", { required: "Country is required" })}
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
              {errors.countryId && (
                <p className={styles.errorText}>{errors.countryId.message}</p>
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
                  className={`${styles.select} ${errors.cityId ? styles.inputError : ""
                    }`}
                  {...register("cityId", { required: "city is required" })}
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
              {errors.cityId && (
                <p className={styles.errorText}>{errors.cityId.message}</p>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            {/* why */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Why?</label>
              <input
                type="text"
                className={`${styles.input} ${errors.why ? styles.inputError : ""
                  }`}
                {...register("why", {
                  required: "why is required",
                  maxLength: {
                    value: 100,
                    message: "why cannot exceed 100 characters",
                  },
                })}
              />
              {errors.why && (
                <p className={styles.errorText}>{errors.why.message}</p>
              )}
            </div>
            {/* what */}
            <div className={styles.formGroup}>
              <label className={styles.label}>What?</label>
              <input
                type="text"
                className={`${styles.input} ${errors.what ? styles.inputError : ""
                  }`}
                {...register("what", {
                  required: "what is required",
                  maxLength: {
                    value: 100,
                    message: "what cannot exceed 100 characters",
                  },
                })}
              />
              {errors.what && (
                <p className={styles.errorText}>{errors.what.message}</p>
              )}
            </div>
            {/* how */}
            <div className={styles.formGroup}>
              <label className={styles.label}>How?</label>
              <input
                type="text"
                className={`${styles.input} ${errors.how ? styles.inputError : ""
                  }`}
                {...register("how", {
                  required: "webtite is required",
                })}
              />
              {errors.how && (
                <p className={styles.errorText}>{errors.how.message}</p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
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
          {/* CATEGORY */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Category</label>
            <select
              className={`${styles.select} ${errors.topicId ? styles.inputError : ""
                }`}
              {...register("category", { required: "Topic is required" })}
            >
              <option value="" disabled>
                Select Topic
              </option>
              {["Project", "Business"].map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className={styles.errorText}>{errors.category.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Topic</label>
            <select
              className={`${styles.select} ${errors.topicId ? styles.inputError : ""
                }`}
              {...register("topicId", { required: "Topic is required" })}
            >
              <option value="" disabled>
                Select Topic
              </option>
              {topics.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.topicId && (
              <p className={styles.errorText}>{errors.topicId.message}</p>
            )}
          </div>

          <div className={styles.submitContainer}>
            <button
              onClick={() => setAddNew(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Page
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddNewPage;
