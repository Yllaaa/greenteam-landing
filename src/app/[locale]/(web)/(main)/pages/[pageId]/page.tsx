import PagesBody from "@/components/platform/sections/sec_pages/body/PagesBody";
import React from "react";

function page(params: { params: { pageId: string } }) {
  const { pageId } = params.params;
  return (
    <>
      <PagesBody pageId={pageId} />
    </>
  );
}

export default page;
