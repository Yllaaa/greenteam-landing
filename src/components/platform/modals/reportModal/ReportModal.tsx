/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ReportModal/ReportModal.tsx
import React, { useCallback, useEffect } from "react";
import styles from "./ReportModal.module.scss";
import { useForm } from "react-hook-form";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import preventBackgroundScroll from "@/hooks/preventScroll/preventBackroundScroll";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { getToken } from "@/Utils/userToken/LocalToken";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedId: string;
  reportedType: string;
  title?: string;
  successCallback?: () => void;
}

function ReportModal({
  isOpen,
  onClose,
  reportedId,
  reportedType,
  title = "Talk about the issue you are facing",
  successCallback
}: ReportModalProps) {
  // Get token
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  
  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  // Use the useOutsideClick hook
  const modalRef = useOutsideClick(closeModal);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      preventBackgroundScroll(true);
    }
    
    return () => {
      preventBackgroundScroll(false);
    };
  }, [isOpen]);

  // Form handling
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      reportedId: "",
      reportedType: "",
      reason: "",
    },
  });

  const onSubmit = async (formData: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/actions/report`,
        {
          reportedId: reportedId,
          reportedType: reportedType,
          reason: formData.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response) {
        ToastNot("Report submitted successfully");
        reset();
        onClose();
        
        if (successCallback) {
          successCallback();
        }
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      ToastNot("Error occurred while submitting report");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.modalcontent}>
        <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
          <h2 className={styles.title}>{title}</h2>
          {/* Text Area */}
          <textarea
            placeholder="Type your reason..."
            className={styles.textArea}
            {...register("reason", { required: true })}
          />
          <div className={styles.buttons}>
            {/* Submit Button */}
            <input type="submit" className={styles.submit} value="Report" />
            {/* Cancel Button */}
            <button 
              type="button" 
              onClick={closeModal}
              className={styles.cancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportModal;