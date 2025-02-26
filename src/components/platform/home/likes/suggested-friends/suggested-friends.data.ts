import { users } from "@/Utils/backendEndpoints/backend-endpoints";
import axios from "axios";

export type SuggestedFriendsItem = {
    id: string,
    name: string,
    avatar: string,
    work: string
}

export async function getSuggestedFriends(): Promise<SuggestedFriendsItem[]> {
    return [
        {
            id: "1",
            name: "John Doe",
            avatar: "https://picsum.photos/200/300",
            work: "Software Engineer"
        },
        {
            id: "2",
            name: "Jane Doe",
            avatar: "https://picsum.photos/200/301",
            work: "Marketing Manager"
        },
        {
            id: "3",
            name: "Bob Smith",
            avatar: "https://picsum.photos/200/302",
            work: "Graphic Designer"
        }
    ];
}

export async function addFriend(id: string) {
    await axios.post(users.addFriend, { id })
}