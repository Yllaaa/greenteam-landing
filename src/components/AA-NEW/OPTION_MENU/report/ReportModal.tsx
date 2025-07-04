// components/ReportModal/ReportModal.tsx
"use client"
import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import styles from "./ReportModal.module.scss"
import { useTranslations } from "next-intl"
import { IoClose } from "react-icons/io5"
import { MdReportProblem } from "react-icons/md"

interface ReportModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (reason: string) => Promise<void>
    itemType: 'post' | 'forum' | 'product' | 'page' | 'group'
    itemId: string
}

interface FormData {
    reason: string
}

export const ReportModal: React.FC<ReportModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    itemType,
    // itemId
}) => {
    const [mounted, setMounted] = useState(false)
    const t = useTranslations("common.reportModal")

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        watch
    } = useForm<FormData>({
        defaultValues: {
            reason: ''
        }
    })

    const reasonValue = watch('reason')

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
            reset()
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, reset])

    if (!mounted || !isOpen) return null

    const onFormSubmit = async (data: FormData) => {
        try {
            await onSubmit(data.reason)
            reset()
            onClose()
        } catch (error) {
            console.error("Report error:", error)
            // Error is handled in parent component
        }
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isSubmitting) {
            onClose()
        }
    }

    const modalContent = (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.titleWrapper}>
                        <MdReportProblem className={styles.icon} />
                        <h2>{t("title", { type: t(`types.${itemType}`) })}</h2>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="reason" className={styles.label}>
                            {t("reasonLabel")}
                        </label>
                        <input
                            {...register('reason', {
                                required: t("errors.provideReason"),
                                minLength: {
                                    value: 10,
                                    message: t("errors.tooShort")
                                },
                                maxLength: {
                                    value: 200,
                                    message: t("errors.tooLong")
                                }
                            })}
                            id="reason"
                            type="text"
                            className={`${styles.input} ${errors.reason ? styles.error : ''}`}
                            placeholder={t("reasonPlaceholder")}
                            disabled={isSubmitting}
                            autoFocus
                            autoComplete="off"
                        />
                        <div className={styles.inputFooter}>
                            <span className={styles.charCount}>
                                {reasonValue.length}/200
                            </span>
                            {errors.reason && (
                                <span className={styles.errorMessage}>
                                    {errors.reason.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className={styles.spinner} />
                                    {t("submitting")}
                                </>
                            ) : (
                                t("submit")
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}