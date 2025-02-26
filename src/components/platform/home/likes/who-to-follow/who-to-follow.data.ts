import { users } from "@/Utils/backendEndpoints/backend-endpoints";
import axios from "axios";

export type WhoToFollowItem = {
    id: string,
    avatar: string,
    name: string,
    city: string
}

export async function getWhoToFollowItems(): Promise<WhoToFollowItem[]> {
    return [
        {
            id: "1",
            avatar: "https://picsum.photos/200/301",
            name: "John Doe",
            city: "New York"
        },
        {
            id: "2",
            avatar: "https://picsum.photos/200/302",
            name: "Jane Doe",
            city: "London"
        },
        {
            id: "3",
            avatar: "https://picsum.photos/200/303",
            name: "Bob Smith",
            city: "Paris"
        }
    ];
}

export async function followUser(id: string) {
    await axios.post(users.follow, { id })
}