import React from "react";
import styles from "./postId.module.css";
import SinglePost from "@/components/platform/posts/feeds/singlePost/SinglePost";

async function page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  return (
    <>
      {postId && (
        <div className={styles.single}>
          <SinglePost postId={postId} />
        </div>
      )}
    </>
  );
}

export default page;
