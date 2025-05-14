/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import styles from './ChatIcon.module.scss';
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useLocale } from 'next-intl';

interface ChatIconProps {
    className?: string;
    userId?: string;
    accessToken?: string;
}

const SOCKET_URL = "https://greenteam.yllaaa.com/api/v1/chat";

const ChatIcon: React.FC<ChatIconProps> = ({ className = '', userId, accessToken }) => {
    const locale = useLocale()
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // Only initialize socket if we have authentication
        if (!accessToken || !userId) return;

        // Initialize socket connection
        const socketInstance = io(SOCKET_URL, {
            auth: {
                token: accessToken
            },
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // Set up socket event listeners
        socketInstance.on('connect', () => {
            console.log('Connected to chat socket');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from chat socket');
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Chat socket connection error:', error);
            setIsConnected(false);
        });

        // Listen for new messages
        socketInstance.on('newMessage', (data) => {
            console.log('New message received:', data);
            // Increment unread count
            setUnreadCount((prev) => prev + 1);

            // You can also play a sound notification here if desired
            // const audio = new Audio('/notification-sound.mp3');
            // audio.play().catch(e => console.error('Error playing notification sound:', e));
        });


        // Initial fetch of unread count (if you have an API for this)
        fetchUnreadCount();

        // Clean up on unmount
        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [accessToken, userId]);

    // Fetch initial unread count
    const fetchUnreadCount = async () => {
        if (!accessToken) return;

        try {
            // Example API call to get unread message count
            const response = await fetch(`${SOCKET_URL}/unread-count`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.count);
            }
        } catch (error) {
            console.error('Error fetching unread message count:', error);
        }
    };

    // Navigate to chat page
    const handleClick = () => {
        router.push(`/${locale}/chat`);
    };


    return (
        <div className={`${styles.chatIconContainer} ${className}`} onClick={handleClick}>
            <div className={styles.iconWrapper}>
                <IoChatbubbleEllipsesSharp className={`${styles.chatIcon} ${unreadCount > 0 ? styles.hasUnread : ''}`} />

                {/* Connection status indicator */}
                <div className={`${styles.connectionIndicator} ${isConnected ? styles.connected : styles.disconnected}`} />

                {/* Unread count badge */}
                {unreadCount > 0 && (
                    <div className={styles.badge}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatIcon;