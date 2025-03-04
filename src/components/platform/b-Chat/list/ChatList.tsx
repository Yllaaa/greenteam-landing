
"use client";

// import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

function ChatList() {
//   const token = getToken();
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkODQ4NjgzNy1jYzdlLTRkNDctYWVlNC02MDA4Nzk2N2QyY2IiLCJlbWFpbCI6Im1vaGFtZWQzbGFpbHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJ5YXNzc3NzZXIiLCJpYXQiOjE3NDA5MzU5NjIsImV4cCI6MTc3MjQ5MzU2Mn0.jql930XqajNjAiV-ma-3DRZxHPxanAF1k31sEoQYQPs";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations?page=1&limit=10`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log("Chat Users:", res.data);
        setUsers(res.data.conversations || []);
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
            <li key={user.id}>
              {user.avatar && <Image src={user.avatar} alt={user.name} width={30} height={30} />}{" "}
              {user.name}
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
