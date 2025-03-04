"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Radix from "@radix-ui/react-select";
import styles from "./AddNew.module.css"; // Import CSS module

const topics = [
  {
    id: 1,
    name: "Food and health",
    subtopics: [
      { id: 7, name: "Cultivate" },
      { id: 8, name: "Cook" },
      { id: 9, name: "Keep" },
      { id: 10, name: "Natural Medicine" },
      { id: 11, name: "Nutrition" },
      { id: 12, name: "Hygiene" },
    ],
  },
  {
    id: 2,
    name: "Knowledge and values",
    subtopics: [
      { id: 13, name: "Philosophy" },
      { id: 14, name: "Astronomy" },
      { id: 15, name: "Biology" },
      { id: 16, name: "Geology" },
      { id: 17, name: "History" },
      { id: 18, name: "Psychology" },
      { id: 19, name: "Culture" },
      { id: 20, name: "Others" },
    ],
  },
];

export default function TopicSelector() {
  const { control, setValue, watch, handleSubmit, register } = useForm();
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedSubtopics = watch("subtopics", []);
  const userInput = watch("description", "");

  const handleTopicChange = (topicId: string) => {
    const id = parseInt(topicId, 10);
    setSelectedTopic(id);
    setValue("subtopics", []); // Reset subtopics when changing topic
  };

  const handleSubtopicToggle = (subtopicId: number) => {
    setValue(
      "subtopics",
      selectedSubtopics.includes(subtopicId)
        ? selectedSubtopics.filter((id: number) => id !== subtopicId)
        : [...selectedSubtopics, subtopicId]
    );
  };

  const availableSubtopics =
    topics.find((t) => t.id === selectedTopic)?.subtopics || [];

  const onSubmit = async (data: any) => {
    if (!selectedTopic) {
      setMessage("❌ Please select a topic first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const payload = {
      topic: selectedTopic,
      subtopics: selectedSubtopics,
      description: userInput,
    };

    try {
      const response = await fetch("/api/submit-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("✅ Selection submitted successfully!");
      } else {
        setMessage("❌ Failed to submit selection. Please try again.");
      }
    } catch (error) {
      setMessage("❌ Error connecting to the server.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {/* Topic Selector */}
      <Controller
        name="topic"
        control={control}
        
        render={({ field }) => (
          <Radix.Select onValueChange={handleTopicChange}>
            <Radix.SelectTrigger className={styles.addAndCategory}>
              <Radix.SelectValue placeholder="Select a topic" />
            </Radix.SelectTrigger>
            <Radix.SelectContent>
              {topics.map((topic) => (
                <Radix.SelectItem key={topic.id} value={String(topic.id)}>
                  {topic.name}
                </Radix.SelectItem>
              ))}
            </Radix.SelectContent>
          </Radix.Select>
        )}
      />

      {/* Subtopic Multi-Select (Appears Only If Topic is Selected) */}
      {selectedTopic && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Select subtopics:</p>
          {availableSubtopics.map((subtopic) => (
            <div key={subtopic.id} className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={selectedSubtopics.includes(subtopic.id)}
                onChange={() => handleSubtopicToggle(subtopic.id)}
                className={styles.checkbox}
              />
              <span>{subtopic.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Textarea */}
      <textarea
        {...register("description")}
        placeholder="Write a description..."
        className={styles.textArea}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit(onSubmit)}
        className={styles.submit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {/* Status Message */}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
