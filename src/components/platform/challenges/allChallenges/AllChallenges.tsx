'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Challenge } from './allChallenges.data'
import axios from 'axios'
import { getToken } from '@/Utils/userToken/LocalToken'
import styles from './AllChallenges.module.scss'
import logo from '@/../public/personal/menu/notifications/logo.png'
import Image from 'next/image'
import ToastNot from '@/Utils/ToastNotification/ToastNot'

function AllChallenges() {
  const token = getToken()
  const accessToken = token ? token.accessToken : null
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState('')
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)

  // Reference to the last challenge element for intersection observer
  const observer = useRef<IntersectionObserver | null>(null)
  const lastChallengeRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return

      // If there's already an observer, disconnect it
      if (observer.current) observer.current.disconnect()

      // Create a new observer
      observer.current = new IntersectionObserver((entries) => {
        // If the last element is visible and we have more data to load
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      // Observe the last element
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  // Function to fetch challenges
  const fetchChallenges = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/green-challenges/todo-list?page=${pageNum}&limit=3`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        )

        const newChallenges = response.data

        // Check if we have more data
        if (newChallenges.length === 0 || newChallenges.length < 3) {
          setHasMore(false)
        }

        // If it's the first page, replace the data, otherwise append
        setAllChallenges((prevChallenges) =>
          pageNum === 1 ? newChallenges : [...prevChallenges, ...newChallenges]
        )
      } catch (error) {
        console.error('Error fetching challenges:', error)
        setError('Failed to load challenges. Please try again later.')
      } finally {
        setLoading(false)
      }
    },
    [accessToken]
  )

  // Load initial data
  useEffect(() => {
    fetchChallenges(1)
  }, [fetchChallenges])

  // Load more data when page changes
  useEffect(() => {
    if (page > 1) {
      fetchChallenges(page)
    }
  }, [page, fetchChallenges])

  const handleDone = async (challengeId: string, message: string, isDelete = false) => {
    try {
      // setActionInProgress(challengeId)

      // Determine the API endpoint based on the action (delete or mark as done)
      // Note: You might need to update this endpoint for delete action
      const endpoint = isDelete
        ? `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/green-challenges/${challengeId}/delete`
        : `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/challenges/green-challenges/${challengeId}/mark-as-done`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        ToastNot(`${message}`);

        // Update the challenges list by removing the completed/deleted challenge
        setAllChallenges((prevChallenges) =>
          prevChallenges.filter(challenge => challenge.id !== challengeId)
        );

        // If our list becomes too short after removing an item, fetch more
        if (allChallenges.length <= 3) {
          // Reset page to 1 to refresh the entire list
          setPage(1);
          setHasMore(true);
          fetchChallenges(1);
        }
      }
    } catch (error) {
      console.error("Error handling action:", error);
      ToastNot("Error occurred");
    } finally {
      setActionInProgress(null);
    }
  }

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      {allChallenges.map((challenge, index) => {
        // Apply ref to the last element
        if (allChallenges.length === index + 1) {
          return (
            <div
              key={challenge.id}
              ref={lastChallengeRef}
              className={styles.challengeItem}
            >
              <div>
                <Image src={logo} alt={challenge.title} />
              </div>

              <div className={styles.text}>
                <h2>{challenge.title}</h2>
                <p>{challenge.description}</p>
              </div>
              <div className={styles.action}>
                <button
                  onClick={() => handleDone(challenge.id, "Challenge deleted successfully", false)}
                  className={styles.delete}
                  disabled={actionInProgress === challenge.id}
                >
                  {actionInProgress === challenge.id ? 'Processing...' : 'Delete'}
                </button>
                <button
                  onClick={() => handleDone(challenge.id, "Challenge completed successfully", false)}
                  className={styles.accept}
                  disabled={actionInProgress === challenge.id}
                >
                  {actionInProgress === challenge.id ? 'Processing...' : 'Done'}
                </button>
              </div>
            </div>
          )
        } else {
          return (
            <div key={challenge.id} className={styles.challengeItem}>
              <div>
                <Image src={logo} alt={challenge.title} />
              </div>
              <div className={styles.text}>
                <h2>{challenge.title}</h2>
                <p>{challenge.description}</p>
              </div>
              <div className={styles.action}>
                <button
                  onClick={() => handleDone(challenge.id, "Challenge deleted successfully", false)}
                  className={styles.delete}
                  disabled={actionInProgress === challenge.id}
                >
                  {actionInProgress === challenge.id ? 'Processing...' : 'Delete'}
                </button>
                <button
                  onClick={() => handleDone(challenge.id, "Challenge completed successfully", false)}
                  className={styles.accept}
                  disabled={actionInProgress === challenge.id}
                >
                  {actionInProgress === challenge.id ? 'Processing...' : 'Done'}
                </button>
              </div>
            </div>
          )
        }
      })}

      {loading && <p className={styles.loading}>Loading more challenges...</p>}

      {!hasMore && allChallenges.length > 0 && (
        <p className={styles.noMore}>No more challenges to load</p>
      )}
    </div>
  )
}

export default AllChallenges