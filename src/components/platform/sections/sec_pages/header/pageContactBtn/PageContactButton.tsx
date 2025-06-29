"use client";
import React, { useState, useEffect } from "react";
import { Plus, User } from "lucide-react";
import styles from "./PageContactButton.module.css";
import PageContactModal from "./PageContactModal";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useTranslations } from "next-intl";

interface Contact {
    id: string;
    pageId: string;
    name: string;
    title: string;
    email: string;
    phoneNum: string;
}

interface PageContactButtonProps {
    slug: string;
}

const PageContactButton: React.FC<PageContactButtonProps> = ({ slug }) => {
    const t = useTranslations('web.pageContact');
    const [showModal, setShowModal] = useState(false);
    const [hasContact, setHasContact] = useState(false);
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);

    const token = getToken();
    const accessToken = token ? token.accessToken : null;

    

    const fetchContact = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${slug}/contact`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.data.contact) {
                setContact(response.data.contact[0]);
                setHasContact(true);
            } else {
                console.log("btn",response.data)
                setHasContact(false);
                setContact(null);
            }
        } catch (error) {
            console.error("Error fetching contact:", error);
            setHasContact(false);
            setContact(null);
        } finally {
            setLoading(false);
        }
    };
    // Fetch contact on mount
    useEffect(() => {
        fetchContact();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);
    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        fetchContact(); // Refresh contact data after modal closes
    };

    return (
        <>
            <button
                className={styles.contactButton}
                onClick={handleButtonClick}
                disabled={loading}
            >
                {hasContact ? (
                    <>
                        <User className={styles.buttonIcon} />
                        {t('button.manageContact')}
                    </>
                ) : (
                    <>
                        <Plus className={styles.buttonIcon} />
                        {t('button.addContact')}
                    </>
                )}
            </button>

            {showModal && (
                <PageContactModal
                    slug={slug}
                    contact={contact}
                    hasContact={hasContact}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default PageContactButton;