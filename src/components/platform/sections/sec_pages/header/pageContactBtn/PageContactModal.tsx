/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { X, Loader2, Mail, Phone, User, Briefcase, Trash2, Edit3 } from "lucide-react";
import styles from "./PageContactModal.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { preventBackgroundScroll } from "@/hooks/preventScroll/preventBackroundScroll";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useTranslations } from "next-intl";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

interface Contact {
    id: string;
    pageId: string;
    name: string;
    title: string;
    email: string;
    phoneNum: string;
}

interface ContactFormData {
    name: string;
    title: string;
    email: string;
    phoneNum: string;
}

interface PageContactModalProps {
    slug: string;
    contact: Contact | null;
    hasContact: boolean;
    onClose: () => void;
}

const PageContactModal: React.FC<PageContactModalProps> = ({
    slug,
    contact,
    hasContact,
    onClose
}) => {
    const t = useTranslations('web.pageContact.modal');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(!hasContact);

    const token = getToken();
    const accessToken = token ? token.accessToken : null;

    const modalRef = useOutsideClick(onClose);

    useEffect(() => {
        preventBackgroundScroll(true);
        return () => {
            preventBackgroundScroll(false);
        };
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        defaultValues: {
            name: contact?.name || "",
            title: contact?.title || "",
            email: contact?.email || "",
            phoneNum: contact?.phoneNum || "",
        },
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        try {
            if (hasContact && contact) {
                // Update existing contact
                await axios.put(
                    `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${slug}/contact`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                ToastNot(t('success.updated'));
            } else {
                // Add new contact
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${slug}/add-contact`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                ToastNot(t('success.added'));
            }

            onClose();
        } catch (error: any) {
            console.error("Error saving contact:", error);
            ToastNot(error.response?.data?.message || t('errors.saveFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(t('confirmDelete'))) return;

        setIsDeleting(true);

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${slug}/contact`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            ToastNot(t('success.deleted'));
            onClose();
        } catch (error: any) {
            console.error("Error deleting contact:", error);
            ToastNot(error.response?.data?.message || t('errors.deleteFailed'));
        } finally {
            setIsDeleting(false);
        }
    };

    return ReactDOM.createPortal(
        <div className={styles.modal}>
            <div ref={modalRef} className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        {hasContact ? t('editTitle') : t('addTitle')}
                    </h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X className={styles.closeIcon} />
                    </button>
                </div>

                <p className={styles.modalDescription}>{t('description')}</p>

                {hasContact && contact && !isEditing ? (
                    <div className={styles.contactDisplay}>
                        <div className={styles.contactInfo}>
                            <div className={styles.infoItem}>
                                <User className={styles.infoIcon} />
                                <div>
                                    <span className={styles.infoLabel}>{t('form.name')}</span>
                                    <span className={styles.infoValue}>{contact.name}</span>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <Briefcase className={styles.infoIcon} />
                                <div>
                                    <span className={styles.infoLabel}>{t('form.title')}</span>
                                    <span className={styles.infoValue}>{contact.title}</span>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <Mail className={styles.infoIcon} />
                                <div>
                                    <span className={styles.infoLabel}>{t('form.email')}</span>
                                    <span className={styles.infoValue}>{contact.email}</span>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <Phone className={styles.infoIcon} />
                                <div>
                                    <span className={styles.infoLabel}>{t('form.phoneNum')}</span>
                                    <span className={styles.infoValue}>{contact.phoneNum}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.actionButtons}>
                            <button
                                className={styles.editButton}
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit3 className={styles.buttonIcon} />
                                {t('form.edit')}
                            </button>

                            <button
                                className={styles.deleteButton}
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className={styles.spinner} />
                                ) : (
                                    <Trash2 className={styles.buttonIcon} />
                                )}
                                {isDeleting ? t('form.deleting') : t('form.delete')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <User className={styles.labelIcon} />
                                {t('form.name')}
                            </label>
                            <input
                                type="text"
                                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                                {...register("name", {
                                    required: t('errors.required', { field: t('form.name') }),
                                })}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className={styles.errorText}>{errors.name.message}</p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <Briefcase className={styles.labelIcon} />
                                {t('form.title')}
                            </label>
                            <input
                                type="text"
                                className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
                                {...register("title", {
                                    required: t('errors.required', { field: t('form.title') }),
                                })}
                                placeholder="CEO / Manager"
                            />
                            {errors.title && (
                                <p className={styles.errorText}>{errors.title.message}</p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <Mail className={styles.labelIcon} />
                                {t('form.email')}
                            </label>
                            <input
                                type="email"
                                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                                {...register("email", {
                                    required: t('errors.required', { field: t('form.email') }),
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: t('errors.invalidEmail'),
                                    },
                                })}
                                placeholder="email@example.com"
                            />
                            {errors.email && (
                                <p className={styles.errorText}>{errors.email.message}</p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <Phone className={styles.labelIcon} />
                                {t('form.phoneNum')}
                            </label>
                            <input
                                type="tel"
                                className={`${styles.input} ${errors.phoneNum ? styles.inputError : ""}`}
                                {...register("phoneNum", {
                                    required: t('errors.required', { field: t('form.phoneNum') }),
                                })}
                                placeholder="+1234567890"
                            />
                            {errors.phoneNum && (
                                <p className={styles.errorText}>{errors.phoneNum.message}</p>
                            )}
                        </div>

                        <div className={styles.formActions}>
                            {hasContact && (
                                <button
                                    type="button"
                                    className={styles.cancelEditButton}
                                    onClick={() => {
                                        setIsEditing(false);
                                        reset();
                                    }}
                                >
                                    {t('form.cancel')}
                                </button>
                            )}

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className={styles.spinner} />
                                        {hasContact ? t('form.updating') : t('form.saving')}
                                    </>
                                ) : (
                                    hasContact ? t('form.update') : t('form.save')
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
};

export default PageContactModal;