// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState, useRef } from "react";
// import io, { Socket } from "socket.io-client";
// import styles from "./chat.module.scss";
// import Input from "./input/Input";
// import Messages from "./messages/Messages";
// import Persons from "./persons/Persons";
// import { getToken } from "@/Utils/userToken/LocalToken";
// import { Message, NextCursor } from "./messages/messages.data";
// const SOCKET_URL = "https://greenteam.yllaaa.com/api/v1/chat";

// export default function Chat() {
//   const token = getToken();
//   const socketRef = useRef<Socket | null>(null);

//   const [chatId, setChatId] = useState<string>("");
//   const [selectedUser, setSelectedUser] = useState<any | null>(null);

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [nextCursor, setNextCursor] = useState<NextCursor | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [inputValue, setInputValue] = useState(true);
//   useEffect(() => {
//     if (!selectedUser) return;

//     const accessToken = token.accessToken;

//     // Function to initialize WebSocket connection
//     const connectSocket = () => {
//       socketRef.current = io(SOCKET_URL, {
//         transports: ["websocket"],
//         auth: { token: accessToken },
//       });

//       socketRef.current.on("connect", () =>
//         console.log("Connected to WebSocket")
//       );

//       socketRef.current.on("newMessage", (message: any) => {

//         if (message.conversationId === chatId) {
//           setMessages((prev) => [...prev, message]);
//         }
//       });

//       socketRef.current.on("exception", (error: any) =>
//         console.error("Socket exception:", error)
//       );
//     };

//     connectSocket();

//     return () => {
//       // clearInterval(interval);
//       socketRef.current?.disconnect();
//     };
//   }, [selectedUser]);

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedUser || !socketRef.current?.connected)
//       return;

//     const messageData:
//       | {
//           content: string;
//           recipient: { id: string; type: string };
//         }
//       | any = {
//       content: newMessage,
//       recipient: { id: selectedUser, type: "user" },
//     };

//     socketRef.current.emit("sendMessage", messageData, (response: any) => {
//       if (response?.success) {
//         // console.log(
//         //   "Message sent successfully:",
//         //   response,
//         //   "response",
//         //   messageData
//         // );
//         // setMessages((prev) => [messageData.content, ...prev]);
//         setNewMessage("");
//       } else {
//         console.log(response);
//         console.error("Failed to send message", response?.error);
//       }
//     });
//   };

//   return (
//     <div className={styles.chat}>
//       <div className={styles.header}>Messages</div>
//       <div className={styles.content}>
//         <Persons
//           chatId={chatId}
//           setChatId={setChatId}
//           selectedUser={selectedUser}
//           setSelectedUser={setSelectedUser}
//           newMessage={newMessage}
//         />
//         <div className={styles.messagesView}>
//           <Messages
//             chatId={chatId}
//             messages={messages}
//             setMessages={setMessages}
//             newMessage={newMessage}
//             nextCursor={nextCursor}
//             setNextCursor={setNextCursor}
//             selectedUser={selectedUser}
//           />
//           <Input
//             chatId={chatId}
//             selectedUser={selectedUser}
//             setMessages={setMessages}
//             setNewMessage={setNewMessage}
//             inputValue={inputValue}
//             setInputValue={setInputValue}
//             newMessage={newMessage}
//             sendMessageHandler={sendMessage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// First, let's update your Chat.tsx component to handle scrolling to new messages

///////////////////////////
// "use client";

// import { useEffect, useState, useRef } from "react";
// import io, { Socket } from "socket.io-client";
// import styles from "./chat.module.scss";
// import Input from "./input/Input";
// import Messages from "./messages/Messages";
// import Persons from "./persons/Persons";
// import { getToken } from "@/Utils/userToken/LocalToken";
// import { Message, NextCursor } from "./messages/messages.data";
// import { useSearchParams } from "next/navigation";
// const SOCKET_URL = "https://greenteam.yllaaa.com/api/v1/chat";

// export default function Chat() {
//   const token = getToken();
//   const socketRef = useRef<Socket | null>(null);
//   const searchParams = useSearchParams();
//   console.log("searchParams", searchParams.get("chatId"));

//   const [chatId, setChatId] = useState<string>("");
//   const [selectedUser, setSelectedUser] = useState<any | null>(null);

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [nextCursor, setNextCursor] = useState<NextCursor | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [inputValue, setInputValue] = useState(true);
//   const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

//   useEffect(() => {
//     if (!selectedUser) return;

//     const accessToken = token.accessToken;

//     // Function to initialize WebSocket connection
//     const connectSocket = () => {
//       socketRef.current = io(SOCKET_URL, {
//         transports: ["websocket"],
//         auth: { token: accessToken },
//       });

