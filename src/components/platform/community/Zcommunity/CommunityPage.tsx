"use client";
import React, { lazy, Suspense } from "react";
import MapHeader from "../AmapHeader/MapHeader";
// import EventCom from "../events/EventCom";

// import ProductSection from "../products/ProductSection";
// import Groups from "../groups/Groups";
const Pages = lazy(() => import("../pages/Pages"));
const Groups = lazy(() => import("../groups/Groups"));
const ProductSection = lazy(() => import("../products/ProductSection"));
const EventCom = lazy(() => import("../events/EventCom"));

function CommunityPage() {
  return (
    <>
      <MapHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <Pages />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Groups />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <EventCom />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductSection />
      </Suspense>
    </>
  );
}

export default CommunityPage;
