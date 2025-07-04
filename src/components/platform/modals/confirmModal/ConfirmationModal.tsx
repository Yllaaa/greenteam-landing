/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef } from "react";
import styles from "./ConfirmationModal.module.css"; // Renamed to be more generic
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  apiEndpoint?: string;
  itemId?: string | number;
  successMessage?: string;
  errorMessage?: string;
  customAction?: () => Promise<any>;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmButtonText = "Yes",
  cancelButtonText = "No",
  apiEndpoint,
  itemId,
  successMessage = "Operation completed successfully",
  errorMessage = "An error occurred",
  customAction
}: ConfirmationModalProps) {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, onClose]);

  const handleConfirm = async () => {
    try {
      if (customAction) {
        // If a custom action is provided, use it
        await customAction();
        ToastNot(successMessage);
        onClose();
        onConfirm();
      } else if (apiEndpoint && itemId) {
        // Otherwise use the default DELETE operation
        const response = await axios.delete(
          `${apiEndpoint}/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response) {
          ToastNot(successMessage);
          onClose();
          onConfirm();
        }
      }
    } catch (error) {
      console.error(error);
      ToastNot(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.modalcontent}>
        <p>{title}</p>
        <div className={styles.buttons}>
          <button
            onClick={handleConfirm}
            className={styles.modalButton}
          >
            {confirmButtonText}
          </button>
          <button
            onClick={onClose}
            className={styles.modalButton}
          >
            {cancelButtonText}
          </button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}

export default ConfirmationModal;