//       socketRef.current.on("connect", () =>
//         console.log("Connected to WebSocket")
//       );

//       socketRef.current.on("newMessage", (message: any) => {
//         if (message.conversationId === chatId) {
//           setMessages((prev) => [...prev, message]);
//           // Set flag to scroll to bottom when new message arrives
//           setShouldScrollToBottom(true);
//         }
//       });

//       socketRef.current.on("exception", (error: any) =>
//         console.error("Socket exception:", error)
//       );
//     };

//     connectSocket();

//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, [selectedUser]);

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedUser || !socketRef.current?.connected)
//       return;

//     const messageData:
//       | {
//           content: string;
//           recipient: { id: string; type: string };
//         }
//       | any = {
//       content: newMessage,
//       recipient: { id: selectedUser, type: "user" },
//     };

//     socketRef.current.emit("sendMessage", messageData, (response: any) => {
//       if (response?.success) {
//         setNewMessage("");
//         // Set flag to scroll to bottom when message is sent
//         setShouldScrollToBottom(true);
//       } else {
//         console.error("Failed to send message", response?.error);
//       }
//     });
//   };
//   useEffect(() => {
//     if (searchParams.get("chatId")) {
//       setChatId(searchParams.get("chatId") as string);
//     }
//   }, []);
//   return (
//     <div className={styles.chat}>
//       <div className={styles.header}>Messages</div>
//       <div className={styles.content}>
//         <Persons
//           chatId={chatId}
//           setChatId={setChatId}
//           selectedUser={selectedUser}
//           setSelectedUser={setSelectedUser}
//           newMessage={newMessage}
//         />
//         <div className={styles.messagesView}>
//           <Messages
//             chatId={chatId}
//             messages={messages}
//             setMessages={setMessages}
//             newMessage={newMessage}
//             nextCursor={nextCursor}
//             setNextCursor={setNextCursor}
//             selectedUser={selectedUser}
//             shouldScrollToBottom={shouldScrollToBottom}
//             setShouldScrollToBottom={setShouldScrollToBottom}
//           />
//           <Input
//             chatId={chatId}
//             selectedUser={selectedUser}
//             setMessages={setMessages}
//             setNewMessage={setNewMessage}
//             inputValue={inputValue}
//             setInputValue={setInputValue}
//             newMessage={newMessage}
//             sendMessageHandler={sendMessage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
/* eslint-disable react-hooks/exhaustive-deps */
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
const SOCKET_URL = "https://greenteam.yllaaa.com/api/v1/chat";

export default function Chat() {
  const token = getToken();
  const socketRef = useRef<Socket | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [chatId, setChatId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<NextCursor | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [inputValue, setInputValue] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Handle URL params on initial load and when they change
  useEffect(() => {
    const paramChatId = searchParams.get("chatId");
    if (paramChatId) {
      setChatId(paramChatId);
      setShowMessages(true); // Show messages view on mobile when chat ID is present
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedUser) return;

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
        if (message.conversationId === chatId) {
          setMessages((prev) => [...prev, message]);
          // Set flag to scroll to bottom when new message arrives
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
  }, [selectedUser, chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !socketRef.current?.connected)
      return;

    const messageData:
      | {
          content: string;
          recipient: { id: string; type: string };
        }
      | any = {
      content: newMessage,
      recipient: { id: selectedUser, type: "user" },
    };

    socketRef.current.emit("sendMessage", messageData, (response: any) => {
      if (response?.success) {
        setNewMessage("");
        // Set flag to scroll to bottom when message is sent
        setShouldScrollToBottom(true);
      } else {
        console.error("Failed to send message", response?.error);
      }
    });
  };

  // Handle back button on mobile
  const handleBackToUsers = () => {
    setShowMessages(false);
    // Keep the URL consistent by removing the chatId parameter
    router.push('chat');
  };

  return (
    <div className={styles.chat}>
      <div className={styles.header}>
        {showMessages && (
          <button onClick={handleBackToUsers} className={styles.backButton}>
            ← Back
          </button>
        )}
        Messages
      </div>
      <div className={styles.content}>
        <div
          className={`${styles.personsContainer} ${
            showMessages ? styles.hiddenOnMobile : ""
          }`}
        >
          <Persons
            chatId={chatId}
            setChatId={(id) => {
              setChatId(id);
              router.push(`/chat?chatId=${id}`);
              setShowMessages(true);
            }}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            newMessage={newMessage}
          />
        </div>
        <div
          className={`${styles.messagesView} ${
            showMessages ? styles.visibleOnMobile : styles.hiddenOnMobile
          }`}
        >
          {selectedUser ? (
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
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}