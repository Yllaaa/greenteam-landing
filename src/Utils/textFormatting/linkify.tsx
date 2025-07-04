import React from 'react';

interface LinkifyOptions {
    className?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    onClick?: (e: React.MouseEvent) => void;
}

/**
 * Converts URLs in text into clickable links
 * 
 * @param text - The text to process
 * @param options - Optional styling and behavior configuration
 * @returns JSX elements with clickable links
 */
export const linkifyText = (
    text: string,
    options: LinkifyOptions = {}
): React.ReactNode[] => {
    if (!text) return [''];

    const {
        className = 'content-link',
        target = '_blank',
        rel = 'noopener noreferrer',
        onClick = (e) => e.stopPropagation()
    } = options;

    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;

    // Create a result array to hold all elements
    const result: React.ReactNode[] = [];

    // Keep track of the last index
    let lastIndex = 0;
    let match;
    let index = 0;

    // Use exec to iterate through all matches
    while ((match = urlRegex.exec(text)) !== null) {
        // Add the text segment before the match
        if (match.index > lastIndex) {
            result.push(
                <span key={`text-${index}`}>
                    {text.substring(lastIndex, match.index)}
                </span>
            );
            index++;
        }

        // Add the URL
        const url = match[0].startsWith('www.')
            ? `https://${match[0]}`
            : match[0];

        result.push(
            <a
                key={`link-${index}`}
                href={url}
                target={target}
                rel={rel}
                className={className}
                onClick={onClick}
            >
                {match[0]}
            </a>
        );
        index++;

        // Update the last index
        lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last match
    if (lastIndex < text.length) {
        result.push(
            <span key={`text-${index}`}>
                {text.substring(lastIndex)}
            </span>
        );
    }

    return result;
};

export default linkifyText;