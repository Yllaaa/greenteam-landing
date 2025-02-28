import { useForm } from "react-hook-form";
import { TextControl } from "./modal/controls/TextControl";
import Modal from "./modal/Modal";
import { Divider, Error } from "./modal/Content";
import { yupResolver } from "@hookform/resolvers/yup";
import { SelectControl } from "./modal/controls/SelectControl";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { fetchTopics } from "./common.schema";
import { addNewEventSchema, postEvent } from "./add-new-event.schema";
import { DateControl } from "./modal/controls/DateControl";
import { useTranslations } from "next-intl";

function AddNewEvent({
    show,
    onClose
}: {
    show: boolean,
    onClose: () => void
}) {
    const t = useTranslations('community-models.add-new-event');
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(addNewEventSchema) });
    const [topics, setTopics] = useState<{ [key: number]: string }>({});
    useEffect(() => {
        fetchTopics(setTopics);
    }, [])

    function onConfirm(data: yup.InferType<typeof addNewEventSchema>) {
        postEvent(data);
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
            headerText={t('hostYourEvent')}
            headerSubText={t('planAndPromote')}
            onClose={onClose}
            onConfirm={handleSubmit(onConfirm)}
            onCancel={onCancel}>
            <TextControl
                label={t('eventName')}
                {...register("title")}
            >
                {errors.title && <Error message={errors.title?.message} />}
            </TextControl>
            <TextControl
                label={t('eventDescription')}
                area
                {...register("description")}
            >
                {errors.description && <Error message={errors.description?.message} />}
            </TextControl>
            <TextControl
                label={t('eventLocation')}
                {...register("location")}
            >
                {errors.location && <Error message={errors.location?.message} />}
            </TextControl>
            <Divider />
            <DateControl
                label={t('eventStartDate')}
                {...register("startDate")}
            >
                {errors.startDate && <Error message={errors.startDate?.message} />}
            </DateControl>
            <DateControl
                label={t('eventEndDate')}
                {...register("endDate")}
            >
                {errors.endDate && <Error message={errors.endDate?.message} />}
            </DateControl>
            <Divider />
            <SelectControl
                label={t('eventCategory')}
                options={{ 'social': t('category.social'), 'volunteering&work': t('category.volunteering&work'), 'talks&workshops': t('category.talks&workshops') }}
                {...register("category")}
            >
                {errors.category && <Error message={errors.category?.message} />}
            </SelectControl>
            <SelectControl
                label={t('eventTopic')}
                options={topics}
                {...register("topicId")}
            >
                {errors.topicId && <Error message={errors.topicId?.message} />}
            </SelectControl>
        </Modal>
    );
}

export default AddNewEvent;