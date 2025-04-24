import Profile from "@/components/platform/sections/sec_user_profile/Profile";
import React from "react";

function page(params: { params: { locale: string; username: string } }) {
  return (
  <>
  <div>
    <Profile username={params.params.username} />
  </div>
  </>
  );
}

export default page;
