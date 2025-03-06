/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRef, useEffect, useState } from "react";
import { getMessageItems, Message, NextCursor } from "./messages.data";
import styles from "./messages.module.scss";
import Item from "./Item";
import Empty from "./empty/Empty";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";

export default function Messages({
  chatId,
  messages,
  setMessages,
  // newMessage,
  nextCursor,
  setNextCursor,
  selectedUser,
}: // inputValue,
{
  chatId: string;
  messages: Message[];
  selectedUser: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  newMessage: string;
  nextCursor: NextCursor | null;
  setNextCursor: React.Dispatch<React.SetStateAction<NextCursor | null>>;
  // inputValue: boolean;
}) {
  const token = getToken();

  const [loading, setLoading] = useState(false);
  const messagesDivRef = useRef<HTMLDivElement>(null);

  // Scrolls to the bottom of the message container
  function scrollToBottom() {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
    }
  }

  // Function to load messages with pagination support
  async function loadMessages() {
    if (!chatId || loading) return; // Prevent fetching if already loading
    setLoading(true);
    console.log(chatId);

    try {
      const messages = await getMessageItems(
        chatId,
        
        20
      );

      if (
        messages?.messages?.messages &&
        messages?.messages?.messages?.length > 0
      ) {
        setMessages((prev: any) => [...prev, ...messages?.messages.messages]);
        setNextCursor(messages.nextCursor);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Reset messages when the chatId changes
    setMessages([]);
    setNextCursor({
      id: "",
      sentAt: "",
    });
    loadMessages();
  }, [chatId, selectedUser]);

  useEffect(() => {
    const limit = 20;

    if (!nextCursor) return;

    const query = nextCursor
      ? `cursor[id]=${nextCursor?.id}&cursor[sentAt]=${nextCursor.sentAt}&limit=${limit}`
      : `limit=${limit}`;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations/${chatId}/messages?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      )
      .then((res) => {
        // console.log("nextres", res.data);

        setMessages((prev: any) => [...prev, ...res.data.messages]);
        if (res.data.nextCursor) {
          setNextCursor(res.data.nextCursor);
        }
      })
      .catch((err) => console.error(err));
  }, [nextCursor,  selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.messages} ref={messagesDivRef}>
      {messages?.length === 0 && <Empty />}
      {messages?.map((message, index) => (
        <Item key={index} {...message} />
      ))}
      {loading && <p>Loading more messages...</p>}
    </div>
  );
}
