import { pages } from '@/Utils/backendEndpoints/backend-endpoints';
import { postRequest } from '@/Utils/backendEndpoints/backend-requests';
import * as yup from 'yup'

export const pageCategories = ['Business','Project']

export const addNewPageSchema = yup.object().shape({
    name: yup.string().required("Page Name is required").min(3).max(20),
    description: yup.string().required("Page description is required").min(3).max(200),
    slug: yup.string().required("Page slug is required"),
    avatar: yup.string().required("Page avatar is required"),
    cover: yup.string().required("Page cover is required"),
    category: yup.string().oneOf(pageCategories).required("Please select a category"),
    topic_id: yup.number().typeError("Please select a topic").integer("Please select a topic").positive("Please select a topic").required("Please select a topic"),
})



export const postPage = async (pageData: yup.InferType<typeof addNewPageSchema>) => {
    return await postRequest(pages.allPages, pageData)
}