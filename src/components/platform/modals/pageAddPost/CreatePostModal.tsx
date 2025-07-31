"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import styles from "./CreatePostModal.module.scss";
import { useForm } from "react-hook-form";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import preventBackgroundScroll from "@/hooks/preventScroll/preventBackroundScroll";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import plusIcon from "@/../public/ZPLATFORM/madal/plusIcon.svg";
import Image from "next/image";
import FileUpload from "@/Utils/imageUploadComponent/clickToUpload/ImageUpload";
import { Topics } from "@/components/Assets/topics/Topics.data";

// interface Subtopic {
//     id: number;
//     name: string;
// }

// interface Topic {
//     id: number;
//     name?: string;
//     subtopics?: Subtopic[];
// }

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    pageSlug: string;
    title?: string;
    placeholder?: string;
    buttonText?: string;
    maxImages?: number;
    onSuccess?: () => void;
    customEndpoint?: string;
    additionalFormData?: Record<string, any>;
    showSubtopics?: boolean;
    topicId?: number;
}

function CreatePostModal({
    isOpen,
    onClose,
    pageSlug,
    title = "Talk about this challenge",
    placeholder = "Add your experiences and tips to make a better future.",
    buttonText = "Post",
    maxImages = 4,
    onSuccess,
    customEndpoint,
    additionalFormData = {},
    showSubtopics = true,
    topicId,
}: CreatePostModalProps) {
    // Get access token and topic from redux store
    const accessToken = useAppSelector((state) => state.login.accessToken);
    // const topic = useAppSelector((state) => state.pageState.topic);

    // State for file uploads and subtopics - MUST define useState hooks before any conditionals
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Find topic details
    const allMainTopics = Topics;
    const topicDetails = topicId !== 0 && allMainTopics.find((item) => item.id === topicId);

    // Close modal function
    const closeModal = useCallback(() => {
        onClose();
    }, [onClose]);

    // Handle outside clicks
    const modalRef = useOutsideClick(closeModal);

    // Form handling
    const { register, reset, handleSubmit, setValue } = useForm<any>({
        defaultValues: {
            content: "",
            images: [],
            creatorType: "page",
            ...additionalFormData
        },
    });

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            preventBackgroundScroll(true);

            return () => {
                preventBackgroundScroll(false);
            };
        }
    }, [isOpen]);

    // Handle file selection
    const handleFilesSelected = useCallback((files: File[], type: "image" | "pdf") => {
        setSelectedFiles((prev) => [...prev, ...files]);
        setValue("fileType", type);
    }, [setValue]);

    // Handle subtopic selection
    const handleSubtopicChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setSelectedSubtopics(prev => {
            let updatedSubtopics = [...prev];
            if (checked) {
                updatedSubtopics.push(value);
            } else {
                updatedSubtopics = updatedSubtopics.filter((id) => id !== value);
            }
            setValue("subtopicIds", updatedSubtopics);
            return updatedSubtopics;
        });
    }, [setValue]);



    // Handle form submission
    const onSubmit = useCallback(async (formData: any) => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        // Create FormData object
        const formDataToSend = new FormData();

        // Append text fields
        formDataToSend.append("content", formData.content);

        // Convert subtopic IDs to integers and append
        const intSubtopics = selectedSubtopics.map((id: string) => parseInt(id));
        intSubtopics.forEach((id: number) => {
            formDataToSend.append("subtopicIds[]", id.toString());
        });

        // Add creator type
        formDataToSend.append("creatorType", "page");

        // Add any additional form data
        Object.entries(additionalFormData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formDataToSend.append(key, value.toString());
            }
        });

        // Append files
        selectedFiles.forEach((file) => {
            formDataToSend.append(`images`, file);
        });

        try {
            // Use custom endpoint if provided, otherwise use default
            const endpoint = customEndpoint ||
                `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/pages/${pageSlug}/posts/publish-post`;

            const response = await axios.post(
                endpoint,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response) {
                ToastNot(`Post added successfully`);
                reset();
                setSelectedFiles([]);
                setSelectedSubtopics([]);
                onSuccess?.();
                onClose();
            }
        } catch (err: any) {
            console.error("Error creating post:", err);
            ToastNot(err.response?.data?.message || "Error occurred while adding post");
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, selectedSubtopics, selectedFiles, additionalFormData, customEndpoint, pageSlug, accessToken, reset, onSuccess, onClose]);

    // If modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div ref={modalRef} className={styles.modalContent}>
                <button className={styles.closeButton} onClick={closeModal}>
                    &times;
                </button>

                <form className={styles.postForm} onSubmit={handleSubmit(onSubmit)}>
                    <h2 className={styles.title}>
                        <Image src={plusIcon} alt="logo" width={30} height={30} />
                        {title}
                    </h2>

                    {/* Text Area */}
                    <textarea
                        placeholder={placeholder}
                        className={styles.textArea}
                        {...register("content", { required: true })}
                    />




                    <div className={styles.buttons}>
                        {/* File Upload */}
                        <div className={styles.fileUpload}>
                            <FileUpload
                                onFilesSelected={handleFilesSelected}
                                maxImages={maxImages}
                                maxSizeInMB={10}
                                selectAll={false}
                            />
                        </div>

                        {/* Subtopics Selection */}
                        {showSubtopics && topicDetails && (
                            <div className={styles.selectSubCategory}>
                                {topicDetails &&
                                    topicDetails.subtopics &&
                                    topicDetails?.subtopics?.length > 0 ? (
                                    topicDetails?.subtopics?.map((subtopic) => (
                                        <label
                                            style={
                                                selectedSubtopics.includes(`${subtopic.id}`)
                                                    ? { backgroundColor: "#74b243" }
                                                    : {}
                                            }
                                            key={subtopic.id}
                                            className={styles.checkboxLabel}
                                        >
                                            <input
                                                type="checkbox"
                                                value={`${subtopic.id}`}
                                                checked={selectedSubtopics.includes(`${subtopic.id}`)}
                                                onChange={handleSubtopicChange}
                                            />
                                            {subtopic.name}
                                        </label>
                                    ))
                                ) : (
                                    <p className={styles.noSubtopics}>
                                        No subtopics available for this topic.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={styles.submit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Posting..." : buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePostModal;