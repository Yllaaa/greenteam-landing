import PagesBody from "@/components/platform/sections/sec_pages/body/PagesBody";
import React from "react";

async function page(params: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params.params;
  return (
    <>
      <PagesBody pageId={pageId} />
    </>
  );
}

export default page;
