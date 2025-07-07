// components/OptionsMenu/OptionsMenu.tsx
"use client"
import React, { useState, useRef, useEffect } from "react"
import styles from "./OptionsMenu.module.scss"
import { useTranslations } from "next-intl"
import { BsThreeDots } from "react-icons/bs"
import { FaTrash } from "react-icons/fa"
import { MdOutlineReportProblem } from "react-icons/md"

interface OptionsMenuProps {
    isAuthor: boolean
    onDelete: () => void
    onReport: () => void
    className?: string
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
    isAuthor,
    onDelete,
    onReport,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const t = useTranslations("web.common.actions")

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(false)
        onDelete()
    }

    const handleReport = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(false)
        onReport()
    }

    return (
        <div ref={menuRef} className={`${styles.container} ${className}`}>
            <button
                className={styles.menuButton}
                onClick={handleToggle}
                aria-label="Options menu"
            >
                <BsThreeDots size={20} />
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {isAuthor && (
                        <button
                            className={`${styles.option} ${styles.delete}`}
                            onClick={handleDelete}
                        >
                            <FaTrash size={14} />
                            {t("delete")}
                        </button>
                    )}
                    <button
                        className={`${styles.option} ${styles.report}`}
                        onClick={handleReport}
                    >
                        <MdOutlineReportProblem size={16} />
                        {t("report")}
                    </button>
                </div>
            )}
        </div>
    )
}