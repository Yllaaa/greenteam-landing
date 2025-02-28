"use client"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('64.226.73.140:9000/api/v1/chat'); // Replace with your backend URL

console.log("socket", socket);

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
}

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    // Listen for incoming messages
    useEffect(() => {
        socket.on('receive_message', (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Cleanup on unmount
        return () => {
            socket.off('receive_message');
        };
    }, []);

    // Send a new message
    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: String(messages.length + 1), // Generate a unique ID
                text: message,
                sender: 'User', // Replace with actual user data if available
                timestamp: new Date().toISOString(),
            };
            socket.emit('send_message', newMessage);
            setMessage('');
        }
    };

    return (
        <div>
            <h1>Chat App</h1>
            <div>
                {messages.map((msg) => (
                    <div key={msg.id}>
                        <strong>{msg.sender}:</strong> {msg.text} <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;