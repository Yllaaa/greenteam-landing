/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { X, Check, AlertCircle, Loader2 } from "lucide-react";
import styles from "./AddNewPage.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { preventBackgroundScroll } from "@/hooks/preventScroll/preventBackroundScroll";
import addlogo from "@/../public/ZPLATFORM/event/addLogo.svg";
import Image from "next/image";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { Topics } from "@/components/Assets/topics/Topics.data";
import { useLocale, useTranslations } from "next-intl";
import { debounce } from "lodash";

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

const AddNewPage = ({ setAddNew }: AddEventProps) => {
    const t = useTranslations('web.addPost');
    const locale = useLocale();
    const token = getToken();
    const accessToken = token ? token.accessToken : null;

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

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
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

    // State for slug checking
    const [slugStatus, setSlugStatus] = useState<{
        checking: boolean;
        available: boolean | null;
        message: string;
    }>({
        checking: false,
        available: null,
        message: "",
    });

    // Watch slug field for live checking
    const watchedSlug = watch("slug");

    // Debounced slug check
    const checkSlugAvailability = useCallback(
        debounce(async (slug: string) => {
            if (!slug || slug.length < 3) {
                setSlugStatus({ checking: false, available: null, message: "" });
                return;
            }

            setSlugStatus({ checking: true, available: null, message: t('errors.checkingSlug') });

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/check-slug-taken?slug=${slug}`
                );

                const isTaken = response.data;
                setSlugStatus({
                    checking: false,
                    available: !isTaken,
                    message: isTaken ? t('errors.slugTaken') : t('errors.slugAvailable'),
                });
            } catch (error) {
                console.error("Error checking slug:", error);
                setSlugStatus({ checking: false, available: null, message: "" });
            }
        }, 500),
        [t]
    );

    useEffect(() => {
        checkSlugAvailability(watchedSlug);
    }, [watchedSlug, checkSlugAvailability]);

    // Form submission handler
    const onSubmit = async (data: FormData) => {
        // Check if slug is available
        if (slugStatus.available === false) {
            ToastNot(t('errors.slugTaken'));
            return;
        }

        // Check all required fields
        if (!data.name || !data.description || !data.slug || !data.cityId || !data.countryId) {
            ToastNot(t('errors.fillAllFields'));
            return;
        }

        try {
            const formData = new FormData();

            // Append all text fields
            Object.keys(data).forEach((key) => {
                if (key !== 'avatar' && key !== 'cover' && data[key as keyof FormData]) {
                    formData.append(key, String(data[key as keyof FormData]));
                }
            });

            // Append files if they exist
            if (data.avatar) {
                formData.append('avatar', data.avatar);
            }
            if (data.cover) {
                formData.append('cover', data.cover);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/create-page`,
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
                ToastNot(t('errors.pageCreated'));
                reset();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error("Error creating page:", error);
            ToastNot(t('errors.errorCreating'));
        }
    };

    // Image handling states
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isDraggingAvatar, setIsDraggingAvatar] = useState<boolean>(false);
    const [isDraggingCover, setIsDraggingCover] = useState<boolean>(false);
    const [imageErrors, setImageErrors] = useState<{ avatar?: string; cover?: string }>({});

    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

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

    // Handle avatar change
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (file) {
            const error = validateImageFile(file);
            if (error) {
                setImageErrors(prev => ({ ...prev, avatar: error }));
                ToastNot(error);
                return;
            }
            setImageErrors(prev => ({ ...prev, avatar: undefined }));
            processSelectedAvatar(file);
        }
    };

    // Handle cover image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (file) {
            const error = validateImageFile(file);
            if (error) {
                setImageErrors(prev => ({ ...prev, cover: error }));
                ToastNot(error);
                return;
            }
            setImageErrors(prev => ({ ...prev, cover: undefined }));
            processSelectedFile(file);
        }
    };

    const processSelectedAvatar = (file: File) => {
        setValue("avatar", file);
        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
    };

    const processSelectedFile = (file: File) => {
        setValue("cover", file);
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
    };

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
            if (avatarPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [imagePreview, avatarPreview]);

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        avatarInputRef.current?.click();
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const removeAvatar = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValue("avatar", null);
        if (avatarPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarPreview(null);
        if (avatarInputRef.current) {
            avatarInputRef.current.value = "";
        }
        setImageErrors(prev => ({ ...prev, avatar: undefined }));
    };

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValue("cover", null);
        if (imagePreview?.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setImageErrors(prev => ({ ...prev, cover: undefined }));
    };

    // Separate drag handlers for avatar and cover
    const handleDragEnterAvatar = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingAvatar(true);
    };

    const handleDragLeaveAvatar = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingAvatar(false);
    };

    const handleDragOverAvatar = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDraggingAvatar) {
            setIsDraggingAvatar(true);
        }
    };

    const handleDropAvatar = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingAvatar(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            const error = validateImageFile(file);
            if (error) {
                setImageErrors(prev => ({ ...prev, avatar: error }));
                ToastNot(error);
                return;
            }
            setImageErrors(prev => ({ ...prev, avatar: undefined }));
            processSelectedAvatar(file);
        }
    };

    const handleDragEnterCover = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingCover(true);
    };

    const handleDragLeaveCover = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingCover(false);
    };

    const handleDragOverCover = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDraggingCover) {
            setIsDraggingCover(true);
        }
    };

    const handleDropCover = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingCover(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            const error = validateImageFile(file);
            if (error) {
                setImageErrors(prev => ({ ...prev, cover: error }));
                ToastNot(error);
                return;
            }
            setImageErrors(prev => ({ ...prev, cover: undefined }));
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
    }, [locale, accessToken, t]);

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
    }, [countryId, search, accessToken, t]);

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
                    {/* Basic Information Section */}
                    <div className={styles.formSection}>
                        {/* Page Name */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('form.pageName')}</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                                    {...register("name", {
                                        required: t('errors.required', { field: t('form.pageName') }),
                                        maxLength: {
                                            value: 100,
                                            message: t('errors.maxLength', { field: t('form.pageName'), max: 100 }),
                                        },
                                    })}
                                />
                                {errors.name && (
                                    <p className={styles.errorText}>{errors.name.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Page Slug with live checking */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('form.pageSlug')}</label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.inputWithIcon}>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.slug || slugStatus.available === false ? styles.inputError : ""
                                            } ${slugStatus.available === true ? styles.inputSuccess : ""}`}
                                        {...register("slug", {
                                            required: t('errors.required', { field: t('form.pageSlug') }),
                                            maxLength: {
                                                value: 100,
                                                message: t('errors.maxLength', { field: t('form.pageSlug'), max: 100 }),
                                            },
                                            pattern: {
                                                value: /^[a-z0-9-]+$/,
                                                message: "Slug can only contain lowercase letters, numbers, and hyphens",
                                            },
                                        })}
                                    />
                                    {slugStatus.checking && (
                                        <Loader2 className={styles.statusIcon} />
                                    )}
                                    {!slugStatus.checking && slugStatus.available === true && (
                                        <Check className={`${styles.statusIcon} ${styles.successIcon}`} />
                                    )}
                                    {!slugStatus.checking && slugStatus.available === false && (
                                        <AlertCircle className={`${styles.statusIcon} ${styles.errorIcon}`} />
                                    )}
                                </div>
                                {errors.slug && (
                                    <p className={styles.errorText}>{errors.slug.message}</p>
                                )}
                                {!errors.slug && slugStatus.message && (
                                    <p className={`${styles.statusText} ${slugStatus.available === false ? styles.errorText : styles.successText
                                        }`}>
                                        {slugStatus.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Website URL */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('form.pageWebsite')}</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="url"
                                    className={`${styles.input} ${errors.websiteUrl ? styles.inputError : ""}`}
                                    {...register("websiteUrl", {
                                        required: t('errors.required', { field: t('form.pageWebsite') }),
                                        pattern: {
                                            value: /^https?:\/\/.+/,
                                            message: "Please enter a valid URL",
                                        },
                                    })}
                                />
                                {errors.websiteUrl && (
                                    <p className={styles.errorText}>{errors.websiteUrl.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className={styles.formSection}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('form.pageMedia')}</label>
                            <div className={styles.media}>
                                {/* Avatar Upload */}
                                <div className={styles.mediaItem}>
                                    <span className={styles.mediaLabel}>{t('form.avatar')}</span>
                                    <div
                                        className={`${styles.AvatarUploadContainer} ${imageErrors.avatar ? styles.inputError : ""
                                            } ${isDraggingAvatar ? styles.dragging : ""}`}
                                        onClick={handleAvatarClick}
                                        onDragEnter={handleDragEnterAvatar}
                                        onDragOver={handleDragOverAvatar}
                                        onDragLeave={handleDragLeaveAvatar}
                                        onDrop={handleDropAvatar}
                                    >
                                        {avatarPreview ? (
                                            <div className={styles.avatarPreviewWrapper}>
                                                <div className={styles.avatarPreview}>
                                                    <Image
                                                        src={avatarPreview}
                                                        alt="Avatar preview"
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
                                                    {isDraggingAvatar
                                                        ? t('form.dropImage')
                                                        : t('form.clickOrDrag')}
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={avatarInputRef}
                                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                            className={styles.fileInput}
                                            onChange={handleAvatarChange}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                    {imageErrors.avatar && (
                                        <p className={styles.errorText}>{imageErrors.avatar}</p>
                                    )}
                                </div>

                                {/* Cover Upload */}
                                <div className={styles.mediaItem}>
                                    <span className={styles.mediaLabel}>{t('form.cover')}</span>
                                    <div
                                        className={`${styles.imageUploadContainer} ${imageErrors.cover ? styles.inputError : ""
                                            } ${isDraggingCover ? styles.dragging : ""}`}
                                        onClick={handleImageClick}
                                        onDragEnter={handleDragEnterCover}
                                        onDragOver={handleDragOverCover}
                                        onDragLeave={handleDragLeaveCover}
                                        onDrop={handleDropCover}
                                    >
                                        {imagePreview ? (
                                            <div className={styles.imagePreviewWrapper}>
                                                <div className={styles.imagePreview}>
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Cover preview"
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
                                                    {isDraggingCover
                                                        ? t('form.dropImage')
                                                        : t('form.clickOrDrag')}
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                            className={styles.fileInput}
                                            onChange={handleImageChange}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                    {imageErrors.cover && (
                                        <p className={styles.errorText}>{imageErrors.cover}</p>
                                    )}
                                </div>
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

                    {/* Why, What, How Section */}
                    <div className={styles.formSection}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('form.why')}</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.why ? styles.inputError : ""}`}
                                        {...register("why", {
                                            required: t('errors.required', { field: t('form.why') }),
                                            maxLength: {
                                                value: 100,
                                                message: t('errors.maxLength', { field: t('form.why'), max: 100 }),
                                            },
                                        })}
                                    />
                                    {errors.why && (
                                        <p className={styles.errorText}>{errors.why.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('form.what')}</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.what ? styles.inputError : ""}`}
                                        {...register("what", {
                                            required: t('errors.required', { field: t('form.what') }),
                                            maxLength: {
                                                value: 100,
                                                message: t('errors.maxLength', { field: t('form.what'), max: 100 }),
                                            },
                                        })}
                                    />
                                    {errors.what && (
                                        <p className={styles.errorText}>{errors.what.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('form.how')}</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors.how ? styles.inputError : ""}`}
                                        {...register("how", {
                                            required: t('errors.required', { field: t('form.how') }),
                                        })}
                                    />
                                    {errors.how && (
                                        <p className={styles.errorText}>{errors.how.message}</p>
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

                    {/* Category and Topic */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('form.category')}</label>
                            <div className={styles.inputWrapper}>
                                <select
                                    className={`${styles.select} ${errors.category ? styles.inputError : ""}`}
                                    {...register("category", {
                                        required: t('errors.required', { field: t('form.category') })
                                    })}
                                >
                                    <option value="">{t('form.selectCategory')}</option>
                                    {["Project", "Business"].map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className={styles.errorText}>{errors.category.message}</p>
                                )}
                            </div>
                        </div>

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
                    </div>

                    {/* Submit Buttons */}
                    <div className={styles.submitContainer}>
                        <button
                            type="button"
                            onClick={() => setAddNew(false)}
                            className={styles.cancelButton}
                        >
                            {t('form.cancel')}
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            {t('form.createPage')}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddNewPage;