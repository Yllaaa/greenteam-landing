'use client';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaCookie } from 'react-icons/fa';
import styles from './CookieConsent.module.scss';

interface CookieConsentProps {
    onAccept?: () => void;
    onRefuse?: () => void;
}

const COOKIE_CONSENT_KEY = 'cookie-consent-status';

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
    const [showConsent, setShowConsent] = useState(false);
    const [mounted, setMounted] = useState(false);

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

    // const handleRefuse = () => {
    //     localStorage.setItem(COOKIE_CONSENT_KEY, 'refused');
    //     setShowConsent(false);
    //     onRefuse?.();
    // };

    // Don't render on server or if consent is not needed
    if (!mounted || !showConsent) {
        return null;
    }

    // Create portal to render over entire document
    return ReactDOM.createPortal(
        <div className={styles.cookieConsentOverlay}>
            <div className={styles.cookieConsentContainer}>
                <div className={styles.cookieIcon}>
                    <FaCookie />
                </div>

                <div className={styles.cookieContent}>
                    <h3 className={styles.cookieTitle}>¿Qué tipos de cookies usamos?</h3>
                    <p className={styles.cookieMessage}>
                        {`En GreenTeam.app no compartimos tu información con terceros para fines publicitarios. Usamos únicamente cookies esenciales y analíticas mínimas necesarias para el funcionamiento técnico y la mejora del servicio.`}
                    </p>
                </div>

                <div className={styles.cookieActions}>
                    {/* <button
                        className={`${styles.cookieButton} ${styles.refuseButton}`}
                        onClick={handleRefuse}
                        aria-label="Refuse cookies"
                    >
                        Refuse
                    </button> */}
                    <button
                        className={`${styles.cookieButton} ${styles.acceptButton}`}
                        onClick={handleAccept}
                        aria-label="Accept cookies"
                    >
                        Aceptar cookies esenciales
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CookieConsent;