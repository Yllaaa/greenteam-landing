'use client';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaCookie, FaTimes } from 'react-icons/fa';
import styles from './CookieConsent.module.scss';
import { useTranslations } from "next-intl"

interface CookieConsentProps {
    onAccept?: () => void;
    onRefuse?: () => void;
}

const COOKIE_CONSENT_KEY = 'cookie-consent-status';

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onRefuse }) => {
    const [showConsent, setShowConsent] = useState(false);
    const [mounted, setMounted] = useState(false);
    const t = useTranslations("cookies")

    useEffect(() => {
        setMounted(true);

        // Check if user has already made a choice
        const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consentStatus) {
            setShowConsent(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        setShowConsent(false);
        onAccept?.();
    };

    const handleRefuse = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'refused');
        setShowConsent(false);
        onRefuse?.();
    };

    // Don't render on server or if consent is not needed
    if (!mounted || !showConsent) {
        return null;
    }

    // Create portal to render over entire document
    return ReactDOM.createPortal(
        <div className={styles.cookieConsentOverlay}>
            <div className={styles.cookieConsentContainer}>
                <button
                    className={styles.closeButton}
                    onClick={handleRefuse}
                    aria-label="Close cookie consent"
                    type="button"
                >
                    <FaTimes />
                </button>

                <div className={styles.cookieIcon}>
                    <FaCookie />
                </div>

                <div className={styles.cookieContent}>
                    <h3 className={styles.cookieTitle}>{t("title")}</h3>
                    <p className={styles.cookieMessage}>
                        {t("description")}
                    </p>
                </div>

                <div className={styles.cookieActions}>
                    <button
                        className={`${styles.cookieButton} ${styles.refuseButton}`}
                        onClick={handleRefuse}
                        aria-label="Refuse cookies"
                    >
                        {t("refuse")}
                    </button>
                    <button
                        className={`${styles.cookieButton} ${styles.acceptButton}`}
                        onClick={handleAccept}
                        aria-label="Accept cookies"
                    >
                        {t("accept")}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CookieConsent;