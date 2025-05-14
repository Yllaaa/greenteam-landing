/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import styles from "./DoItModal.module.css";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";

function DoItModal(props: any) {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const { setDoItModal, challengeId, section } = props;

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
  const acceptDo = () => {
    try {
      axios
        .post(
          `${
            process.env.NEXT_PUBLIC_BACKENDAPI
          }/api/v1/challenges/green-challenges/${challengeId}/${
            section === "green-challenges" ? "add-to-do" : "mark-as-done"
          }`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res) {
            ToastNot("challenge marked as done");
            setDoItModal(false);
          }
        })
        .catch((err) => {
          console.log(err);
          ToastNot("error occurred while marking challenge as done");
        });
    } catch {
      ToastNot("error occurred while marking challenge as done");
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontent}>
          <p>Do It and create an impact on this word</p>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                acceptDo();
              }}
              className={styles.modalButton}
            >
              Yes
            </button>
            <button
              onClick={() => {
                closeModal();
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
