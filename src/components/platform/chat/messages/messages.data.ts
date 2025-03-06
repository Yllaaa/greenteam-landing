import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";

export type SenderType = "user" | "page";

export interface Sender {
  id: string;
  name: string;
  avatar: string | null;
  username: string;
}

export type Message = {
  id: string;
  content: string;
  conversationId: string;
  isReceived: boolean;
  mediaUrl: string | null;
  seenAt: string | null;
  sender: Sender;
  senderType: SenderType;
  sentAt: Date;
};
export type NextCursor = {
  sentAt: string;
  id: string;
};
export type MessageItem = {
  messages: Message[];

  nextCursor?: NextCursor;
};

export type ContactType = "user" | "group";

export interface Contact {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
  type: ContactType;
}

export interface LastMessage {
  id: string;
  content: string;
  sentAt: string;
}

export interface Conversation {
  id: string;
  contactType: ContactType;
  contact: Contact;
  lastMessage: LastMessage;
  unreadCount: number;
}

export function getUserId(): string {
  return "1";
}

//
//
export async function getMessageItems(
  chatId: string,
  // nextCursor?: any,
  limit: number = 20
): Promise<{
  messages: MessageItem;
  nextCursor: {
    sentAt: string;
    id: string;
  };
}> {
  if (!chatId)
    return {
      messages: { messages: [] },
      nextCursor: {
        sentAt: "",
        id: "",
      },
    };

  const token = getToken();
  // const query = nextCursor
  //   ? `cursor[id]=${nextCursor.id}&cursor[sentAt]=${nextCursor.sentAt}&limit=${limit}`
  //   : `limit=${limit}`;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations/${chatId}/messages?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    return {
      messages: response.data as {
        messages: {
          id: string;
          content: string;
          conversationId: string;
          isReceived: boolean;
          mediaUrl: string | null;
          seenAt: string | null;
          sender: Sender;
          senderType: SenderType;
          sentAt: Date;
        }[];
      },
      nextCursor: response.data.nextCursor || null,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      messages: { messages: [] },

      nextCursor: {
        sentAt: "",
        id: "",
      },
    };
  }
}

//
//
export function formatChatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
