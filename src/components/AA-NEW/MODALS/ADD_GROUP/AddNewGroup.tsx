/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { X, Loader2, Upload } from "lucide-react";
import styles from "./AddNewGroup.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { preventBackgroundScroll } from "@/hooks/preventScroll/preventBackroundScroll";
import addlogo from "@/../public/ZPLATFORM/event/addLogo.svg";
import Image from "next/image";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { Topics } from "@/components/Assets/topics/Topics.data";
import { useLocale, useTranslations } from "next-intl";

interface FormData {
    name: string;
    description: string;
    topicId: string | number;
    countryId: string | number;
    cityId: string | number;
    banner: File | null;
}

type AddEventProps = {
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

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const AddNewGroup = ({ setAddNew }: AddEventProps) => {
    const t = useTranslations('web.addGroup');
    const token = getToken();
    const accessToken = token ? token.accessToken : null;
    const locale = useLocale();

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
            topicId: "",
            banner: null,
            countryId: "",
            cityId: "",
        },
    });

    // State for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: FormData) => {
        // Prevent multiple submissions
        if (isSubmitting) return;

        // Check all required fields
        if (!data.name || !data.description || !data.topicId || !data.cityId || !data.countryId) {
            ToastNot(t('errors.fillAllFields'));
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Append all fields
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('topicId', String(data.topicId));
            formData.append('countryId', String(data.countryId));
            formData.append('cityId', String(data.cityId));

            // Append banner if exists
            if (data.banner) {
                formData.append('banner', data.banner);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/groups/create-group`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );

            if (response.data) {
                ToastNot(t('errors.groupCreated'));
                reset();
                setTimeout(() => {
                    setAddNew(false);
                }, 1000);
            }
        } catch (error: any) {
            console.error("Error creating group:", error);

            if (error.response?.status === 401) {
                ToastNot(t('errors.unauthorized'));
            } else if (error.response?.status === 413) {
                ToastNot(t('errors.fileTooLarge'));
            } else if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error;
                ToastNot(errorMessage || t('errors.validationError'));
            } else {
                ToastNot(t('errors.errorCreating'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Image handling states
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validate image file
    const validateImageFile = (file: File): string | null => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return t('errors.invalidImageType');
        }
        if (file.size > MAX_FILE_SIZE) {
            return t('errors.imageTooLarge');
        }
        return null;
    };

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (file) {
            const error = validateImageFile(file);
            if (error) {
                setImageError(error);
                ToastNot(error);
                return;
            }
            setImageError(null);
            processSelectedFile(file);
        }
    };

    // Process the selected file
    const processSelectedFile = (file: File) => {
        setValue("banner", file);
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
    };

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValue("banner", null);

        if (imagePreview?.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        setImagePreview(null);
        setImageError(null);

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
            const error = validateImageFile(file);
            if (error) {
                setImageError(error);
                ToastNot(error);
                return;
            }
            setImageError(null);
            processSelectedFile(file);
        }
    };

    // Location data
    const [country, setCountry] = useState<Country[]>([]);
    const [countryId, setCountryId] = useState<number | undefined>(undefined);
    const [city, setCity] = useState<City[]>([]);
    const [search, setSearch] = useState<string>("");

    const topics = Topics;

    // Fetch countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/countries?locale=${locale}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );
                setCountry(response.data);
            } catch (error) {
                console.error("Error fetching countries:", error);
                ToastNot(t('errors.errorCountries'));
            }
        };

        fetchCountries();
    }, [accessToken, locale, t]);

    // Fetch cities based on country selection
    useEffect(() => {
        if (countryId === undefined) return;

        const fetchCities = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/cities?countryId=${countryId}&search=${search}&limit=5`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );
                setCity(response.data);
            } catch (error) {
                console.error("Error fetching cities:", error);
                ToastNot(t('errors.errorCities'));
            }
        };

        fetchCities();
    }, [accessToken, countryId, search, t]);

    // Keyboard navigation support
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [closeModal]);

    return ReactDOM.createPortal(
        <div className={styles.modal}>
            <div ref={modalRef} className={styles.formContainer}>
                <div className={styles.formTitleContainer}>
                    <div className={styles.titleIcon}>
                        <Image src={addlogo} alt="addlogo" />
                    </div>
                    <div className={styles.titleText}>
                        <h2 className={styles.formTitle}>{t('title')}</h2>
                        <p className={styles.formDescription}>{t('description')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* Group Name */}
                    <div className={styles.formSection}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('form.groupName')}</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                                    {...register("name", {
                                        required: t('errors.required', { field: t('form.groupName') }),
                                        maxLength: {
                                            value: 100,
                                            message: t('errors.maxLength', { field: t('form.groupName'), max: 100 }),
                                        },
                                    })}
                                />
                                {errors.name && (
                                    <p className={styles.errorText}>{errors.name.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Group Media */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('form.groupMedia')}</label>
                            <div className={styles.inputWrapper}>
                                <div
                                    className={`${styles.imageUploadContainer} ${imageError ? styles.inputError : ""
                                        } ${isDragging ? styles.dragging : ""}`}
                                    onClick={handleImageClick}
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {imagePreview ? (
                                        <div className={styles.imagePreviewWrapper}>
                                            <div className={styles.imagePreview}>
                                                <Image
                                                    src={imagePreview}
                                                    alt="Banner preview"
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className={styles.removeImageButton}
                                                onClick={removeImage}
                                                aria-label="Remove image"
                                            >
                                                <X className={styles.removeIcon} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.uploadPlaceholder}>
                                            <Upload className={styles.uploadIcon} />
                                            <p className={styles.uploadText}>
                                                {isDragging ? t('form.dropImage') : t('form.clickOrDrag')}
                                            </p>
                                            <span className={styles.uploadHint}>{t('form.banner')}</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                        className={styles.fileInput}
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                        aria-label={t('form.banner')}
                                    />
                                </div>
                                {imageError && (
                                    <p className={styles.errorText}>{imageError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className={styles.formSection}>
                        <div className={styles.formRow}>
                            {/* Country */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('form.country')}</label>
                                <div className={styles.inputWrapper}>
                                    <select
                                        className={`${styles.select} ${errors.countryId ? styles.inputError : ""}`}
                                        {...register("countryId", {
                                            required: t('errors.required', { field: t('form.country') })
                                        })}
                                        onChange={(e) => setCountryId(parseInt(e.target.value))}
                                    >
                                        <option value="">{t('form.selectCountry')}</option>
                                        {country?.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.iso} - {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.countryId && (
                                        <p className={styles.errorText}>{errors.countryId.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* City */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('form.city')}</label>
                                <div className={styles.inputWrapper}>
                                    <div className={styles.searchContainer}>
                                        <input
                                            type="text"
                                            placeholder={t('form.enterCity')}
                                            className={styles.searchInput}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <select
                                            className={`${styles.select} ${errors.cityId ? styles.inputError : ""}`}
                                            {...register("cityId", {
                                                required: t('errors.required', { field: t('form.city') })
                                            })}
                                        >
                                            <option value="">{t('form.selectCity')}</option>
                                            {city?.map((city) => (
                                                <option key={city.id} value={city.id}>
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
                        </div>
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('form.description')}</label>
                        <div className={styles.inputWrapper}>
                            <textarea
                                rows={4}
                                className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
                                {...register("description", {
                                    required: t('errors.required', { field: t('form.description') }),
                                    minLength: {
                                        value: 10,
                                        message: t('errors.minLength', { field: t('form.description'), min: 10 }),
                                    },
                                })}
                            />
                            {errors.description && (
                                <p className={styles.errorText}>{errors.description.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Topic */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('form.topic')}</label>
                        <div className={styles.inputWrapper}>
                            <select
                                className={`${styles.select} ${errors.topicId ? styles.inputError : ""}`}
                                {...register("topicId", {
                                    required: t('errors.required', { field: t('form.topic') })
                                })}
                            >
                                <option value="">{t('form.selectTopic')}</option>
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </option>
                                ))}
                            </select>
                            {errors.topicId && (
                                <p className={styles.errorText}>{errors.topicId.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className={styles.submitContainer}>
                        <button
                            type="button"
                            onClick={() => setAddNew(false)}
                            className={styles.cancelButton}
                            disabled={isSubmitting}
                        >
                            {t('form.cancel')}
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className={styles.loadingText}>
                                    <Loader2 className={styles.buttonSpinner} />
                                    {t('form.creating')}
                                </span>
                            ) : (
                                t('form.createGroup')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddNewGroup;