import { useEffect, useState } from 'react';
import { getMessageItems, getUserId, MessageItem } from './messages.data';
import styles from './messages.module.scss'
import Item from './Item';
import Empty from './empty/Empty';

export default function Messages({ personId }: { personId: string }) {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const userId = getUserId();

    useEffect(() => {
        getMessageItems(personId).then(setMessages)
    }, [personId])

    return (
        <div className={styles.messages}>
            {(messages.length === 0 || personId === '') && <Empty />}
            {messages.map((message, index) => (
                <Item key={index} userId={userId} {...message} />
            ))}
        </div>
    )
}