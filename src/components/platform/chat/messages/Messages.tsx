import { useRef, useEffect, useState } from 'react';
import { getMessageItems, getUserId, MessageItem } from './messages.data';
import styles from './messages.module.scss'
import Item from './Item';
import Empty from './empty/Empty';

export default function Messages({ personId }: { personId: string }) {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const messagesDivRef = useRef<HTMLDivElement>(null);
    const userId = getUserId();

    function scrollToBottom() {
        if (messagesDivRef.current) {
            messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
        }
    }

    useEffect(() => {
        getMessageItems(personId).then(messages => {
            setMessages(messages)
            setTimeout(scrollToBottom, 100)
        })
    }, [personId])

    return (
        <div className={styles.messages} ref={messagesDivRef}>
            {(messages.length === 0 || personId === '') && <Empty />}
            {messages.map((message, index) => (
                <Item key={index} userId={userId} {...message} />
            ))}
        </div>
    )
}