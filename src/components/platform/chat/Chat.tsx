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
const SOCKET_URL = "http://64.226.73.140:9000/api/v1/chat";

export default function Chat() {
  const token = getToken();
  const socketRef = useRef<Socket | null>(null);

  const [chatId, setChatId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<NextCursor | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [inputValue, setInputValue] = useState(true);
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
        console.log("testNew", message);
        
  
        if (message.conversationId === chatId) {
          console.log("Received message:", message);
          setMessages((prev) => [ ...prev, message]);
        }
        console.log("user:", chatId);
        
        console.log("New message:", message);
      });
  
      socketRef.current.on("exception", (error: any) =>
        console.error("Socket exception:", error)
      );
    };
  
    // Initial connection
    connectSocket();
  
    // Refresh connection every 5 seconds
    const interval = setInterval(() => {
      console.log("Refreshing WebSocket connection...");
      socketRef.current?.disconnect();
      connectSocket();
    }, 5000);
  
    // Cleanup function to clear interval and disconnect WebSocket
    return () => {
      clearInterval(interval);
      socketRef.current?.disconnect();
    };
  }, [selectedUser]);
  

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
        // console.log(
        //   "Message sent successfully:",
        //   response,
        //   "response",
        //   messageData
        // );
        // setMessages((prev) => [messageData.content, ...prev]);
        setNewMessage("");
      } else {
        console.log(response);
        console.error("Failed to send message", response?.error);
      }
    });
  };

  return (
    <div className={styles.chat}>
      <div className={styles.header}>Messages</div>
      <div className={styles.content}>
        <Persons
          chatId={chatId}
          setChatId={setChatId}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          newMessage={newMessage}
          
        />
        <div className={styles.messagesView}>
          <Messages
            chatId={chatId}
            messages={messages}
            setMessages={setMessages}
            newMessage={newMessage}
            nextCursor={nextCursor}
            setNextCursor={setNextCursor}
            selectedUser={selectedUser}
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
        </div>
      </div>
    </div>
  );
}
