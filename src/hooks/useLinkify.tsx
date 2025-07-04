import React from 'react'
import styles from './useLinkify.module.scss' // Optional: if you want separate styles

export interface LinkifyOptions {
  linkClassName?: string
  mentionClassName?: string
  hashtagClassName?: string
  linkTarget?: '_blank' | '_self' | '_parent' | '_top'
  linkRel?: string
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, url: string) => void
  onMentionClick?: (e: React.MouseEvent<HTMLSpanElement>, mention: string) => void
  onHashtagClick?: (e: React.MouseEvent<HTMLSpanElement>, hashtag: string) => void
}

export const useLinkify = (options: LinkifyOptions = {}) => {
  const {
    linkClassName = styles.link,
    mentionClassName = styles.mention,
    hashtagClassName = styles.hashtag,
    linkTarget = '_blank',
    linkRel = 'noopener noreferrer',
    onLinkClick,
    onMentionClick,
    onHashtagClick,
  } = options

  const linkifyText = (text: string): React.ReactNode[] => {
    // Enhanced regex to match URLs, mentions, and hashtags
    const regex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(@[a-zA-Z0-9_]+)|(#[a-zA-Z0-9_]+)/g
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      if (!part) return null
      
      // Check if it's a URL
      if (part.match(/^(https?:\/\/|www\.)/)) {
        const href = part.startsWith('http') ? part : `https://${part}`
        return (
          <a
            key={index}
            href={href}
            target={linkTarget}
            rel={linkRel}
            className={linkClassName}
            onClick={(e) => {
              e.stopPropagation()
              onLinkClick?.(e, href)
            }}
          >
            {part}
          </a>
        )
      }
      
      // Check if it's a mention
      if (part.startsWith('@')) {
        return (
          <span 
            key={index} 
            className={mentionClassName}
            onClick={(e) => {
              e.stopPropagation()
              onMentionClick?.(e, part)
            }}
          >
            {part}
          </span>
        )
      }
      
      // Check if it's a hashtag
      if (part.startsWith('#')) {
        return (
          <span 
            key={index} 
            className={hashtagClassName}
            onClick={(e) => {
              e.stopPropagation()
              onHashtagClick?.(e, part)
            }}
          >
            {part}
          </span>
        )
      }
      
      return part
    })
  }

  // Advanced version with email support
  const linkifyTextAdvanced = (text: string): React.ReactNode[] => {
    const regex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(@[a-zA-Z0-9_]+)|(#[a-zA-Z0-9_]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      if (!part) return null
      
      // URL detection
      if (part.match(/^(https?:\/\/|www\.)/)) {
        const href = part.startsWith('http') ? part : `https://${part}`
        return (
          <a
            key={index}
            href={href}
            target={linkTarget}
            rel={linkRel}
            className={linkClassName}
            onClick={(e) => {
              e.stopPropagation()
              onLinkClick?.(e, href)
            }}
          >
            {part}
          </a>
        )
      }
      
      // Email detection
      if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return (
          <a
            key={index}
            href={`mailto:${part}`}
            className={linkClassName}
            onClick={(e) => {
              e.stopPropagation()
              onLinkClick?.(e, `mailto:${part}`)
            }}
          >
            {part}
          </a>
        )
      }
      
      // Mention detection
      if (part.startsWith('@')) {
        return (
          <span 
            key={index} 
            className={mentionClassName}
            onClick={(e) => {
              e.stopPropagation()
              onMentionClick?.(e, part)
            }}
          >
            {part}
          </span>
        )
      }
      
      // Hashtag detection
      if (part.startsWith('#')) {
        return (
          <span 
            key={index} 
            className={hashtagClassName}
            onClick={(e) => {
              e.stopPropagation()
              onHashtagClick?.(e, part)
            }}
          >
            {part}
          </span>
        )
      }
      
      return part
    })
  }

  return {
    linkifyText,
    linkifyTextAdvanced
  }
}