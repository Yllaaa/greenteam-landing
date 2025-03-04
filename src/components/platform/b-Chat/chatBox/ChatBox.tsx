// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState, useRef, useCallback } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import styles from "./ChatBox.module.css";
// import Image from "next/image";
// import ChatList from "../list/ChatList";
// // import { getToken } from "@/Utils/userToken/LocalToken";

// // const SOCKET_URL = `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat`;
// // const SOCKET_URL = `ws://64.226.73.140:9000/api/v1/chat`;
// const SOCKET_URL = `ws://64.226.73.140:9000`;
// const MESSAGES_LIMIT = 20;

// interface Message {
//   content: string;
//   recipient: { id: string; type: string };
//   conversationId: string;
// }

// interface User {
//   id: string;
//   name: string;
//   avatar: string;
//   isOnline: boolean;
//   conversationId: string;
// }

// const Chat = ({ selectedUser }: { selectedUser: User | null }) => {
//   // const token = getToken();
//   const authToken =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkODQ4NjgzNy1jYzdlLTRkNDctYWVlNC02MDA4Nzk2N2QyY2IiLCJlbWFpbCI6Im1vaGFtZWQzbGFpbHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJ5YXNzc3NzZXIiLCJpYXQiOjE3NDA5MzU5NjIsImV4cCI6MTc3MjQ5MzU2Mn0.jql930XqajNjAiV-ma-3DRZxHPxanAF1k31sEoQYQPs";
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [nextCursor, setNextCursor] = useState<{
//     id: string;
//     sentAt: string;
//   } | null>(null);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const socket = useRef<any>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const markSeenTimeout = useRef<NodeJS.Timeout | null>(null);
//   const prevUserId = useRef<string | null>(null);

//   useEffect(() => {
//     if (!selectedUser) return;

//     // if (socket.current && prevUserId.current === selectedUser.id) return;

//     if (socket.current) socket.current.disconnect();

//     socket.current = io(SOCKET_URL, {
//       path: "/socket.io",
//       transports: ["websocket"],
//       extraHeaders: {
//         Authorization: `Bearer ${authToken}`,
//         "Access-Control-Allow-Origin": "*",
//       },
//     });

//     socket.current.on("connect", () => {
//       console.log("Connected to WebSocket", socket.current);
//     });

//     socket.current.on("newMessage", (message: Message) => {
//       if (message.conversationId === selectedUser.id) {
//         setMessages((prev) => [message, ...prev]);
//         debounceMarkMessagesSeen();
//       }
//     });

//     socket.current.on("exception", (error: any) =>
//       console.error("Socket exception:", error)
//     );

//     prevUserId.current = selectedUser.id;

//     return () => {
//       socket.current?.disconnect();
//       if (markSeenTimeout.current) clearTimeout(markSeenTimeout.current);
//     };
//   }, [selectedUser?.id, socket, authToken]);

//   useEffect(() => {
//     if (selectedUser) {
//       setMessages([]);
//       setNextCursor(null);
//       loadMessages();
//     }
//   }, [selectedUser?.id]);

//   const loadMessages = async () => {
//     if (!selectedUser || loadingMessages) return;

//     setLoadingMessages(true);
//     const query = nextCursor
//       ? `cursor[id]=${nextCursor.id}&cursor[sentAt]=${nextCursor.sentAt}&limit=${MESSAGES_LIMIT}`
//       : `limit=${MESSAGES_LIMIT}`;

//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations/${selectedUser.id}/messages?${query}`,
//         { headers: { Authorization: `Bearer ${authToken}` } }
//       );

//       if (response.data.messages.length > 0) {
//         setMessages((prev) => [...prev, ...response.data.messages]);
//         setNextCursor(response.data.cursor || null);
//       }
//     } catch (error) {
//       console.error("Error loading messages:", error);
//     } finally {
//       setLoadingMessages(false);
//     }
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedUser || !socket.current?.connected) {
//       console.log("Please enter a message or check connection", socket);
//       return;
//     }

//     const messageData: any = {
//       content: newMessage,
//       recipient: { id: selectedUser.id, type: "user" },
//     };

//     // if (selectedUser.conversationId) {
//     //   messageData.conversationId = selectedUser.conversationId;
//     // }

//     console.log("Sending message:", messageData);
//     console.log("Socket connected?", socket.current?.connected);

//     try {
//       await new Promise<void>((resolve, reject) => {
//         socket.current.emit("sendMessage", messageData, (response: any) => {
//           console.log("Server response:", response);
//           if (response?.status === "success") resolve();
//           else reject(response?.error || "Failed to send message");
//         });
//       });

//       setMessages((prev) => [messageData, ...prev]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const debounceMarkMessagesSeen = useCallback(() => {
//     if (markSeenTimeout.current) clearTimeout(markSeenTimeout.current);

//     markSeenTimeout.current = setTimeout(() => {
//       if (selectedUser) {
//         socket.current?.emit("markMessagesSeen", { userId: selectedUser.id });
//       }
//     }, 1000);
//   }, [selectedUser?.id]);

//   if (!selectedUser) return <p>Select a user to start chatting</p>;

//   return (
//     <div className={styles.chatContainer}>
//       <ChatList />
//       <div className={styles.chatHeader}>
//         {selectedUser.avatar && (
//           <Image
//             src={selectedUser.avatar}
//             alt={selectedUser.name}
//             className={styles.avatar}
//             width={40}
//             height={40}
//           />
//         )}
//         <span>{selectedUser.name}</span>
//       </div>

//       <div
//         className={styles.chatMessages}
//         onScroll={(e) => {
//           if ((e.target as HTMLDivElement).scrollTop === 0) {
//             loadMessages();
//           }
//         }}
//       >
//         {loadingMessages && <p>Loading...</p>}
//         {messages.map((msg, index) => (
//           <div key={index} className={styles.message}>
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className={styles.chatInput}>
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import styles from "./ChatBox.module.css";
import Image from "next/image";
import ChatList from "../list/ChatList";

const SOCKET_URL = `http://64.226.73.140:9000`;
const MESSAGES_LIMIT = 20;

interface Message {
  content: string;
  recipient: { id: string; type: string };
  conversationId?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  conversationId?: string;
}

const Chat = ({ selectedUser }: { selectedUser: User | null }) => {
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkODQ4NjgzNy1jYzdlLTRkNDctYWVlNC02MDA4Nzk2N2QyY2IiLCJlbWFpbCI6Im1vaGFtZWQzbGFpbHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJ5YXNzc3NzZXIiLCJpYXQiOjE3NDA5MzU5NjIsImV4cCI6MTc3MjQ5MzU2Mn0.jql930XqajNjAiV-ma-3DRZxHPxanAF1k31sEoQYQPs";
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [nextCursor, setNextCursor] = useState<{
    id: string;
    sentAt: string;
  } | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const socket = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const markSeenTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedUser) return;
    if (socket.current) socket.current.disconnect();
    console.log(socket);

    socket.current = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      extraHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    socket.current.on("connect", () => console.log("Connected to WebSocket"));
    socket.current.on("newMessage", (message: Message) => {
      console.log("New message:", message);

      if (message.recipient.id === selectedUser.id) {
        setMessages((prev) => [message, ...prev]);
        debounceMarkMessagesSeen();
      }
    });

    socket.current.on("exception", (error: any) =>
      console.error("Socket exception:", error)
    );

    prevUserId.current = selectedUser.id;

    return () => {
      socket.current?.disconnect();
      if (markSeenTimeout.current) clearTimeout(markSeenTimeout.current);
    };
  }, [selectedUser?.id]);

  useEffect(() => {
    if (selectedUser) {
      setMessages([]);
      setNextCursor(null);
      loadMessages();
    }
  }, [selectedUser?.id]);

  const loadMessages = async () => {
    if (!selectedUser || loadingMessages) return;

    setLoadingMessages(true);
    const query = nextCursor
      ? `cursor[id]=${nextCursor.id}&cursor[sentAt]=${nextCursor.sentAt}&limit=${MESSAGES_LIMIT}`
      : `limit=${MESSAGES_LIMIT}`;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations/${selectedUser.id}/messages?${query}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data.messages.length > 0) {
        setMessages((prev) => [...prev, ...response.data.messages]);
        setNextCursor(response.data.cursor || null);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    console.log("Sending message:", newMessage);
    console.log(socket.current?.connected);
    console.log(selectedUser);
    console.log(newMessage.trim());

    if (!newMessage.trim() || !selectedUser || !socket.current?.connected)
      return;

    const messageData: Message = {
      content: newMessage,
      recipient: { id: selectedUser.id, type: "user" },
    };
    console.log("Socket connected?", messageData);
    socket.current.emit("sendMessage", messageData, (response: any) => {
      console.log("Moustafa11111");

      console.log("Message sent:", response);
    });
    // socket.current.emit("sendMessage", messageData, (response: any) => {
    //   if (response?.status === "success") {
    //     setMessages((prev) => [messageData, ...prev]);
    //     setNewMessage("");
    //   } else {
    //     console.error("Failed to send message", response?.error);
    //   }
    // });
  };

  const debounceMarkMessagesSeen = useCallback(() => {
    if (markSeenTimeout.current) clearTimeout(markSeenTimeout.current);
    markSeenTimeout.current = setTimeout(() => {
      if (selectedUser) {
        socket.current?.emit("markMessagesSeen", { userId: selectedUser.id });
      }
    }, 1000);
  }, [selectedUser?.id]);

  if (!selectedUser) return <p>Select a user to start chatting</p>;

  return (
    <div className={styles.chatContainer}>
      <ChatList />
      <div className={styles.chatHeader}>
        {selectedUser.avatar && (
          <Image
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className={styles.avatar}
            width={40}
            height={40}
          />
        )}
        <span>{selectedUser.name}</span>
      </div>

      <div className={styles.chatMessages}>
        {loadingMessages && <p>Loading...</p>}
        {messages.map((msg, index) => (
          <div key={index} className={styles.message}>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
