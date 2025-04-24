"use client";
import React from "react";
import AllProfileBody from "./body/all/AllProfileBody";
import { useParams } from "next/navigation";

function Profile() {
  const params = useParams()
  const username = params.username as string;
  return (
    <>
      <AllProfileBody username={username} />
    </>
  );
}

export default Profile;
