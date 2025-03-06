/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  fullName: string;
  avatar?: string;
}

function ChatList(props: any) {
  const {setChatId} = props
  const token = getToken();
  const accessToken = token.accessToken;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations?page=1&limit=10`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => {
        console.log("Chat Users:", res.data);
        setUsers(res.data);
      })
      .catch((err) => console.error("Error fetching chat list:", err))
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <div>
      <h1>Chat List</h1>
      {loading ? <p>Loading...</p> : null}
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li onClick={() => setChatId(user.id)} key={user.id}>
              {user.avatar && (
                <Image
                  src={user.avatar}
                  alt={user.fullName}
                  width={30}
                  height={30}
                />
              )}{" "}
              {user.contact.fullName}
            </li>
          ))
        ) : (
          <p>No conversations available</p>
        )}
      </ul>
    </div>
  );
}

export default ChatList;
