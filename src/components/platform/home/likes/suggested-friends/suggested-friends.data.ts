import { suggestions, users } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest, postRequest } from "@/Utils/backendEndpoints/backend-requests";

export type SuggestedFriendsItem = {
    id: string,
    fullName: string,
    avatar: string,
    work: string
}

export async function getSuggestedFriends(locale: string): Promise<SuggestedFriendsItem[]> {
    const { data } = await getRequest(suggestions.friends, locale);
    return data
}

export async function addFriend(id: string) {
    await postRequest(users.addFriend, { id })
}