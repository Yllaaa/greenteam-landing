// components/buttons/postAdd/AddPostButton.tsx
import React from "react"
import styles from "./AddPostButton.module.scss"

interface AddPostButtonProps {
  onClick: () => void
  variant?: "button" | "icon"
  title: string
}

export const AddPostButton: React.FC<AddPostButtonProps> = ({
  onClick,
  variant = "button",
  title,
}) => {
  //   const t = useTranslations('web.post.addPost');

  if (variant === "icon") {
    return (
      <button
        className={styles.iconButton}
        onClick={onClick}
        aria-label={title}
        type="button">
        <svg
          className={styles.addIcon}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      className={styles.button}
      onClick={onClick}
      type="button">
      <svg
        className={styles.buttonIcon}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 5V19M5 12H19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{title}</span>
    </button>
  )
}