/** @format */

import {useState, useEffect} from 'react';
import {Topic, TopicSelection} from '@/types';
import {topicsService} from '@/services/topicsService';

export function useTopics() {
	const [topics, setTopics] = useState<Topic[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const initializeTopics = async () => {
			try {
				setLoading(true);
				const topicsData = await topicsService.initialize();
				setTopics(topicsData);
				setError(null);
			} catch (err) {
				setError('Failed to load topics');
				console.error('Error loading topics:', err);
			} finally {
				setLoading(false);
			}
		};

		initializeTopics();
	}, []);

	return {topics, loading, error};
}

export function useTopic(topicId: number | undefined) {
	const [topic, setTopic] = useState<Topic | undefined>();

	useEffect(() => {
		if (topicId) {
			const foundTopic = topicsService.getTopicById(topicId);
			setTopic(foundTopic);
		}
	}, [topicId]);

	return topic;
}

export function useTopicSelection(
	initialTopicId?: number,
	initialSubtopicId?: number
) {
	const [selection, setSelection] = useState<TopicSelection>({
		topicId: initialTopicId || 0,
		subtopicId: initialSubtopicId,
	});

	const topic = useTopic(selection.topicId);
	const subtopic = topic?.subtopics.find((s) => s.id === selection.subtopicId);

	const selectTopic = (topicId: number) => {
		setSelection({topicId, subtopicId: undefined});
	};

	const selectSubtopic = (subtopicId: number) => {
		setSelection((prev) => ({...prev, subtopicId}));
	};

	const clearSelection = () => {
		setSelection({topicId: 0, subtopicId: undefined});
	};

	return {
		selection,
		topic,
		subtopic,
		selectTopic,
		selectSubtopic,
		clearSelection,
	};
}
