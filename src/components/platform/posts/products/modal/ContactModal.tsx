/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import styles from "./AddNewProduct.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import axios from "axios";

function ContactModal(props: any) {
  const { setShowContacts, sellerId, accessToken } = props;

  const closeModal = useCallback(() => {
    setShowContacts(false);
  }, [setShowContacts]);

  const [contact, setContact] = useState([
    {
      id: "",
      name: "",
      title: "",
      email: "",
      phoneNum: "",
    },
  ]);
  useEffect(() => {
    if (!accessToken) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${sellerId}/contact-by-id`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setContact(response.data);
        console.log("Contact data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching contact data:", error);
      });
  }, [accessToken, sellerId]);

  const modalRef = useOutsideClick(closeModal);

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontact}>
          {contact.length > 0 ? (
            contact.map((item: any) => (
              <>
                <div className={styles.single}>
                  <h2 className={styles.title}>
                    Name: <span>{item.name}</span>
                  </h2>
                  <h2 className={styles.title}>
                    Title: <span>{item.name}</span>
                  </h2>
                  <h2 className={styles.title}>
                    Email: <span>{item.email}</span>
                  </h2>
                  <h2 className={styles.title}>
                    Phone Number: <span>{item.phoneNum}</span>
                  </h2>
                </div>
              </>
            ))
          ) : (
            <div className={styles.single}>
              <h2>No Contacts Found</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ContactModal;
