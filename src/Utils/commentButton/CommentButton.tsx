import React, { useState } from 'react';
import { FaComment } from 'react-icons/fa';
import { CommentModal } from '@/components/AA-NEW/MODALS/COMMENTS/CommentModal';
import styles from './commentBtn.module.scss'; // Update with your actual styles path
import type { Post } from '@/types'
interface CommentButtonProps {
    postId: string;
    commentsCount: number | string;
    post: Post; // You'll need to import the Post type from your types
}

const CommentButton: React.FC<CommentButtonProps> = ({
    // postId,
    commentsCount,
    post
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                className={styles.btn}
                aria-label="Comment"
            >
                <FaComment style={{ fill: "#97B00F" }} />
                <p>
                    <span>{commentsCount}</span>
                </p>
            </button>

            <CommentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                post={post}
            />
        </>
    );
};

export default CommentButton;