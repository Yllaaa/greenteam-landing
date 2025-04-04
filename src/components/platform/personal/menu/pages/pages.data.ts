import { suggestions } from "@/Utils/backendEndpoints/backend-endpoints"
import { getRequest } from "@/Utils/backendEndpoints/backend-requests"

export type PageItem = {
    likes: number,
    followers: number,
    name: string,
    description: string,
    cover?: string
}

export async function getPageItems(): Promise<PageItem[]> {
    const { data } = await getRequest(suggestions.pages);
    return data
}