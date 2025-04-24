/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from "react";
import styles from "./reportModal.module.css";
import { useForm } from "react-hook-form";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import preventBackgroundScroll from "@/hooks/preventScroll/preventBackroundScroll";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { useParams } from "next/navigation";

function Report(props: {
  setReport: React.Dispatch<React.SetStateAction<boolean>>;
  report: boolean;
  user: string;
  reportedId: string;
  reportedType: string;
}) {
  const params = useParams();
  console.log(params);

  const accessToken = useAppSelector((state) => state.login.accessToken);
  const { setReport, reportedId, reportedType } = props;
  const closeModal = useCallback(() => {
    setReport(false);
  }, [setReport]);

  const modalRef = useOutsideClick(closeModal);

  useEffect(() => {
    preventBackgroundScroll(true);

    return () => {
      preventBackgroundScroll(false);
    };
  }, []);

  // Form handling
  const { register, handleSubmit } = useForm<any>({
    defaultValues: {
      reportedId: "",
      reportedType: "user",
      reason: "",
    },
  });

  const onSubmit = async (formData: any) => {
    // Create FormData object
    const formDataToSend = new FormData();
    // Append text fields
    formDataToSend.append("reason", formData.content);
    console.log(formData.reason);

    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/actions/report`,
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
        )
        .then((res) => {
          console.log(res.data);
          ToastNot("success");
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
      ToastNot("Error occurred while adding post");
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <div ref={modalRef} className={styles.modalcontent}>
          <form className={styles.forumForm} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.title}>
              Talk about the issue you are facing
            </h2>
            {/* Text Area */}
            <textarea
              placeholder="Type your reason..."
              className={styles.textArea}
              {...register("reason", { required: true })}
            />
            <div className={styles.buttons}>
              {/* Submit Button */}
              <input type="submit" className={styles.submit} value="Post" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Report;
