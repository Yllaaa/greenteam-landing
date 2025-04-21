/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { getToken } from "@/Utils/userToken/LocalToken";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MessageModal.module.css";
import { useForm } from "react-hook-form";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import preventBackgroundScroll from "@/hooks/preventScroll/preventBackroundScroll";
import axios from "axios";
import io, { Socket } from "socket.io-client";

function MessageModal(props: any) {
  const SOCKET_URL = "https://greenteam.yllaaa.com/api/v1/chat";
  const token = getToken();
  const accessToken = token ? token.accessToken : "";
  const socketRef = useRef<Socket | null>(null);

  const { setMessage, sellerId, sellerType } = props;

  // useEffect(() => {
  //   if (!sellerId) return;

  //   // Function to initialize WebSocket connection
  //   const connectSocket = () => {
  //     socketRef.current = io(SOCKET_URL, {
  //       transports: ["websocket"],
  //       auth: { token: accessToken },
  //     });

  //     socketRef.current.on("connect", () =>
  //       console.log("Connected to WebSocket")
  //     );

  //     socketRef.current.on("newMessage", (message: any) => {
  //       console.log("testNew", message);

  //       if (message.conversationId === chatId) {
  //         console.log("Received message:", message);
  //         setMessages((prev) => [...prev, message]);
  //       }
  //       console.log("user:", chatId);

  //       console.log("New message:", message);
  //     });

  //     socketRef.current.on("exception", (error: any) =>
  //       console.error("Socket exception:", error)
  //     );
  //   };

  //   connectSocket();

  //   return () => {
  //     // clearInterval(interval);
  //     socketRef.current?.disconnect();
  //   };
  // }, [selectedUser]);

  useEffect(() => {
    const connectSocket = () => {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { token: accessToken },
      });

      socketRef.current.on("connect", () =>
        console.log("Connected to WebSocket")
      );
    };
    connectSocket();
  }, [sellerId]);

  const [newMessage, setNewMessage] = useState<string>("");
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
  const sendMessage = async () => {
    if (!newMessage.trim() || !sellerId || !socketRef.current?.connected)
      return;

    const messageData:
      | {
          content: string;
          recipient: { id: string; type: string };
        }
      | any = {
      content: newMessage,
      recipient: { id: sellerId, type: sellerType },
    };

    socketRef.current.emit("sendMessage", messageData, (response: any) => {
      if (response?.success) {
        setNewMessage("");
        closeModal();
      } else {
        console.log(response);
        console.error("Failed to send message", response?.error);
      }
    });
  };

  // Form handling
  const { reset, handleSubmit } = useForm<any>({
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
              // {...register("content", { required: true })}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            {/* Submit Button */}
            <button onClick={handleSubmit(sendMessage)}>SEND</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default MessageModal;
