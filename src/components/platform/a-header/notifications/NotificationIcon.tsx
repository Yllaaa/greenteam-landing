"use client"
import { useEffect, useState } from 'react';

import io from 'socket.io-client';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const NotificationIcon = () => {
    const [notificationCount, setNotificationCount] = useState(0);
    // const [socket, setSocket] = useState(null);
    const router = useRouter();
    const locale = useLocale() // Default to 'en' if locale is undefined

    useEffect(() => {
        // Get the correct backend URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKENDAPI || '';
        const socketUrl = `${backendUrl}/api/v1/notifications`;

        try {
            // Initialize socket connection with error handling
            const socketInstance = io(socketUrl, {
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                transports: ['websocket', 'polling']
            });

            // setSocket(socketInstance);

            // Connection event handlers
            socketInstance.on('connect', () => {
                console.log('Socket connected successfully');
            });

            socketInstance.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            // Notification event handler
            socketInstance.on('notification', (data) => {
                console.log('Received notification:', data);
                setNotificationCount(prevCount => prevCount + 1);
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

    const handleIconClick = () => {
        router.push(`/${locale}/personal_menu`);
    };

    return (
        <div className="notification-icon-container" onClick={handleIconClick}>
            <div className="notification-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>

                {notificationCount > 0 && (
                    <div className="notification-badge">
                        {notificationCount > 99 ? '99+' : notificationCount}
                    </div>
                )}
            </div>

            <style jsx>{`
        .notification-icon-container {
          position: relative;
          cursor: pointer;
          width: 24px;
          height: 24px;
          margin: 0 10px;
        }
        
        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #ff4d4f;
          color: white;
          border-radius: 50%;
          min-width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          font-weight: bold;
        }
      `}</style>
        </div>
    );
};

export default NotificationIcon;