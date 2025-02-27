import { suggestions, users } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest, postRequest } from "@/Utils/backendEndpoints/backend-requests";

export type WhoToFollowItem = {
    id: string,
    avatar: string,
    fullName: string,
    city: string
}

export async function getWhoToFollowItems(): Promise<WhoToFollowItem[]> {
    const { data } = await getRequest(suggestions.followees);
    return data
}

export async function followUser(id: string) {
    await postRequest(users.follow, { id })
}