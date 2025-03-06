"use client";
// import { useAppSelector } from "@/store/hooks";
import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";
import React, { useEffect } from "react";

function Chat() {
  // const userToken = useAppSelector((state) => state.login.accessToken);
  const token = getToken();
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/chat/conversations/a5eecbfc-3c5c-4d35-9a4e-5315535a9fa7/messages`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  });

  return (
    <>
      <div>chat responses</div>
    </>
  );
}

export default Chat;
