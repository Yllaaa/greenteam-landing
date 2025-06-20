/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import styles from "./Avatar.module.scss"
import { getInitials } from "@/utils/string"
import Image from "next/image"

interface AvatarProps {
  src?: string | null
  name?: string | null | any
  size?: "small" | "medium" | "large"
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "medium",
  className = "",
}) => {
  if (src) {
    return (
      <Image
        src={src}
        alt={name || "User"}
        className={`${styles.avatar} ${styles[size]} ${className}`}
        width={size === "small" ? 32 : size === "medium" ? 48 : 64}
        height={size === "small" ? 32 : size === "medium" ? 48 : 64}
      />
    )
  }

  return (
    <div className={`${styles.avatarPlaceholder} ${styles[size]} ${className}`}>
      {getInitials(name)}
    </div>
  )
}
