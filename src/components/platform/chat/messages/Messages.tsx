// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";
// import { useRef, useEffect, useState } from "react";
// import { getMessageItems, Message, NextCursor } from "./messages.data";
// import styles from "./messages.module.scss";
// import Item from "./Item";
// import Empty from "./empty/Empty";
// import axios from "axios";
// import { getToken } from "@/Utils/userToken/LocalToken";
// // import { useInView } from "react-intersection-observer";

// export default function Messages({
//   chatId,
//   messages,
//   setMessages,
//   // newMessage,
//   nextCursor,
//   setNextCursor,
//   selectedUser,
// }: //
// // inputValue,
// {
//   chatId: string;
//   messages: Message[];
//   selectedUser: string;
//   setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
//   newMessage: string;
//   nextCursor: NextCursor | null;
//   setNextCursor: React.Dispatch<React.SetStateAction<NextCursor | null>>;
//   // inputValue: boolean;
// }) {
//   const token = getToken();
//   const [loadingMore, setLoadingMore] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const messagesDivRef = useRef<HTMLDivElement>(null);

//   // Scrolls to the bottom of the message container
//   function scrollToBottom() {
//     if (messagesDivRef.current) {
//       messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
//     }
//   }

//   // Function to load messages with pagination support
//   async function loadMessages() {
//     if (!chatId || loading) return;
//     setLoading(true);

//     try {
//       const messages = await getMessageItems(chatId, 20);

//       if (
//         messages?.messages?.messages &&
//         messages?.messages?.messages?.length > 0
//       ) {
//         setMessages((prev) => {
//           // Combine previous and new messages
//           const combinedMessages = [...prev, ...messages?.messages.messages];

//           // Remove any duplicate messages by ID
//           const uniqueMessages = Array.from(
//             new Map(
//               combinedMessages.map((message) => [message.id, message])
//             ).values()
//           );

//           // Sort messages by date, oldest first
//           const sortedMessages = uniqueMessages.sort(
//             (a, b) =>
//               new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
//           );

//           return sortedMessages;
//         });
//         console.log(
//           "messages.messages?.nextCursor",
//           messages.messages?.nextCursor
//         );
//         if (messages?.messages?.nextCursor) {
//           setNextCursor(messages?.messages?.nextCursor);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     // Reset messages when the chatId changes
//     setMessages([]);
//     setNextCursor(null);
//     loadMessages();
//   }, [chatId, selectedUser]);

//   useEffect(() => {
//     const limit = 11;
//     console.log("Debug nextCursor", nextCursor);
//     console.log("Debug nextCursor.id", nextCursor?.id);
//     console.log("Debug loading", loadingMore);

//     if (!loadingMore) {
//       return;
//     }
//     console.log("pass 1");

//     if (!nextCursor) {
//       return;
//     }
//     console.log("pass 2");

//     const currentCursor = { id: nextCursor.id, sentAt: nextCursor.sentAt };

//     const query = nextCursor
//       ? `cursor[id]=${currentCursor?.id}&cursor[sentAt]=${currentCursor?.sentAt}&limit=${limit}`
//       : `limit=${limit}`;

//     axios
//       .get(
//         `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations/${chatId}/messages?${query}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token.accessToken}`,
//           },
//         }
//       )
//       .then((res) => {
//         console.log("pass 3");
//         console.log("useEffect res", res.data);
//         const newCursor = res.data.nextCursor;

//         if (!newCursor) {
//           // No more messages to load
//           setNextCursor(null);
//         } else if (
//           newCursor.id !== currentCursor.id ||
//           newCursor.sentAt !== currentCursor.sentAt
//         ) {
//           // Only update if the cursor has changed
//           setNextCursor(newCursor);
//         }
//         setMessages((prev) => {
//           // Combine previous and new messages
//           const combinedMessages = [...prev, ...res.data.messages];

//           // Remove any duplicate messages by ID
//           const uniqueMessages = Array.from(
//             new Map(
//               combinedMessages.map((message) => [message.id, message])
//             ).values()
//           );

//           const sortedMessages = uniqueMessages.sort(
//             (a, b) =>
//               new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
//           );

