import { useForm } from "react-hook-form";
import { TextControl } from "./modal/controls/TextControl";
import Modal from "./modal/Modal";
import { Divider, Error } from "./modal/Content";
import { yupResolver } from "@hookform/resolvers/yup";
import { SelectControl } from "./modal/controls/SelectControl";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { fetchTopics } from "./common.schema";
import { addNewGroupSchema } from "./add-new-group.schema";
import { useTranslations } from "next-intl";
import { log } from "node:console";

function AddNewGroup({
    show,
    onClose
}: {
    show: boolean,
    onClose: () => void
}) {
    const t = useTranslations('community-models.add-new-group');
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(addNewGroupSchema) });
    const [topics, setTopics] = useState<{ [key: number]: string }>({});
    useEffect(() => {
        fetchTopics(setTopics);
    }, [])

    function onConfirm(data: yup.InferType<typeof addNewGroupSchema>) {
        log(data);
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
            headerText={t('startGroup')}
            headerSubText={t('bringPeople')}
            onClose={onClose}
            onConfirm={handleSubmit(onConfirm)}
            onCancel={onCancel}>
            <TextControl
                label={t('groupName')}
                {...register("name")}
            >
                {errors.name && <Error message={errors.name?.message} />}
            </TextControl>
            <TextControl
                label={t('groupDescription')}
                area
                {...register("description")}
            >
                {errors.description && <Error message={errors.description?.message} />}
            </TextControl>
            <Divider />
            <SelectControl
                label={t('groupPrivacy')}
                options={{ PUBLIC: t('public'), PRIVATE: t('private') }}
                {...register("privacy")}
            >
                {errors.privacy && <Error message={errors.privacy?.message} />}
            </SelectControl>
            <SelectControl
                label={t('groupTopic')}
                options={topics}
                {...register("topicId")}
            >
                {errors.topicId && <Error message={errors.topicId?.message} />}
            </SelectControl>
        </Modal>
    );
}

export default AddNewGroup;