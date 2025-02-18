import SingleEventPage from "@/components/platform/posts/Events/singleEventPage/SingleEventPage";
import React from "react";

async function page({ params }: { params: Promise<{ eventid: string }> }) {
  const { eventid } = await params;

  return (
    <>
      {eventid && <SingleEventPage id={eventid} />}
    </>
  );
}

export default page;
