import { suggestions, users } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest, postRequest } from "@/Utils/backendEndpoints/backend-requests";

export type WhoToFollowItem = {
    id: string,
    avatar: string,
    fullName: string,
    city: string
}

export async function getWhoToFollowItems(locale:string): Promise<WhoToFollowItem[]> {
    const { data } = await getRequest(suggestions.followees, locale);
    return data
}

export async function followUser(id: string) {
    await postRequest(users.follow, { id })
}