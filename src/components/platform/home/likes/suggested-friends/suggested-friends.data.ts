import { suggestions, users } from "@/Utils/backendEndpoints/backend-endpoints";
import { getRequest, postRequest } from "@/Utils/backendEndpoints/backend-requests";

export type SuggestedFriendsItem = {
    id: string,
    fullName: string,
    avatar: string,
    work: string
}

export async function getSuggestedFriends(): Promise<SuggestedFriendsItem[]> {
    const { data } = await getRequest(suggestions.friends);
    return data
}

export async function addFriend(id: string) {
    await postRequest(users.addFriend, { id })
}