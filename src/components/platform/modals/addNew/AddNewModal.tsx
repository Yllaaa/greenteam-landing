/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import styles from "./AddNewModal..module.css";

function AddNewModal(props: any) {
  const { setAddNew } = props;

  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setAddNew(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setAddNew]);

  const closeModal = () => {
    setAddNew(false);
  };

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontent}>
          <p>ada</p>
          <button className={styles.closeButton} onClick={closeModal}>
            &times;
          </button>
        </div>
      </div>
    </>
  );
}

export default AddNewModal;
