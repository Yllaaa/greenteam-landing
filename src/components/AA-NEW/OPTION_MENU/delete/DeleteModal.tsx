// components/DeleteModal/DeleteModal.tsx
"use client"
import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import styles from "./DeleteModal.module.scss"
import { useTranslations } from "next-intl"
import { AiOutlineWarning } from "react-icons/ai"
import { IoClose } from "react-icons/io5"

interface DeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
    itemType: 'posts' | 'forum' | 'product' | 'page' | 'group'
    itemTitle?: string
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemType,
    itemTitle
}) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [mounted, setMounted] = useState(false)
    const t = useTranslations("common.deleteModal")

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!mounted || !isOpen) return null

    const handleConfirm = async () => {
        setIsDeleting(true)
        try {
            await onConfirm()
            onClose()
        } catch (error) {
            console.error("Delete failed:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isDeleting) {
            onClose()
        }
    }

    const modalContent = (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{t("title", { type: t(`types.${itemType}`) })}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        disabled={isDeleting}
                        aria-label="Close"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.warningIcon}>
                        <AiOutlineWarning size={48} />
                    </div>

                    <p className={styles.message}>
                        {t("message", { type: t(`types.${itemType}`) })}
                    </p>

                    {itemTitle && (
                        <p className={styles.itemTitle}> {itemTitle}</p>
                    )}

                    <p className={styles.warning}>{t("warning")}</p>
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        {t("cancel")}
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={handleConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <span className={styles.spinner} />
                                {t("deleting")}
                            </>
                        ) : (
                            t("confirm")
                        )}
                    </button>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}