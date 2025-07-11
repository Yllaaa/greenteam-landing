"use client";
import React, { useEffect } from "react";
import AllProfileBody from "./body/all/AllProfileBody";
import { useParams } from "next/navigation";

function Profile() {
  const params = useParams();
  useEffect(() => {
    if (params && params.username === undefined) {
      return;
    }
    if (params && params.username === "undefined") {
      return;
    }
    if (params && params.username === "") {
      return;
    }
  }, [params, params.username]);
  const username = params.username as string;
  return (
    <>
      <AllProfileBody username={username} />
    </>
  );
}

export default Profile;
