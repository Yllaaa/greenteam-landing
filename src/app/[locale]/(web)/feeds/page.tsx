import React from "react";
import srtyles from "./platformHome.module.css";
import PostForums from "@/components/platform/posts/POSTCARD/PostForums";
import EventSection from "@/components/platform/Events/EventSection";
import ArtSection from "@/components/platform/posts/Art/ArtSection";
import ProductSection from "@/components/platform/products/ProductSection";

function page() {
  return (
    <section className={srtyles.container}>
      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <ArtSection />
        {/* <PostCard /> */}
      </div>
      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <ArtSection />
        {/* <PostCard /> */}
      </div>
      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <ArtSection />
        {/* <PostCard /> */}
      </div>
      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <ArtSection />
        {/* <PostCard /> */}
      </div>
      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <ArtSection />
        {/* <PostCard /> */}
      </div>
      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <ArtSection />
        {/* <PostCard /> */}
      </div>
      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <EventSection />
        {/* <EventCard /> */}
      </div>
      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <ProductSection />
        {/* <EventCard /> */}
      </div>
      <div style={{ margin: "100px 0px" }}>
        <PostForums />
      </div>
    </section>
  );
}

export default page;
