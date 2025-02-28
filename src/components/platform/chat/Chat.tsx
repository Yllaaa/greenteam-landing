'use client'
import { useState } from 'react';
import styles from './chat.module.scss'
import Input from './input/Input'
import Messages from './messages/Messages'
import Persons from './persons/Persons'


export default function Chat() {
    const [personId, setPersonId] = useState<string>('');

    return (
        <div className={styles.chat}>
            <div className={styles.header}>Messages</div>
            <div className={styles.content}>
                <Persons personId={personId} setPersonId={setPersonId} />
                <div className={styles.messagesView}>
                    <Messages personId={personId} />
                    <Input personId={personId} />
                </div>
            </div>
        </div>
    )
}