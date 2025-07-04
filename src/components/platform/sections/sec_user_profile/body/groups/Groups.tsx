"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CommunityGroups } from "./groups.data";
import styles from "./groups.module.scss";
import Item from "./Item";
import { getToken } from "@/Utils/userToken/LocalToken";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import axios from "axios";
import AddNewGroup from "@/components/AA-NEW/MODALS/ADD_GROUP/AddNewGroup";
import { FaPlus } from "react-icons/fa"; // Import plus icon
import { ProfileResponse } from '../all/all.data';

function Groups(props: { username: string, user: ProfileResponse }) {
  const { username, user } = props;
  const [groupsArray, setGroupsArray] = useState<CommunityGroups>([]);
  const [showAddNewGroup, setShowAddNewGroup] = useState(false); // State for controlling modal visibility

  // pagination
  const limit = 5;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const bodyRef = useRef<HTMLDivElement>(null);

  // Get token only once
  const localeS = useRef(getToken());
  const accessToken = localeS.current ? localeS.current.accessToken : null;

  const fetchPages = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        // Use different loading state for initial vs pagination loading
        if (replace) {
          setIsLoading(true);
        } else {
          setIsPaginationLoading(true);
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/${username}/groups?limit=${limit}&page=${pageNum}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

        const data = response.data;

        // Check if we've reached the end of available GroupArray
        if (data.length < limit) {
          setHasMore(false);
          if (data.length === 0 && pageNum > 1) {
          }
        } else {
          setHasMore(true);
        }

        setGroupsArray((prev) => {
          if (replace) {
            return data;
          }
          return [...prev, ...data];
        });

        return data;
      } catch (error) {
        console.error("Failed to fetch forums:", error);
        setErrorMessage("An Error Occurred");
        throw error;
      } finally {
        setIsLoading(false);
        setIsPaginationLoading(false);
      }
    },
    [accessToken, username] // Only include accessToken in dependencies
  );

  // Initial load - use a ref to ensure this only runs once
  const initialFetchRef = useRef(false);

  useEffect(() => {
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchPages(1, true);
    }
  }, [fetchPages]);

  // Load more pages when page changes
  useEffect(() => {
    // Skip the initial page load since we handle that separately
    if (page > 1 && !isLoading) {
      fetchPages(page, false);
    }
  }, [page, fetchPages, isLoading]);

  // Scroll event handler for infinite scrolling and scroll button state
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading || isPaginationLoading)
      return;

    const container = bodyRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Load more when user has scrolled to 80% of the content
    if (
      scrollLeft + clientWidth >= scrollWidth * 0.8 &&
      !isPaginationLoading &&
      hasMore
    ) {
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
    if (isLoading && groupsArray.length === 0) {
      return (
        <div className={styles.noPosts}>
          <LoadingTree />
        </div>
      );
    }

    if (errorMessage && groupsArray.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (groupsArray.length === 0) {
      return (
        <div className={styles.noPosts}>
          <p>No groups found</p>
        </div>
      );
    }

    return (
      <>
        <div className={styles.groupsContainer}>
          <div className={styles.groups}>
            {groupsArray.map((group, index) => (
              <Item
                key={index} // Use ID if available for more stable keys
                group={group}
                page={page}
                setPage={setPage}
                index={index}
                length={groupsArray.length}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Groups</h2>
        {user.isMyProfile &&
          <button
            className={styles.createGroupButton}
            onClick={() => setShowAddNewGroup(true)}
          >
            <FaPlus /> Create Group
          </button>
        }
      </div>

      <div ref={bodyRef} className={styles.content}>
        {renderContent()}
      </div>

      {/* Modal for creating new group */}
      {showAddNewGroup && (
        <AddNewGroup setAddNew={setShowAddNewGroup} />
      )}
    </>
  );
}

export default Groups;