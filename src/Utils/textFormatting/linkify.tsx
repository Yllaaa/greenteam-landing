'use client';
import React, { useState } from 'react';

interface LinkifyOptions {
    className?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    onClick?: (e: React.MouseEvent) => void;
    detectBrTags?: boolean;
    maxLinkTextLength?: number;
    maxTextLength?: number;
    readMoreText?: string;
    readLessText?: string;
    readMoreClassName?: string;
}

/**
 * Converts URLs in text into clickable links and optionally <br/> tags into line breaks
 * With support for "Read More" functionality
 * 
 * @param text - The text to process
 * @param options - Optional styling and behavior configuration
 * @returns JSX element with clickable links, line breaks, and read more functionality
 */
export const LinkifyText: React.FC<{ text: string; options?: LinkifyOptions }> = ({
    text,
    options = {}
}) => {
    const {
        className = 'content-link',
        target = '_blank',
        rel = 'noopener noreferrer',
        onClick = (e) => e.stopPropagation(),
        detectBrTags = true,
        maxLinkTextLength,
        maxTextLength,
        readMoreText = 'Read More',
        readLessText = 'Read Less',
        readMoreClassName = 'read-more-btn'
    } = options;

    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return <span></span>;

    // Determine if we need to truncate
    const shouldTruncate = maxTextLength && text.length > maxTextLength;
    const displayText = shouldTruncate && !isExpanded
        ? text.substring(0, maxTextLength) + '...'
        : text;

    // Process the text to create linkified content
    const processText = (inputText: string): React.ReactNode[] => {
        // Build regex based on whether we should detect <br/> tags
        const urlPattern = `(https?:\\/\\/[^\\s]+)|(www\\.[^\\s]+)`;
        const brPattern = `(<br\\s*\\/?>)`;
        const urlRegex = detectBrTags
            ? new RegExp(`${urlPattern}|${brPattern}`, 'gi')
            : new RegExp(urlPattern, 'g');

        const result: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;
        let index = 0;

        while ((match = urlRegex.exec(inputText)) !== null) {
            // Add the text segment before the match
            if (match.index > lastIndex) {
                result.push(
                    <span key={`text-${index}`}>
                        {inputText.substring(lastIndex, match.index)}
                    </span>
                );
                index++;
            }

            const matchedText = match[0];

            // Check if it's a <br/> tag
            if (detectBrTags && matchedText.toLowerCase().match(/<br\s*\/?>/)) {
                result.push(<br key={`br-${index}`} />);
            } else {
                // It's a URL
                const url = matchedText.startsWith('www.')
                    ? `https://${matchedText}`
                    : matchedText;

                // Determine display text based on maxLinkTextLength
                let displayLinkText = matchedText;
                if (maxLinkTextLength && matchedText.length > maxLinkTextLength) {
                    displayLinkText = matchedText.substring(0, maxLinkTextLength) + '...';
                }

                result.push(
                    <a
                        key={`link-${index}`}
                        href={url}
                        target={target}
                        rel={rel}
                        className={className}
                        onClick={onClick}
                        title={matchedText}
                    >
                        {displayLinkText}
                    </a>
                );
            }

            index++;
            lastIndex = match.index + matchedText.length;
        }

        // Add any remaining text after the last match
        if (lastIndex < inputText.length) {
            result.push(
                <span key={`text-${index}`}>
                    {inputText.substring(lastIndex)}
                </span>
            );
        }

        return result;
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <span>
            {processText(displayText)}
            {shouldTruncate && (
                <>
                    {' '}
                    <button
                        onClick={handleToggle}
                        className={readMoreClassName}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            cursor: 'pointer',
                            padding: 0,
                            textDecoration: 'underline',
                            font: 'inherit'
                        }}
                    >
                        {isExpanded ? readLessText : readMoreText}
                    </button>
                </>
            )}
        </span>
    );
};

// Legacy function export for backward compatibility
export const linkifyText = (
    text: string,
    options: LinkifyOptions = {}
): React.ReactNode => {
    return <LinkifyText text={text} options={options} />;
};

export default LinkifyText;