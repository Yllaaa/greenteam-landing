/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";
import styles from "./AddNewProduct.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";

function ContactModal(props: any) {
  const { contacts, setShowContacts } = props;

  const closeModal = useCallback(() => {
    setShowContacts(false);
  }, [setShowContacts]);

  const modalRef = useOutsideClick(closeModal);

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontact}>
          <h2 className={styles.title}>Contact seller</h2>
          <h2 className={styles.title}>{contacts}</h2>
          {/* Text Area */}
        </div>
      </div>
    </>
  );
}

export default ContactModal;
