"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Item from "./Item";
import styles from "./notifications.module.scss";
import { getToken } from "@/Utils/userToken/LocalToken";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import { NotificationItem } from './notifications.data';
import { useLocale } from 'next-intl';
type NotificationsArray = NotificationItem[];

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationsArray>([]);

  // Pagination states
  const limit = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [endOfResults, setEndOfResults] = useState(false);

  // Refs
  const bodyRef = useRef<HTMLDivElement>(null);
  const initialFetchRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Add this useEffect for dynamic height adjustment
  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        // Adjust height based on viewport - more dynamic than fixed height
        const viewportHeight = window.innerHeight;
        // const headerHeight = 120; // Estimate header height
        const idealHeight = Math.min(350, viewportHeight * 0.6);
        containerRef.current.style.height = `${idealHeight}px`;
      }
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);
  // Get token
  const localeS = useRef(getToken());
  const accessToken = localeS.current ? localeS.current.accessToken : null;
  const locale = useLocale()
  const fetchNotifications = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        if (replace) {
          setIsLoading(true);
          setEndOfResults(false);
        } else {
          setIsPaginationLoading(true);
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/notifications?limit=${limit}&page=${pageNum}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
              "Accept-Language": `${locale}`,
            },
          }
        );

        const data: NotificationItem[] = response.data;

        if (data.length < limit) {
          setHasMore(false);
          if (data.length === 0 && pageNum > 1) {
            setEndOfResults(true);
          }
        } else {
          setHasMore(true);
        }

        setNotifications((prev) => {
          if (replace) {
            return data;
          }
          return [...prev, ...data];
        });

        return data;
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setErrorMessage("An Error Occurred");
        throw error;
      } finally {
        setIsLoading(false);
        setIsPaginationLoading(false);
      }
    },
    [accessToken, locale]
  );


  // Initial load
  useEffect(() => {
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchNotifications(1, true);
    }
  }, [fetchNotifications]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1 && !isLoading) {
      fetchNotifications(page, false);
    }
  }, [page, fetchNotifications, isLoading]);

  // Scroll handler for infinite scrolling
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading || isPaginationLoading) return;

    const { scrollTop, clientHeight, scrollHeight } = bodyRef.current;

    // Load more when user has scrolled to 80% of the content
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoading, isPaginationLoading]);

  // Add scroll event listener
  useEffect(() => {
    const currentRef = bodyRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  // Render content based on state
  const renderContent = () => {
    if (isLoading && notifications.length === 0) {
      return (
        <div className={styles.noNotifications}>
          <LoadingTree />
        </div>
      );
    }

    if (errorMessage && notifications.length === 0) {
      return (
        <div className={styles.noNotifications}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className={styles.noNotifications}>
          <p>No notifications found</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={containerRef} className={styles.notificationsContainer}>
      <div ref={bodyRef} className={styles.notifications}>
        {notifications.map((notification) => (
          <Item key={notification.id} {...notification} />
        ))}
      </div>

      {renderContent()}

      {isPaginationLoading && (
        <div className={styles.paginationLoader}>
          <LoadingTree />
        </div>
      )}

      {endOfResults && (
        <p className={styles.endMessage}>End of results</p>
      )}
    </div>
  );
}