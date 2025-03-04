import React from "react";
import srtyles from "./platformHome.module.css";
import PostForums from "@/components/platform/posts/forums/PostForums";
import EventSection from "@/components/platform/posts/Events/EventSection";
import ProductSection from "@/components/platform/posts/products/ProductSection";
import SubHeader from "@/components/platform/a-header/SubHeader/SubHeader";
import FeedSection from "@/components/platform/posts/feeds/FeedSection";
// import Chat from "@/components/platform/b-Chat/chatBox/ChatBox";

function page() {
  return (
    <section className={srtyles.container}>
      <div className={srtyles.subHeader}>
        <SubHeader />
      </div>
      <div className={srtyles.feedSection}>
        <FeedSection />
      </div>

      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <EventSection />
      </div>
      <div
        style={{
          padding: "32.5px 0px",
          borderBottom: "1px solid #3A444C",
          borderTop: "1px solid #3A444C",
        }}
      >
        <ProductSection />
      </div>
      {/* done lesa likes/comment/do/unlike */}
      <div className={srtyles.artSection}>
        <PostForums />
      </div>
      <div>
        {/* <Chat
          selectedUser={{
            id: "ba7917b5-0979-4565-9636-b94e827b1202",
            name: "Moustafa firefox",
            avatar: "",
            isOnline: true,
            conversationId:"test"
          }}
         
        /> */}
      </div>
    </section>
  );
}

export default page;
