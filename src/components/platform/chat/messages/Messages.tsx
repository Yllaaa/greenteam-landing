/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRef, useEffect, useState } from "react";
import { getMessageItems, Message, NextCursor } from "./messages.data";
import styles from "./messages.module.scss";
import Item from "./Item";
import Empty from "./empty/Empty";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useSearchParams } from "next/navigation";

export default function Messages({
  chatId,
  messages,
  setMessages,
  nextCursor,
  setNextCursor,
  selectedUser,
  shouldScrollToBottom,
  setShouldScrollToBottom,
  refresh,
}: {
  chatId: string;
  messages: Message[];
  selectedUser: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  newMessage: string;
  nextCursor: NextCursor | null;
  setNextCursor: React.Dispatch<React.SetStateAction<NextCursor | null>>;
  shouldScrollToBottom: boolean;
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
  refresh?: boolean;
}) {
  const token = getToken();
  const chatIdParam = useSearchParams().get("chatId");

  // Use the URL param if available, otherwise use the prop
  const activeChatId = chatIdParam || chatId;

  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesDivRef = useRef<HTMLDivElement>(null);

  // Ref to track scroll position
  const scrollPositionRef = useRef<number>(0);
  // Ref to store the height before loading more messages
  const prevHeightRef = useRef<number>(0);
  // Ref to track if initial load has happened
  const initialLoadCompleted = useRef<boolean>(false);

  // Function to scroll to the bottom of messages
  function scrollToBottom() {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
    }
  }

  // Handle scrolling to bottom when new messages arrive
  useEffect(() => {
    if (shouldScrollToBottom && messagesDivRef.current) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom, setShouldScrollToBottom]);

  // Function to load initial messages
  async function loadMessages() {
    if (!activeChatId || loading) return;

    setLoading(true);
    initialLoadCompleted.current = false;

    try {
      const result = await getMessageItems(selectedUser, 20);

      if (
        result?.messages?.messages &&
        result?.messages?.messages?.length > 0
      ) {
        setMessages((prev) => {
          // Start fresh when loading a new chat
          if (activeChatId !== chatId) {
            return [...result.messages.messages].sort(
              (a, b) =>
                new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );
          }

          // Combine previous and new messages
          const combinedMessages = [...prev, ...result.messages.messages];

          // Remove any duplicate messages by ID
          const uniqueMessages = Array.from(
            new Map(
              combinedMessages.map((message) => [message.id, message])
            ).values()
          );

          // Sort messages by date, oldest first
          return uniqueMessages.sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );
        });

        if (result?.messages?.nextCursor) {
          // console.log(result.messages.nextCursor)
          setNextCursor(result.messages.nextCursor);
        } else {
          setNextCursor(null);
        }

        // Set flag to scroll to bottom when initial messages load
        setShouldScrollToBottom(true);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
      initialLoadCompleted.current = true;
    }
  }

  // Reset and load messages when chat changes
  useEffect(() => {
    setMessages([]);
    setNextCursor(null);
    loadMessages();
  }, [activeChatId, selectedUser, refresh]);

  // Handle scroll event to detect scrolling up to load more messages
  useEffect(() => {
    const messagesDiv = messagesDivRef.current;
    if (!messagesDiv) return;

    const handleScroll = () => {
      // Don't check for scroll if initial load is not completed
      if (!initialLoadCompleted.current) return;

      // Save current scroll position
      scrollPositionRef.current = messagesDiv.scrollTop;

      // Load more messages if user scrolls to the top (with a small threshold)
      if (messagesDiv.scrollTop < 100 && !loadingMore && nextCursor) {
        // Save current scroll height before loading more messages
        prevHeightRef.current = messagesDiv.scrollHeight;
        setLoadingMore(true);
      }
    };

    messagesDiv.addEventListener("scroll", handleScroll);
    return () => messagesDiv.removeEventListener("scroll", handleScroll);
  }, [loadingMore, nextCursor, initialLoadCompleted.current]);

  // Load more messages when scrolling up
  useEffect(() => {
    const limit = 11;

    if (!loadingMore || !nextCursor || !activeChatId) {
      return;
    }

    const currentCursor = { id: nextCursor.id, sentAt: nextCursor.sentAt };
    const query = `cursor[id]=${currentCursor?.id}&cursor[sentAt]=${currentCursor?.sentAt}&limit=${limit}`;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations/${selectedUser}/messages?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        
        const newCursor = res.data.nextCursor;

        if (!newCursor) {

          // No more messages to load
          setNextCursor(null);
        } else if (
          newCursor.id !== currentCursor.id ||
          newCursor.sentAt !== currentCursor.sentAt
        ) {
          // Only update if the cursor has changed
          setNextCursor(newCursor);
        }

        // Update messages array
        setMessages((prev) => {
          // Combine previous and new messages
          const combinedMessages = [...prev, ...res.data.messages];

          // Remove any duplicate messages by ID
          const uniqueMessages = Array.from(
            new Map(
              combinedMessages.map((message) => [message.id, message])
            ).values()
          );

          const sortedMessages = uniqueMessages.sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );

          return sortedMessages;
        });
      })
      .then(() => {
        // Maintain scroll position after loading more messages
        setTimeout(() => {
          if (messagesDivRef.current) {
            const newHeight = messagesDivRef.current.scrollHeight;
            const heightDifference = newHeight - prevHeightRef.current;
            messagesDivRef.current.scrollTop =
              heightDifference + scrollPositionRef.current;
          }
        }, 0);
      })
      .then(() => setLoadingMore(false))
      .catch((err) => {
        console.error("Error loading more messages:", err);
        setLoadingMore(false);
      });
  }, [loadingMore, nextCursor, activeChatId]);

  return (
    <div className={styles.messages} ref={messagesDivRef}>
      {loadingMore && (
        <p className={styles.loadingMore}>
          {/* Loading more messages... */}
          </p>
      )}
      {messages?.length === 0 && !loading && <Empty />}
      {[...messages].map((message, index) => (
        <Item
          index={index}
          key={message.id}
          setLoadingMore={setLoadingMore}
          message={message}
          messages={messages}
        />
      ))}
      {loading && (
        <div className={styles.loadingContainer}>
          {/* <p className={styles.loading}>Loading messages...</p> */}
        </div>
      )}
    </div>
  );
}