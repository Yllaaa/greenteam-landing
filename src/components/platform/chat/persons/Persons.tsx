/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState, useCallback } from "react";
import styles from "./persons.module.scss";
import { Chat } from "./search/persons.data";
import Item from "./Item";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useLocale } from "next-intl";

type PersonsProps = {
  chatId?: string;
  setChatId: (id: string) => void;
  selectedUser: string;
  setSelectedUser: (id: string) => void;
  newMessage: string;
};

export default function Persons({
  chatId,
  setChatId,
  selectedUser,
  setSelectedUser,
  newMessage,
}: PersonsProps) {
  const [filteredPersons, setFilteredPersons] = useState<Chat[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const token = getToken();
  const router = useRouter();

  // Extract locale from pathname
  const locale = useLocale();

  // Intersection observer hook
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const fetchConversations = useCallback(async (pageNum: number, isNewFetch: boolean = false) => {
    if (loading || (!hasMore && !isNewFetch)) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations?page=${pageNum}&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
      console.log("Fetched conversations:", response.data);

      const data = response.data;

      if (isNewFetch) {
        setFilteredPersons(data);
      } else {
        setFilteredPersons(prev => [...prev, ...data]);
      }

      // Check if there are more items based on the response length
      setHasMore(data.length === 10);

    } catch (error) {
      console.error("Error fetching conversations:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [token.accessToken, loading, hasMore]);

  // Initial load and reload on selectedUser or newMessage change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchConversations(1, true);
  }, [selectedUser, newMessage]);

  // Check for chatId and set selectedUser when conversations are loaded
  useEffect(() => {
    if (chatId && filteredPersons.length > 0) {
      // Find conversation where contact.id matches chatId
      const matchingConversation = filteredPersons.find(conv => conv.contact.id === chatId);
      if (matchingConversation) {
        // Set selectedUser to the contact.id
        setSelectedUser(matchingConversation.id);
        // Set the conversation id
        setChatId(matchingConversation.contact.id);
      }
    }
  }, [chatId, filteredPersons]);

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchConversations(nextPage);
    }
  }, [inView, hasMore, loading, page]);

  return (
    <div className={styles.persons}>
      {/* <Search setFilteredPersons={setFilteredPersons} /> */}

      {filteredPersons.map((chat, index) => (
        <Item
          selected={selectedUser == chat.contact.id}
          onClick={() => {
            setChatId(chat.contact.id);
            setSelectedUser(chat.id);

            // Handle navigation with locale
            const params = new URLSearchParams();
            params.set('chatId', chat.contact.id);

            // Include locale in the path
            router.push(`/${locale}/chat?chatId=${chat.contact.id}`);
          }}
          key={chat.id || index}
          {...chat}
        />
      ))}

      {/* Loading indicator and intersection observer trigger */}
      {hasMore && (
        <div ref={ref} className={styles.loadingContainer}>
          {/* {loading && (
            <div className={styles.loader}>
              Loading more conversations...
            </div>
          )} */}
        </div>
      )}

      {/* No more items indicator */}
      {!hasMore && filteredPersons.length > 0 && (
        <div className={styles.endMessage}>
          {/* No more conversations */}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredPersons.length === 0 && (
        <div className={styles.emptyState}>
          {/* No conversations found */}
        </div>
      )}
    </div>
  );
}