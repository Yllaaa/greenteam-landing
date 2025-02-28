import { events } from "@/Utils/backendEndpoints/backend-endpoints";
import { postRequest } from "@/Utils/backendEndpoints/backend-requests";
import * as yup from "yup";

export const eventCategories = ['social' , 'volunteering&work' , 'talks&workshops']

export const addNewEventSchema = yup.object().shape({
    title: yup.string().required("Event title is required").min(3).max(20),
    description: yup.string().required("Event description is required").min(3).max(200),
    location: yup.string().required("Event location is required").min(3).max(200),
    startDate: yup.date().required("Event start date is required").typeError("Event start date is required").min(new Date()).max(yup.ref('endDate'), "Start date must be before end date"),
    endDate: yup.date().required("Event end date is required").typeError("Event end date is required").min(yup.ref('startDate'), "End date must be after start date"),
    category: yup.string().oneOf(eventCategories).required("Event category is required"),
    topicId: yup.number().typeError("Please select a topic").integer("Please select a topic").positive("Please select a topic").required("Please select a topic"),
});

export const postEvent = async (eventData: yup.InferType<typeof addNewEventSchema>) => {
    return await postRequest(events.create, eventData)
}