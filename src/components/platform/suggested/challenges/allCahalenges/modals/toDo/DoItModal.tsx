/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import styles from "./DoItModal.module.css";
import ToastNot from "@/Utils/ToastNotification/ToastNot";

function DoItModal(props: any) {
  const { setDoItModal } = props;

  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setDoItModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setDoItModal]);

  const closeModal = () => {
    setDoItModal(false);
  };

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontent}>
          <p>Are You Sure You Want To Do It</p>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                closeModal();
                ToastNot("you selected yes");
              }}
              className={styles.modalButton}
            >
              Yes
            </button>
            <button
              onClick={() => {
                closeModal();
                ToastNot("you selected no");
              }}
              className={styles.modalButton}
            >
              No
            </button>
          </div>
          <button className={styles.closeButton} onClick={closeModal}>
            &times;
          </button>
        </div>
      </div>
    </>
  );
}

export default DoItModal;
