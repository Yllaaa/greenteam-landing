"use client";
import React, { useEffect } from "react";
import AllProfileBody from "./body/all/AllProfileBody";
import { useParams } from "next/navigation";

function Profile() {
  const params = useParams();

  useEffect(() => {
    if (!params || !params.username) {
      return;
    }
    if (params.username === "undefined" || params.username === "") {
      return;
    }
  }, [params, params?.username]);

  // Handle the case where params might be null
  if (!params || !params.username) {
    return (
      <div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const username = params.username as string;

  return (
    <>
      <AllProfileBody username={username} />
    </>
  );
}

export default Profile;