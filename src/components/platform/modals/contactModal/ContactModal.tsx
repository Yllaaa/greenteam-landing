import React, { useState, useEffect } from "react";
import styles from "./ContactModal.module.scss";
import Modal from "./Modal";
import axios from "axios";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { SkeletonCircle, SkeletonText } from "./Skeketon";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    sellerId: string;
    sellerName?: string;
    sellerTitle?: string;
    sellerAvatar?: string;
    accessToken?: string;
}

interface Contact {
    id: string;
    name: string;
    title: string;
    email: string;
    phoneNum: string;
    avatarUrl?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({
    isOpen,
    onClose,
    sellerId,
    sellerName = "Seller Information",
    sellerTitle = "Contact Details",
    sellerAvatar,
    accessToken,
}) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !sellerId || !accessToken) return;

        setLoading(true);
        setError(null);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${sellerId}/contact-by-id`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            .then((response) => {
                setContacts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching contact data:", error);
                setError("Failed to load contacts. Please try again.");
                setLoading(false);
            });
    }, [isOpen, accessToken, sellerId]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={styles.contactModal}
        >
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    {sellerAvatar ? (
                        <Image
                            src={sellerAvatar}
                            alt={sellerName}
                            width={60}
                            height={60}
                        />
                    ) : (
                        <FaUser size={30} />
                    )}
                </div>
                <div className={styles.profileInfo}>
                    <h3>{sellerName}</h3>
                    <p>{sellerTitle}</p>
                </div>
            </div>

            <div className={styles.contactList}>
                {loading ? (
                    // Loading skeleton
                    Array(2).fill(0).map((_, i) => (
                        <div key={i} className={styles.contactItem}>
                            <div className={styles.contactAvatar}>
                                <SkeletonCircle size="40px" />
                            </div>
                            <div className={styles.contactDetails}>
                                <SkeletonText noOfLines={2} spacing="2" />
                            </div>
                        </div>
                    ))
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : contacts.length > 0 ? (
                    contacts.map((contact) => (
                        <div key={contact.id} className={styles.contactItem}>
                            <div className={styles.contactAvatar}>
                                {contact.avatarUrl ? (
                                    <Image
                                        src={contact.avatarUrl}
                                        alt={contact.name}
                                        width={40}
                                        height={40}
                                    />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        {contact.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className={styles.contactDetails}>
                                <div className={styles.contactRow}>
                                    <span className={styles.label}>NAME</span>
                                    <span className={styles.value}>{contact.name}</span>
                                </div>

                                <div className={styles.contactRow}>
                                    <span className={styles.label}>TITLE</span>
                                    <span className={styles.value}>{contact.title || "Not specified"}</span>
                                </div>

                                {contact.email && (
                                    <div className={styles.contactInfo}>
                                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                                    </div>
                                )}

                                {contact.phoneNum && (
                                    <div className={styles.contactInfo}>
                                        <a href={`tel:${contact.phoneNum}`}>{contact.phoneNum}</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>No contacts available for this seller.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ContactModal;