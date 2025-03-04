import Image from 'next/image'
import styles from './input.module.scss'
import sendIcon from '@/../public/chat/send.svg'
import microphoneIcon from '@/../public/chat/microphone.svg'
import { useRef } from 'react'
import { sendMessage } from './input.data'
import classNames from 'classnames'

export default function Input({ personId }: { personId: string }) {
    const inputRef = useRef<HTMLInputElement>(null);
    async function handleSend() {
        if (inputRef.current) {
            await sendMessage(personId, inputRef.current.value);
            inputRef.current.value = '';
        }
    }

    return (
        <div className={classNames(styles.input, { [styles.hidden]: personId === '' })}>
            <div className={styles.microphone}>
                <Image src={microphoneIcon} alt="microphone" width={42} height={43} />
            </div>
            <div className={styles.inputField}>
                <input ref={inputRef} type="text" placeholder="Type a message..." />
                <div className={styles.sendButton} onClick={handleSend}>
                    <Image className={styles.icon} src={sendIcon} alt="send" width={20} height={20} />
                </div>
            </div>
        </div>
    )
}
