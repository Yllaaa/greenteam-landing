"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/react-quill';
import styles from './RichTextEditor.module.css';

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <div className={styles.editorLoading}>Loading editor...</div>
});

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = "Start typing..."
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'link'
    ];

    // Don't render anything until mounted on client
    if (!isMounted) {
        return (
            <div className={styles.editorPlaceholder}>
                <div className={styles.toolbar}></div>
                <div className={styles.content}>
                    <p>{placeholder}</p>
                </div>
            </div>
        );
    }

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className={styles.richTextEditor}
        />
    );
};

export default RichTextEditor;