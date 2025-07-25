/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import styles from "./chat.module.scss";
import Input from "./input/Input";
import Messages from "./messages/Messages";
import Persons from "./persons/Persons";
import { getToken } from "@/Utils/userToken/LocalToken";
import { Message, NextCursor } from "./messages/messages.data";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";

const SOCKET_URL = "https://greenteam.yllaaa.com/api/v1/chat";

export default function Chat() {
  const params = useSearchParams()
  const extraPerson = params && params.get("chatFullName") || ""; // Get extra person from URL params
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const socketRef = useRef<Socket | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  const [chatId, setChatId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<NextCursor | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [inputValue, setInputValue] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const paramChatId = searchParams?.get("chatId") || null;
    if (paramChatId) {
      setChatId(paramChatId);
      setShowMessages(true);

      // Fetch the conversation to get the user info
      axios.get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations/${paramChatId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((res) => {
          // Assuming the response contains the contact/user info
          if (res.data?.contact?.id) {
            setSelectedUser(res.data.contact.id);
          }
        })
        .catch((err) => console.error("Error fetching conversation:", err));
    }
  }, [searchParams, accessToken]);

  // Handle URL params on initial load and when they change
  useEffect(() => {
    const paramChatId = searchParams?.get("chatId");
    if (paramChatId) {
      setChatId(paramChatId);
      setShowMessages(true); // Show messages view on mobile when chat ID is present
    }
  }, [searchParams]);

  useEffect(() => {
    if (!chatId || !token?.accessToken) return;

    const accessToken = token.accessToken;

    // Function to initialize WebSocket connection
    const connectSocket = () => {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { token: accessToken },
      });

      socketRef.current.on("connect", () =>
        console.log("Connected to WebSocket")
      );

      socketRef.current.on("newMessage", (message: any) => {
        console.log("Received new message:", message);

        if (message.conversationId === chatId) {
          setMessages((prev) => {
            // Check if message already exists to avoid duplicates
            const messageExists = prev.some(m => m.id === message.id);
            if (!messageExists) {
              return [...prev, message];
            }
            return prev;
          });

          setShouldScrollToBottom(true);
        }
      });

      socketRef.current.on("exception", (error: any) =>
        console.error("Socket exception:", error)
      );
    };

    connectSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatId, token]);

  const sendMessage = async () => {
    console.log("sendMessage called", {
      newMessage,
      chatId,
      selectedUser,
      socketConnected: socketRef.current?.connected,
      socketRef: socketRef.current
    });

    if (!newMessage.trim() || !chatId || !socketRef.current?.connected) {
      console.log("Message not sent - missing requirements:", {
        hasMessage: !!newMessage.trim(),
        hasChatId: !!chatId,
        isConnected: socketRef.current?.connected
      });
      return;
    }

    // If you have a chatId but no selectedUser, you might need to handle this differently
    const messageData = chatId && {
      content: newMessage,
      recipient: { id: chatId, type: "user" },
    };

    console.log("Sending message data:", messageData);

    socketRef.current.emit("sendMessage", messageData, (response: any) => {
      console.log("Send message response:", response);
      if (response?.success) {
        setNewMessage("");
        setShouldScrollToBottom(true);
        setRefresh(!refresh); // Trigger a refresh to update messages
        console.log("Message sent successfully");
        setSelectedUser(response?.conversationId);
      } else {
        console.error("Failed to send message", response?.error);
      }
    });
  };

  // Handle back button on mobile
  const handleBackToUsers = () => {
    setShowMessages(false);
    // Keep the URL consistent by removing the chatId parameter
    router.push(`/${locale}/chat`);
  };

  const t = useTranslations("web.chat");

  // Handle loading state when searchParams is null
  if (searchParams === null) {
    return (
      <div className={styles.chat}>
        <div className={styles.header}><p><span>{t("message")}</span>{" "}<span>{extraPerson}</span></p></div>
        <div className={styles.content}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chat}>
      <div className={styles.header}>
        {showMessages && (
          <button onClick={handleBackToUsers} className={styles.backButton}>
            ← {t("back")}
          </button>
        )}
        <p><span>{t("message")}</span>{" "}<span>{extraPerson}</span></p>
      </div>
      <div className={styles.content}>
        <div
          className={`${styles.personsContainer} ${showMessages ? styles.hiddenOnMobile : ""
            }`}
        >
          <Persons
            chatId={chatId}
            setChatId={(id) => {
              setChatId(id);
              // router.push(`/${locale}/chat?chatId=${id}&chatType=user&chatName=${chat.contact.username}&chatFullName=${chat.contact.fullName}`);
              setShowMessages(true);
            }}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            newMessage={newMessage}
          />
        </div>

        <div
          className={`${styles.messagesView} ${showMessages ? styles.visibleOnMobile : styles.hiddenOnMobile
            }`}
        >
          {chatId ? (
            <>
              <Messages
                chatId={chatId}
                messages={messages}
                setMessages={setMessages}
                newMessage={newMessage}
                nextCursor={nextCursor}
                setNextCursor={setNextCursor}
                selectedUser={selectedUser}
                shouldScrollToBottom={shouldScrollToBottom}
                setShouldScrollToBottom={setShouldScrollToBottom}
                refresh={refresh}
              />
              <Input
                chatId={chatId}
                selectedUser={selectedUser}
                setMessages={setMessages}
                setNewMessage={setNewMessage}
                inputValue={inputValue}
                setInputValue={setInputValue}
                newMessage={newMessage}
                sendMessageHandler={sendMessage}
              />
            </>
          ) : (
            <div className={styles.noSelection}>
              {t("select")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}