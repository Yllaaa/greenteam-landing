import { posts } from '@/Utils/backendEndpoints/backend-endpoints'
import { getRequest } from '@/Utils/backendEndpoints/backend-requests'

export type PostItem = {
    user: {
        avatar: string,
        name: string,
        city: string
    },
    title: string,
    photo: string,
    createdAt: Date,
    do: boolean,
    likes: number,
    dislikes: number,
    comments: number,
    category: string
}

export async function getPosts(locale: string): Promise<PostItem[]> {
    const { data } = await getRequest(posts.likedPosts, locale);
    return data
}

export { getPassedTime } from '../news/new.data'

export { formatNumber } from '../../../personal/menu/groups/groups.data'