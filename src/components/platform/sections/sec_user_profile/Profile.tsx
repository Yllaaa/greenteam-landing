"use client";
import React from "react";
import AllProfileBody from "./body/all/AllProfileBody";

function Profile(props: { username: string }) {
  const { username } = props;
  return (
    <>
      <AllProfileBody username={username} />
    </>
  );
}

export default Profile;