//           return sortedMessages;
//         });
//       })
//       .then(() => {
//         console.log("cursor check null", nextCursor);
//       })

//       .then(() => setLoadingMore(false))
//       .catch((err) => console.error(err));
//   }, [loadingMore, nextCursor, chatId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [loading]);

//   return (
//     <div className={styles.messages} ref={messagesDivRef}>
//       {messages?.length === 0 && <Empty />}
//       {[...messages].map((message, index) => (
//         <Item
//           index={index}
//           key={message.id} // Use message ID if available for stable keys
//           setLoadingMore={setLoadingMore} // First item in reversed array is the oldest visible message
//           message={message}
//           messages={messages}
//         />
//       ))}
//       {loading && <p>Loading more messages...</p>}
//     </div>
//   );
// }
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
  nextCursor,
  setNextCursor,
  selectedUser,
  shouldScrollToBottom,
  setShouldScrollToBottom
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
}) {
  const token = getToken();
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesDivRef = useRef<HTMLDivElement>(null);
  
  // Ref to track scroll position
  const scrollPositionRef = useRef<number>(0);
  // Ref to store the height before loading more messages
  const prevHeightRef = useRef<number>(0);
  
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
    if (!chatId || loading) return;
    setLoading(true);

    try {
      const messages = await getMessageItems(chatId, 20);

      if (
        messages?.messages?.messages &&
        messages?.messages?.messages?.length > 0
      ) {
        setMessages((prev) => {
          // Combine previous and new messages
          const combinedMessages = [...prev, ...messages?.messages.messages];

          // Remove any duplicate messages by ID
          const uniqueMessages = Array.from(
            new Map(
              combinedMessages.map((message) => [message.id, message])
            ).values()
          );

          // Sort messages by date, oldest first
          const sortedMessages = uniqueMessages.sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );

          return sortedMessages;
        });
        
        if (messages?.messages?.nextCursor) {
          setNextCursor(messages?.messages?.nextCursor);
        }
        
        // Set flag to scroll to bottom when initial messages load
        setShouldScrollToBottom(true);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }

  // Reset messages when chat or user changes
  useEffect(() => {
    setMessages([]);
    setNextCursor(null);
    loadMessages();
  }, [chatId, selectedUser]);

  // Handle scroll event to detect scrolling up to load more messages
  useEffect(() => {
    const messagesDiv = messagesDivRef.current;
    
    const handleScroll = () => {
      if (!messagesDiv) return;
      
      // Save current scroll position
      scrollPositionRef.current = messagesDiv.scrollTop;
      
      // Load more messages if user scrolls to the top (with a small threshold)
      if (messagesDiv.scrollTop < 100 && !loadingMore && nextCursor) {
        // Save current scroll height before loading more messages
        prevHeightRef.current = messagesDiv.scrollHeight;
        setLoadingMore(true);
      }
    };
    
    messagesDiv?.addEventListener('scroll', handleScroll);
    return () => messagesDiv?.removeEventListener('scroll', handleScroll);
  }, [loadingMore, nextCursor]);

  // Load more messages when scrolling up
  useEffect(() => {
    const limit = 11;
    
    if (!loadingMore || !nextCursor) {
      return;
    }

    const currentCursor = { id: nextCursor.id, sentAt: nextCursor.sentAt };
    const query = `cursor[id]=${currentCursor?.id}&cursor[sentAt]=${currentCursor?.sentAt}&limit=${limit}`;

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
            messagesDivRef.current.scrollTop = heightDifference + scrollPositionRef.current;
          }
        }, 0);
      })
      .then(() => setLoadingMore(false))
      .catch((err) => console.error(err));
  }, [loadingMore, nextCursor, chatId]);

  return (
    <div className={styles.messages} ref={messagesDivRef}>
      {loadingMore && <p className={styles.loadingMore}>Loading more messages...</p>}
      {messages?.length === 0 && <Empty />}
      {[...messages].map((message, index) => (
        <Item
          index={index}
          key={message.id}
          setLoadingMore={setLoadingMore}
          message={message}
          messages={messages}
        />
      ))}
      {loading && <p>Loading messages...</p>}
    </div>
  );
}