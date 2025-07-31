/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AddPostModal/AddPostModal.tsx
import React, { useState, useEffect, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import styles from "./AddPostModal.module.scss"
import { TOPICS_DATA } from "@/data/topics"
import { usePublishPostMutation } from "@/services/api"
import { useTranslations } from "next-intl"
import { AttachmentButton } from "../../../AttachmentButton/AttachmentButton"
import { useClickOutside } from "@/hooks/useClickOutside"
import Image from "next/image"

interface FormData {
  content: string
  topicId: number
  subtopicIds: string[]
}

interface AddPostModalProps {
  open: boolean
  defaultTopicId?: number
  onClose: () => void
  onSuccess?: () => void
}

export const AddPostModal: React.FC<AddPostModalProps> = ({
  open,
  defaultTopicId,
  onClose,
  onSuccess,
}) => {
  const t = useTranslations("web.post.addPost")
  const [publishPost, { isLoading }] = usePublishPostMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      content: "",
      topicId: defaultTopicId || 0,
      subtopicIds: [],
    },
  })

  const [images, setImages] = useState<File[]>([])
  const [document, setDocument] = useState<File | null>(null)
  const [apiError, setApiError] = useState<string>("")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showTopicDropdown, setShowTopicDropdown] = useState(false)

  const watchedTopicId = watch("topicId")
  const selectedTopic = TOPICS_DATA.find(topic => topic.id === watchedTopicId)

  // Click outside ref for category dropdown
  const categoryDropdownRef = useClickOutside<HTMLDivElement>(() => {
    setShowCategoryDropdown(false)
  }, showCategoryDropdown)

  // Click outside ref for topic dropdown
  const topicDropdownRef = useClickOutside<HTMLDivElement>(() => {
    setShowTopicDropdown(false)
  }, showTopicDropdown)

  useEffect(() => {
    if (defaultTopicId && open) {
      setValue("topicId", defaultTopicId)
    }
  }, [defaultTopicId, open, setValue])

  useEffect(() => {
    if (!open) {
      reset({
        content: "",
        topicId: defaultTopicId || 0,
        subtopicIds: [],
      })
      setImages([])
      setDocument(null)
      setApiError("")
      setShowCategoryDropdown(false)
      setShowTopicDropdown(false)
    }
  }, [open, defaultTopicId, reset])

  // Reset subtopics when topic changes
  useEffect(() => {
    setValue("subtopicIds", [])
  }, [watchedTopicId, setValue])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (images.length + files.length > 4) {
      setApiError(t("maxImagesError", { max: 4 }))
      return
    }

    const validFiles: File[] = []
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setApiError(t("imageSizeError", { size: "10MB" }))
        return
      }
      if (!file.type.startsWith("image/")) {
        setApiError(t("invalidImageType"))
        return
      }
      validFiles.push(file)
    }

    setImages(prev => [...prev, ...validFiles])
    setDocument(null)
    setApiError("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      if (file.type !== "application/pdf") {
        setApiError(t("pdfOnly"))
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setApiError(t("documentSizeError", { size: "10MB" }))
        return
      }

      setDocument(file)
      setImages([])
      setApiError("")
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeDocument = () => {
    setDocument(null)
  }

  const onSubmit = async (data: FormData) => {
    try {
      const payload: any = {
        content: data.content.trim(),
        mainTopicId: data.topicId,
        creatorType: "user",
        subtopicIds: data.subtopicIds,
      }

      if (images.length > 0) {
        payload.images = images
      } else if (document) {
        payload.document = document
      }

      await publishPost(payload).unwrap()

      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error("Publish error:", error)
      setApiError(error.data?.message || t("publishError"))
    }
  }

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t("title")}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.content}>
          {apiError && (
            <div className={styles.error}>
              {apiError}
              <button type="button" onClick={() => setApiError("")}>
                ×
              </button>
            </div>
          )}

          {/* Topic Selector */}
          <Controller
            name="topicId"
            control={control}
            rules={{ required: t("selectTopic") }}
            render={({ field }) => (
              <div className={styles.topicSelector} ref={topicDropdownRef}>
                <button
                  type="button"
                  className={`${styles.topicButton} ${errors.topicId ? styles.errorButton : ""}`}
                  onClick={() => setShowTopicDropdown(!showTopicDropdown)}>
                  <span className={styles.label}>{t("topic")}:</span>
                  <span className={styles.value}>
                    {selectedTopic ? selectedTopic.name : t("selectTopic")}
                  </span>
                  <span className={styles.arrow}>▼</span>
                </button>

                {showTopicDropdown && (
                  <div className={styles.topicDropdown}>
                    {TOPICS_DATA.map(topic => (
                      <button
                        key={topic.id}
                        type="button"
                        className={`${styles.topicItem} ${field.value === topic.id ? styles.selected : ""}`}
                        onClick={() => {
                          field.onChange(topic.id)
                          setShowTopicDropdown(false)
                        }}>
                        {topic.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          />

          <Controller
            name="content"
            control={control}
            rules={{ required: t("required") }}
            render={({ field }) => (
              <textarea
                {...field}
                className={`${styles.textarea} ${errors.content ? styles.errorField : ""}`}
                placeholder={t("placeholder")}
                rows={6}
              />
            )}
          />

          <div className={styles.attachments}>
            {images.length > 0 && (
              <div className={styles.imageGrid}>
                {images.map((image, index) => (
                  <div key={index} className={styles.imagePreview}>
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      width={100}
                      height={100}
                    />
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeImage(index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {document && (
              <div className={styles.documentPreview}>
                <span>📄 {document.name}</span>
                <button type="button" onClick={removeDocument}>
                  ×
                </button>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.leftActions}>
              <AttachmentButton
                onImageSelect={() => fileInputRef.current?.click()}
                onDocumentSelect={() => documentInputRef.current?.click()}
                hasImages={images.length > 0}
                hasDocument={!!document}
                imageCount={images.length}
              />

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />

              <input
                ref={documentInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleDocumentSelect}
                style={{ display: "none" }}
              />

              <Controller
                name="subtopicIds"
                control={control}
                rules={{
                  validate: value => value.length > 0 || t("selectAtLeastOne"),
                }}
                render={({ field }) => (
                  <div
                    className={styles.categorySelector}
                    ref={categoryDropdownRef}>
                    <button
                      type="button"
                      className={`${styles.categoryButton} ${errors.subtopicIds ? styles.errorButton : ""}`}
                      onClick={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                      disabled={!selectedTopic}>
                      {t("addCategory")}
                      {field.value.length > 0 && (
                        <span className={styles.badge}>
                          {field.value.length}
                        </span>
                      )}
                    </button>

                    {showCategoryDropdown && selectedTopic && (
                      <div className={styles.dropdown}>
                        {selectedTopic.subtopics.map(subtopic => (
                          <label
                            key={subtopic.id}
                            className={styles.checkboxItem}>
                            <input
                              type="checkbox"
                              checked={field.value.includes(
                                subtopic.id.toString()
                              )}
                              onChange={e => {
                                const id = subtopic.id.toString()
                                if (e.target.checked) {
                                  field.onChange([...field.value, id])
                                } else {
                                  field.onChange(
                                    field.value.filter((v: string) => v !== id)
                                  )
                                }
                              }}
                            />
                            <span>{subtopic.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            <button
              type="submit"
              className={styles.postButton}
              disabled={isLoading}>
              {isLoading ? t("publishing") : t("post")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}