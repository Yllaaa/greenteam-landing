/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import styles from './PrivacyPolicy.module.scss';

// Define proper types for translations
type TranslationFunction = ReturnType<typeof useTranslations>;

interface Section {
    id: string;
    titleKey: string;
    contentKey?: string;
    hasSubItems?: boolean;
    customContent?: (t: TranslationFunction) => React.ReactNode;
}

interface SectionRefs {
    [key: string]: HTMLElement | null;
}

const PrivacyPolicy: React.FC = () => {
    const t = useTranslations("landing.privacy");
    const sectionRefs = useRef<SectionRefs>({});

    // Memoize scroll function
    const scrollToSection = useCallback((sectionId: string) => {
        const element = sectionRefs.current[sectionId];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    // Helper function to set refs
    const setSectionRef = useCallback((sectionId: string) => {
        return (el: HTMLElement | null) => {
            sectionRefs.current[sectionId] = el;
        };
    }, []);

    const privacySections: Section[] = [
        {
            id: 'responsible',
            titleKey: 'sections.responsible.title',
            customContent: (t) => (
                <>
                    <p><strong>{t('sections.responsible.owner')}:</strong> GreenTeam.app - David Igual Rosado</p>
                    <p><strong>{t('sections.responsible.email')}:</strong> <a href="mailto:greenteamappoficial@gmail.com">greenteamappoficial@gmail.com</a></p>
                    <p><strong>{t('sections.responsible.dpo')}:</strong> {t('sections.responsible.dpoValue')}</p>
                </>
            )
        },
        {
            id: 'purposes',
            titleKey: 'sections.purposes.title',
            contentKey: 'sections.purposes.content',
            hasSubItems: true
        },
        {
            id: 'legitimation',
            titleKey: 'sections.legitimation.title',
            contentKey: 'sections.legitimation.content',
            hasSubItems: true
        },
        {
            id: 'data-categories',
            titleKey: 'sections.dataCategories.title',
            hasSubItems: true,
            customContent: (t) => (
                <ul>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <li key={i}>
                            <strong>{t(`sections.dataCategories.items.${i}.label`)}:</strong>{' '}
                            {t(`sections.dataCategories.items.${i}.value`)}
                        </li>
                    ))}
                </ul>
            )
        },
        {
            id: 'data-retention',
            titleKey: 'sections.dataRetention.title',
            contentKey: 'sections.dataRetention.content',
            hasSubItems: true
        },
        {
            id: 'data-transfer',
            titleKey: 'sections.dataTransfer.title',
            customContent: (t) => (
                <>
                    <p>{t('sections.dataTransfer.content')}</p>
                    <ul>
                        {[1, 2, 3].map(i => (
                            <li key={i}>{t(`sections.dataTransfer.items.${i}`)}</li>
                        ))}
                    </ul>
                    <p><strong>{t('sections.dataTransfer.international.title')}:</strong> {t('sections.dataTransfer.international.content')}</p>
                </>
            )
        },
        {
            id: 'security',
            titleKey: 'sections.security.title',
            contentKey: 'sections.security.content'
        },
        {
            id: 'rights',
            titleKey: 'sections.rights.title',
            customContent: (t) => (
                <>
                    <p>{t('sections.rights.content')}</p>
                    <ul>
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                            <li key={i}>
                                <strong>{t(`sections.rights.items.${i}.label`)}:</strong>{' '}
                                {t(`sections.rights.items.${i}.value`)}
                            </li>
                        ))}
                    </ul>
                    <div className={styles.contactBox}>
                        <p>{t('sections.rights.exerciseText')}</p>
                        <p>📧 <a href="mailto:greenteamappoficial@gmail.com">greenteamappoficial@gmail.com</a></p>
                    </div>
                    <p>{t('sections.rights.complaint')}</p>
                    <p>🔗 <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">https://www.aepd.es</a></p>
                </>
            )
        },
        {
            id: 'age',
            titleKey: 'sections.age.title',
            contentKey: 'sections.age.content'
        },
        {
            id: 'changes',
            titleKey: 'sections.changes.title',
            contentKey: 'sections.changes.content'
        },
        {
            id: 'contact',
            titleKey: 'sections.contact.title',
            customContent: (t) => (
                <div className={styles.contactBox}>
                    <p>{t('sections.contact.content')}</p>
                    <p>📧 <a href="mailto:greenteamappoficial@gmail.com">greenteamappoficial@gmail.com</a></p>
                </div>
            )
        }
    ];

    const cookieSections: Section[] = [
        {
            id: 'what-are-cookies',
            titleKey: 'cookies.whatAre.title',
            contentKey: 'cookies.whatAre.content',
            hasSubItems: true
        },
        {
            id: 'cookie-types',
            titleKey: 'cookies.types.title',
            customContent: (t) => (
                <>
                    <p>{t('cookies.types.intro')}</p>

                    <h4>{t('cookies.types.technical.title')}</h4>
                    <p>{t('cookies.types.technical.description')}</p>
                    <p><em>{t('cookies.types.technical.example')}</em></p>

                    <h4>{t('cookies.types.analytics.title')}</h4>
                    <p>{t('cookies.types.analytics.description')}</p>
                    <p><em>{t('cookies.types.analytics.provider')}</em></p>
                </>
            )
        },
        {
            id: 'cookie-sharing',
            titleKey: 'cookies.sharing.title',
            customContent: (t) => (
                <>
                    <p><strong>{t('cookies.sharing.noSharing')}</strong></p>
                    <p>{t('cookies.sharing.technical')}</p>
                </>
            )
        },
        {
            id: 'cookie-configuration',
            titleKey: 'cookies.configuration.title',
            customContent: (t) => (
                <>
                    <p>{t('cookies.configuration.firstAccess')}</p>
                    <p>{t('cookies.configuration.modify')}</p>
                    <p>{t('cookies.configuration.browserSettings')}</p>
                    <ul className={styles.browserLinks}>
                        <li><strong>Google Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">{t('cookies.configuration.configureLink')}</a></li>
                        <li><strong>Mozilla Firefox:</strong> <a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer">{t('cookies.configuration.configureLink')}</a></li>
                        <li><strong>Safari:</strong> <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">{t('cookies.configuration.configureLink')}</a></li>
                        <li><strong>Microsoft Edge:</strong> <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge" target="_blank" rel="noopener noreferrer">{t('cookies.configuration.configureLink')}</a></li>
                    </ul>
                    <div className={styles.warningBox}>
                        <p>⚠️ {t('cookies.configuration.warning')}</p>
                    </div>
                </>
            )
        },
        {
            id: 'cookie-changes',
            titleKey: 'cookies.changes.title',
            contentKey: 'cookies.changes.content'
        },
        {
            id: 'cookie-contact',
            titleKey: 'cookies.contact.title',
            customContent: (t) => (
                <div className={styles.contactBox}>
                    <p>{t('cookies.contact.content')}</p>
                    <p>📧 <a href="mailto:greenteamappoficial@gmail.com">greenteamappoficial@gmail.com</a></p>
                </div>
            )
        }
    ];

    const renderSection = useCallback((section: Section) => {
        if (section.customContent) {
            return section.customContent(t);
        }

        if (section.hasSubItems && section.contentKey) {
            const items: string[] = [];
            let i = 1;

            // Safely check for items without throwing errors
            while (true) {
                try {
                    const itemKey = `${section.contentKey}.items.${i}`;

                    // Use t.has() if available in your next-intl version
                    // Otherwise, wrap in try-catch
                    const hasKey = (t as any).has?.(itemKey);

                    if (hasKey === false) {
                        break;
                    }

                    // If .has() is not available, try to get the value
                    const item = t(itemKey as any);

                    // Break if we get back the key itself (translation missing)
                    if (!item || item === itemKey) {
                        break;
                    }

                    items.push(item);
                    i++;

                    // Safety limit
                    if (i > 20) {
                        break;
                    }
                } catch (error) {
                    // Break on any error (likely missing translation)
                    console.log(error)
                    break;
                }
            }

            return (
                <>
                    {t.rich && t.rich(`${section.contentKey}.intro` as any) || <p>{t(`${section.contentKey}.intro` as any)}</p>}
                    {items.length > 0 && (
                        <ul>
                            {items.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    )}
                </>
            );
        }

        if (section.contentKey) {
            return <p>{t(section.contentKey as any)}</p>;
        }

        return null;
    }, [t]);

    return (
        <div className={styles.container}>
            <nav className={styles.navigation} aria-label="Privacy Policy Navigation">
                <div className={styles.navContent}>
                    <h3>{t('navigation.title')}</h3>
                    <ul>
                        {privacySections.map(section => (
                            <li key={section.id}>
                                <button
                                    onClick={() => scrollToSection(section.id)}
                                    type="button"
                                    aria-label={`Navigate to ${t(section.titleKey)}`}
                                >
                                    {t(section.titleKey)}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <h3>{t('navigation.cookiesTitle')}</h3>
                    <ul>
                        {cookieSections.map(section => (
                            <li key={section.id}>
                                <button
                                    onClick={() => scrollToSection(section.id)}
                                    type="button"
                                    aria-label={`Navigate to ${t(section.titleKey)}`}
                                >
                                    {t(section.titleKey)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            <main className={styles.content}>
                <header className={styles.header}>
                    <h1>{t('title')}</h1>
                    <p className={styles.lastUpdate}>
                        <time dateTime="2025-05-16">{t('lastUpdate')}: 16/05/2025</time>
                    </p>
                    <p className={styles.intro}>{t('intro')}</p>
                </header>

                <div className={styles.sections}>
                    {privacySections.map((section, index) => (
                        <section
                            key={section.id}
                            id={section.id}
                            ref={setSectionRef(section.id)}
                            className={styles.section}
                            aria-labelledby={`heading-${section.id}`}
                        >
                            <h2 id={`heading-${section.id}`}>{`${index + 1}. ${t(section.titleKey)}`}</h2>
                            {renderSection(section)}
                        </section>
                    ))}
                </div>

                <hr className={styles.divider} aria-hidden="true" />

                <header className={styles.header}>
                    <h1>{t('cookies.title')}</h1>
                    <p className={styles.lastUpdate}>
                        <time dateTime="2025-05-16">{t('lastUpdate')}: 16/05/2025</time>
                    </p>
                    <p className={styles.intro}>{t('cookies.intro')}</p>
                </header>

                <div className={styles.sections}>
                    {cookieSections.map((section, index) => (
                        <section
                            key={section.id}
                            id={section.id}
                            ref={setSectionRef(section.id)}
                            className={styles.section}
                            aria-labelledby={`cookie-heading-${section.id}`}
                        >
                            <h2 id={`cookie-heading-${section.id}`}>{`${index + 1}. ${t(section.titleKey)}`}</h2>
                            {renderSection(section)}
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;