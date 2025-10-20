/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState, useRef, MouseEvent } from 'react';
import io from 'socket.io-client';
import styles from './NotificationIcon.module.scss';
import Notifications from './notifications/Notifications';
import { getToken } from '@/Utils/userToken/LocalToken';

const NotificationIcon = () => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Get the correct backend URL - matching your Postman URL
        const backendUrl = `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/notification`|| 'https://api.greenteam.app/api/v1/notification';
        const token = getToken()
        console.log("token",token.accessToken)
        try {
            // Initialize socket connection
            const socketInstance = io(backendUrl, {
                // path: '/api/v1/notifications',
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                transports: ['websocket', 'polling'],
                auth: {
                    token: `Bearer ${token ? token.accessToken : ''}`,
                },

            });
            console.log('Socket initialized:', socketInstance);

            // Connection event handlers
            socketInstance.on('connect', () => {
                console.log('Socket connected successfully');
                console.log('Socket ID:', socketInstance.id);
            });

            socketInstance.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            socketInstance.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
            });

            // Listen for the "notification" event
            socketInstance.on('notification', (data) => {
                console.log('Received notification:', data);

                // Increment notification count
                setNotificationCount(prevCount => prevCount + 1);

                // Add shake animation when new notification arrives
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 500);
            });

            // Clean up on component unmount
            return () => {
                if (socketInstance) {
                    socketInstance.disconnect();
                }
            };
        } catch (error) {
            console.error('Error initializing socket:', error);
        }
    }, []);

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsDropdownOpen(prevState => !prevState);

        // Reset the notification count when opened
        if (!isDropdownOpen) {
            setNotificationCount(0);
        }
    };

    return (
        <div className={styles['notification-wrapper']} ref={dropdownRef}>
            <div
                className={`${styles['notification-icon-container']} ${isShaking ? styles['notification-shake'] : ''}`}
                onClick={handleIconClick}
            >
                <div className={styles['notification-icon']}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>

                    {notificationCount > 0 && (
                        <div className={styles['notification-badge']}>
                            {notificationCount > 99 ? '99+' : notificationCount}
                        </div>
                    )}
                </div>
            </div>

            {isDropdownOpen && (
                <div className={styles['notification-dropdown']}>
                    <div className={styles['dropdown-header']}>
                        <h3>Notifications</h3>
                    </div>
                    <div className={styles['dropdown-content']}>
                        <Notifications />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationIcon;