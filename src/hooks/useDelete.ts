/* eslint-disable @typescript-eslint/no-explicit-any */

// hooks/useDelete.ts
import {useState} from 'react';
import {useDeleteContentMutation} from '@/services/api';
import {useTranslations} from 'next-intl';
import ToastNot from '@/Utils/ToastNotification/ToastNot';

interface UseDeleteOptions {
	contentType: 'posts' | 'forum' | 'product' | 'page' | 'group';
	onSuccess?: () => void;
	onError?: (error: any) => void;
}

export const useDelete = ({
	contentType,
	onSuccess,
	onError,
}: UseDeleteOptions) => {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<{
		id: string;
		title?: string;
	} | null>(null);
	const [deleteContent] = useDeleteContentMutation();
	const t = useTranslations('common.deleteModal');

	const openDeleteModal = (id: string, title?: string) => {
		setItemToDelete({id, title});
		setShowDeleteModal(true);
	};

	const closeDeleteModal = () => {
		setShowDeleteModal(false);
		setItemToDelete(null);
	};

	const handleDelete = async () => {
		if (!itemToDelete) return;

		try {
			await deleteContent({
				contentType,
				contentId: itemToDelete.id,
			}).unwrap();

			ToastNot(t('success'));
			onSuccess?.();
		} catch (error) {
			ToastNot(t('error'));
			onError?.(error);
			throw error;
		}
	};

	return {
		showDeleteModal,
		openDeleteModal,
		closeDeleteModal,
		handleDelete,
		itemToDelete,
	};
};
