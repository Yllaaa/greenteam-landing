/* eslint-disable @typescript-eslint/no-explicit-any */
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { getToken } from "@/Utils/userToken/LocalToken";
import React, { useCallback, useEffect } from "react";
import styles from "./MessageModal.module.css";
import { useForm } from "react-hook-form";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import preventBackgroundScroll from "@/hooks/preventScroll/preventBackroundScroll";
import axios from "axios";

function MessageModal(props: any) {
  const token = getToken();
  const accessToken = token ? token.accessToken : "";

  const { setMessage, sellerId, sellerType } = props;

  const closeModal = useCallback(() => {
    setMessage(false);
  }, [setMessage]);

  const modalRef = useOutsideClick(closeModal);

  useEffect(() => {
    preventBackgroundScroll(true);

    return () => {
      preventBackgroundScroll(false);
    };
  }, []);
  // Form handling
  const { register, reset, handleSubmit } = useForm<any>({
    defaultValues: {
      content: "",
      recipient: {
        id: "",
        type: "",
      },
    },
  });

  const onSubmit = async (formData: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat`,
        {
          content: formData.content,
          recipient: {
            id: sellerId,
            type: sellerType,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response) {
        ToastNot(`Post added successfully`);
        reset();
        setMessage(false);
      }

      ToastNot(`Post added successfully`);
      reset();
    } catch (err) {
      console.log(err);
      ToastNot("error occurred while adding post");
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontent}>
          <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.title}>Contact seller</h2>
            {/* Text Area */}
            <textarea
              placeholder="Add your experiences and tips to make a better future."
              className={styles.textArea}
              {...register("content", { required: true })}
            />
            {/* Submit Button */}
            <button onClick={handleSubmit(onSubmit)}>SEND</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default MessageModal;
