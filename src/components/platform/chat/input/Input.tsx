
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import styles from "./input.module.scss";
import sendIcon from "@/../public/chat/send.svg";
import { useRef, KeyboardEvent } from "react";
import classNames from "classnames";

export default function Input({
  chatId,
  newMessage,
  sendMessageHandler,
  setNewMessage,
}: {
  chatId: string;
  selectedUser: string;
  newMessage: string;
  inputValue: boolean;
  setInputValue: (message: any) => void;
  setMessages: (messages: any) => void;
  sendMessageHandler: (message: any) => void;
  setNewMessage: (message: any) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Add keyboard event handler for Enter key
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler(null);
    }
  };

  return (
    <div
      className={classNames(styles.input, { [styles.hidden]: chatId === "" })}
    >
      <div className={styles.inputField}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className={styles.sendButton} onClick={sendMessageHandler}>
          <Image
            className={styles.icon}
            src={sendIcon}
            alt="send"
            width={20}
            height={20}
          />
        </div>
      </div>
    </div>
  );
}

