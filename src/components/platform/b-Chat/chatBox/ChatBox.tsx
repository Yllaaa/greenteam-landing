
// "use client";
// import { useEffect, useState, useRef } from "react";
// import io, { Socket } from "socket.io-client";
// import axios from "axios";
// import styles from "./ChatBox.module.css";
// import Image from "next/image";
// import ChatList from "../list/ChatList";
// import { getToken } from "@/Utils/userToken/LocalToken";
// const SOCKET_URL = "http://64.226.73.140:9000/api/v1/chat";
// const MESSAGES_LIMIT = 20;
// interface Message {
//   content: string;
//   recipient: { id: string; type: string };
//   conversationId?: string;
// }
// interface User {
//   id: string;
//   name: string;
//   avatar: string;
//   isOnline: boolean;
//   conversationId?: string;
// }
// const Chat = ({ selectedUser }: { selectedUser: User | null }) => {
//   const [chatId, setChatId] = useState<string | null>(null);
//   const token = getToken();
//   const authToken = token.accessToken;
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [nextCursor, setNextCursor] = useState<{
//     id: string;
//     sentAt: string;
//   } | null>(null);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const socketRef = useRef<Socket | null>(null);
//   useEffect(() => {
//     if (!selectedUser) return;
//     const localS = localStorage.getItem("user");
//     const accessToken = localS ? JSON.parse(localS).accessToken : "ssss";
//     // Initialize WebSocket connection
//     socketRef.current = io(SOCKET_URL, {
//       transports: ["websocket"],
//       auth: {
//         token: accessToken,
//       },
//     });
//     socketRef.current.on("connect", () =>
//       console.log("Connected to WebSocket")
//     );
//     socketRef.current.on("newMessage", (message: Message) => {
//       if (message.recipient.id === selectedUser.id) {
//         setMessages((prev) => [message, ...prev]);
//       }
//       console.log("New message:", message);
//     });
//     socketRef.current.on("exception", (error: any) =>
//       console.error("Socket exception:", error)
//     );
//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, [selectedUser?.id]);
//   // useEffect(() => {
//   //   if (selectedUser) {
//   //     setMessages([]);
//   //     setNextCursor(null);
//   //     // loadMessages();
//   //   }
//   // }, [selectedUser?.id, chatId]);
//   // const loadMessages = async () => {
//   //   if (!selectedUser || loadingMessages) return;
//   //   setLoadingMessages(true);
//   //   const query = nextCursor
//   //     ? `cursor[id]=${nextCursor.id}&cursor[sentAt]=${nextCursor.sentAt}&limit=${MESSAGES_LIMIT}`
//   //     : `limit=${MESSAGES_LIMIT}`;
//   //   try {
//   //     const response = await axios.get(
//   //       `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations/${chatId===null?"a5eecbfc-3c5c-4d35-9a4e-5315535a9fa7":chatId}/messages?${query}`,
//   //       { headers: { Authorization: `Bearer ${authToken}` } }
//   //     );
//   //     if (response.data.messages.length > 0) {
//   //       setMessages((prev) => [...prev, ...response.data.messages]);
//   //       setNextCursor(response.data.cursor || null);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error loading messages:", error);
//   //   } finally {
//   //     setLoadingMessages(false);
//   //   }
//   // };
  
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedUser || !socketRef.current?.connected)
//       return;
//     const messageData: Message = {
//       content: newMessage,
//       recipient: { id: selectedUser.id, type: "user" },
//     };
//     console.log("Sending message:", messageData);
//     socketRef.current.emit("sendMessage", messageData, (response: any) => {
//       if (response?.success) {
//         setMessages((prev) => [messageData, ...prev]);
//         setNewMessage("");
//       } else {
//         console.log(response);
//         console.error("Failed to send message", response?.error);
//       }
//     });
//   };
//   if (!selectedUser) return <p>Select a user to start chatting</p>;

//   // const [chatId, setChatId] = useState<string | null>(null);

//   return (
//     <div className={styles.chatContainer}>
      
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
//       <div className={styles.chatMessages}>
//         {loadingMessages && <p>Loading...</p>}
//         {messages.map((msg, index) => (
//           <div key={index} className={styles.message}>
//             {msg.content}
//           </div>
//         ))}
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
