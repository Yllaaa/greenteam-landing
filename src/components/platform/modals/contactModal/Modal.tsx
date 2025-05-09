import React, { useEffect } from "react";
import styles from "./Modal.module.scss";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    hideCloseButton?: boolean;
    overlayClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className = "",
    hideCloseButton = false,
    overlayClassName = "",
}) => {
    const modalRef = useOutsideClick(onClose);

    // Close on escape key
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscKey);
        return () => document.removeEventListener("keydown", handleEscKey);
    }, [isOpen, onClose]);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Use portal to render modal at the root level
    return createPortal(
        <div className={`${styles.modalOverlay} ${overlayClassName}`}>
            <div
                ref={modalRef}
                className={`${styles.modalContainer} ${className}`}
                role="dialog"
                aria-modal="true"
            >
                {title && (
                    <div className={styles.modalHeader}>
                        <h2>{title}</h2>
                        {!hideCloseButton && (
                            <button
                                onClick={onClose}
                                className={styles.closeButton}
                                aria-label="Close modal"
                            >
                                <IoClose />
                            </button>
                        )}
                    </div>
                )}
                <div className={styles.modalContent}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;