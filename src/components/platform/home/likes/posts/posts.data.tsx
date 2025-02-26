export type PostItem = {
    user: {
        avatar: string,
        name: string,
        city: string
    },
    title: string,
    photo: string,
    published: Date,
    do: boolean,
    likes: number,
    dislikes: number,
    comments: number,
    category: string
}

export async function getPosts(): Promise<PostItem[]> {
    return [
        {
            user: {
                avatar: "https://picsum.photos/200/301",
                name: "Olivia Wild",
                city: "New York"
            },
            title: "Health Benefits of Meditation",
            photo: "https://picsum.photos/200/301",
            published: new Date('2022-05-01'),
            do: true,
            likes: 10,
            dislikes: 2,
            comments: 3,
            category: "Health"
        },
        {
            user: {
                avatar: "https://picsum.photos/200/301",
                name: "John Doe",
                city: "San Francisco"
            },
            title: "The latest research on AI",
            photo: "https://picsum.photos/200/301",
            published: new Date('2022-05-15'),
            do: false,
            likes: 5,
            dislikes: 1,
            comments: 2,
            category: "Knowledge"
        },
        {
            user: {
                avatar: "https://picsum.photos/200/301",
                name: "Jane Doe",
                city: "Tokyo"
            },
            title: "The best laptop for developers",
            photo: "https://picsum.photos/200/301",
            published: new Date('2022-05-20'),
            do: true,
            likes: 20,
            dislikes: 0,
            comments: 15,
            category: "Electronics"
        }
    ]
}

export { getPassedTime } from '../news/new.data'

export { formatNumber } from '../../../personal/menu/groups/groups.data'