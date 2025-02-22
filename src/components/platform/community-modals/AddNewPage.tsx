import { useForm } from "react-hook-form";
import { TextControl } from "./modal/controls/TextControl";
import Modal from "./modal/Modal";
import { Divider, Error } from "./modal/Content";
import { yupResolver } from "@hookform/resolvers/yup";
import { addNewPageSchema, postPage } from "./add-new-page.schema";
import { SelectControl } from "./modal/controls/SelectControl";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { TextLabeledControl } from "./modal/controls/TextLabeledControl";
import { fetchTopics } from "./common.schema";
import { useTranslations } from "next-intl";

function AddNewPage({
    show,
    onClose
}: {
    show: boolean,
    onClose: () => void
}) {
    const t = useTranslations('community-models.add-new-page');
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(addNewPageSchema) });
    const [topics, setTopics] = useState<{ [key: number]: string }>({});
    useEffect(() => {
        fetchTopics(setTopics);
    }, [])

    function onConfirm(data: yup.InferType<typeof addNewPageSchema>) {
        postPage(data);
        reset();
        onClose();
    }

    function onCancel() {
        reset();
        onClose();
    }

    return (
        <Modal
            show={show}
            headerText={t('newPage')}
            headerSubText={t('createPage')}
            onClose={onClose}
            onConfirm={handleSubmit(onConfirm)}
            onCancel={onCancel}>
            <TextControl
                label={t('pageName')}
                {...register("name")}>
                {errors.name && <Error message={errors.name.message?.toString()} />}
            </TextControl>
            <TextControl
                label={t('pageDescription')}
                area={true}
                {...register("description")}>
                {errors.description && <Error message={errors.description.message?.toString()} />}
            </TextControl>
            <Divider />
            <TextLabeledControl
                label={t('pageSlug')}
                inputLabel="slug"
                {...register("slug")}>
                {errors.slug && <Error message={errors.slug.message?.toString()} />}
            </TextLabeledControl>
            <TextLabeledControl
                label={t('pageAvatar')}
                inputLabel="avatar"
                {...register("avatar")}>
                {errors.avatar && <Error message={errors.avatar.message?.toString()} />}
            </TextLabeledControl>
            <TextLabeledControl
                label={t('pageCover')}
                inputLabel="cover"
                {...register("cover")}>
                {errors.cover && <Error message={errors.cover.message?.toString()} />}
            </TextLabeledControl>
            <Divider />
            <SelectControl
                label={t('pageCategory')}
                options={{ Business: t('category.business'), Project: t('category.project') }}
                {...register("category")}>
                {errors.category && <Error message={errors.category.message?.toString()} />}
            </SelectControl>
            <SelectControl
                label={t('pageTopic')}
                options={topics}
                {...register("topic_id")}>
                {errors.topic_id && <Error message={errors.topic_id.message?.toString()} />}
            </SelectControl>
        </Modal>
    );
}

export default AddNewPage;