"use client";
import Image from "next/image";
import { PageItem } from "./pages.data";
import styles from "./pages.module.scss";
import logo from "@/../public/personal/menu/pages/logo.svg";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useRef, useState } from "react";
import CreatePostModal from "@/components/platform/modals/pageAddPost/CreatePostModal"; // Import the modal component

export default function Item({
  pageI,
  page,
  setPage,
  length,
  index,
}: {
  pageI: PageItem;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  length: number;
  index: number;
}) {
  const router = useRouter();
  const locale = useLocale();
  // Track if pagination has already been triggered
  const hasPaginatedRef = useRef(false);

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNavigate = () => {
    router.push(`/${locale}/pages/${pageI.slug}`);
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true, // Only trigger once when coming into view
  });

  const handlePages = useCallback(() => {
    // Only paginate if we haven't already and we're not on the first page load
    if (!hasPaginatedRef.current && length >= 5) {
      hasPaginatedRef.current = true;
      setPage(page + 1);
    }
  }, [length, page, setPage]);

  useEffect(() => {
    // Only trigger pagination if this is the last item and it's in view
    if (inView && index === length - 1) {
      handlePages();
    }
  }, [handlePages, inView, index, length]);

  // Open modal handler
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Success callback for when post is successfully created
  const handlePostSuccess = () => {
    // You can add any post-submission logic here
    // For example, refresh data or show a success message
    console.log("Post added successfully to page:", pageI.name);
  };

  return (
    <>
      <div ref={index === length - 1 ? ref : null} className={styles.item}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image src={pageI.avatar ? pageI.avatar : logo} alt={pageI.name} width={100} height={100} loading="lazy" unoptimized />
          </div>
          <div className={styles.ecoVillage}>EcoVillage</div>
        </div>
        <div className={styles.content}>
          <div onClick={handleNavigate} className={styles.text}>
            <div className={styles.title}>{pageI.name}</div>
          </div>
          <div onClick={handleNavigate} className={styles.description}>
            <div className={styles.headerWhy}>
              <span>Why: </span>
              {pageI.why.length > 72 ? `${pageI.why.slice(0, 72)}...` : pageI.why}
            </div>
            <div className={styles.headerHow}>
              <span>How: </span>
              {pageI.how.length > 72 ? `${pageI.how.slice(0, 72)}...` : pageI.how}
            </div>
            <div className={styles.headerWhat}>
              <span>What: </span>
              {pageI.what.length > 72
                ? `${pageI.what.slice(0, 72)}...`
                : pageI.what}
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.counts}>
              <div className={styles.followers}>
                {pageI.followersCount} Followers
              </div>
            </div>
            <button onClick={handleOpenModal} className={styles.like}>Add post</button>
          </div>
        </div>
      </div>

      {/* Post creation modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pageSlug={pageI.slug}
        title={`Create post on ${pageI.name}`}
        placeholder="Share your ideas and contribute to this page..."
        buttonText="Post"
        maxImages={4}
        onSuccess={handlePostSuccess}
        showSubtopics={true}
        // additionalFormData={{
        //   slug: pageI.id
        // }}
        topicId={pageI.topic.id}
      />
    </>
  );
}