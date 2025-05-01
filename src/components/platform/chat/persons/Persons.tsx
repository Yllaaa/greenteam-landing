/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import styles from "./persons.module.scss";
import { Chat } from "./search/persons.data";
import Item from "./Item";
// import Search from "./search/Search";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useRouter } from "next/navigation";

type PersonsProps = {
  chatId: string;
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
  const token = getToken();
  const router = useRouter();
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations?page=1&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      )
      .then((res) => {
        // console.log("persons", res.data);

        setFilteredPersons(res.data);
      })
      .catch((err) => console.log(err));
  }, [selectedUser, newMessage]);
  return (
    <div className={styles.persons}>
      {/* <Search setFilteredPersons={setFilteredPersons} /> */}
      {filteredPersons.map((chat, index) => (
        <Item
          selected={chatId == chat.id || selectedUser == chat.contact.id}
          onClick={() => {
            setChatId(chat.id);
            const params = new URLSearchParams();
            params.set('chatId', chat.id);
            router.push(`chat?${params.toString()}`);
            setSelectedUser(chat.contact.id);
          }}
          key={index}
          {...chat}
        />
      ))}
    </div>
  );
}
