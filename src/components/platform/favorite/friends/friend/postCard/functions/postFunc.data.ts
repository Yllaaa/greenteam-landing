import axios from "axios";

import { PostsData } from "../types/postTypes.data";
import { useCallback } from "react";

export const fetchPosts = async (
  page: number,
  limit: number,
  setPostContent: React.Dispatch<React.SetStateAction<PostsData>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  accessToken: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    // Build URL parameters once

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/users/favorites/liked-posts?limit=${limit}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );

    setPostContent((prev) => {
      if (response.data.length >= 0 && page === 1) {
        return response.data;
      } else if (response.data.length >= 0 && page > 1) {
        return [...prev, ...response.data];
      }
      return response.data;
    });
  } catch (error) {
    setErrorMessage("An Error Occurred");
    console.error("Error fetching posts:", error);
  } finally {
    setLoading(false);
  }
};

export const formatTimeDifference = (isMounted: boolean) => {
  const MyComponent = () => {
    useCallback((targetDate: string): string => {
      if (!isMounted) return ""; // Prevent SSR/CSR mismatch

      const target = new Date(targetDate);
      const now = new Date();
      const differenceInMs = now.getTime() - target.getTime();
      const differenceInSeconds = Math.floor(differenceInMs / 1000);

      if (differenceInSeconds < 60) {
        return `${differenceInSeconds}S`;
      } else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes}m`;
      } else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours}hr`;
      } else {
        const days = Math.floor(differenceInSeconds / 86400);
        return `${days}D`;
      }
    }, []);
  };

  return MyComponent;
};
