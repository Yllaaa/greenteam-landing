import { groups } from "@/Utils/backendEndpoints/backend-endpoints";
import { postRequest } from "@/Utils/backendEndpoints/backend-requests";
import * as yup from "yup";

export const addNewGroupSchema = yup.object().shape({
    name: yup.string().required("Group Name is required").min(3).max(20),
    description: yup.string().required("Group description is required").min(3).max(200),
    privacy: yup.string().oneOf(["PUBLIC", "PRIVATE"]).required("Group privacy is required"),
    topicId: yup.number().typeError("Please select a topic").integer("Please select a topic").positive("Please select a topic").required("Please select a topic"),
});

export const postGroup = async (groupData: yup.InferType<typeof addNewGroupSchema>) => {
    return await postRequest(groups.create, groupData)
}