export type PageItem = {
    likes: number,
    followers: number,
    title: string,
    description: string,
    image: string
}

export async function getPageItems(): Promise<PageItem[]> {
    return [
        {
            likes: 10,
            followers: 10,
            title: 'Page 1',
            description: 'Page Description',
            image: '/about/aoura.jpeg',
        },
        {
            likes: 10,
            followers: 10,
            title: 'Page 1',
            description: 'Page Description',
            image: '/about/aoura.jpeg',
        },
        {
            likes: 10,
            followers: 10,
            title: 'Page 1',
            description: 'Page Description',
            image: '/about/aoura.jpeg',
        }
    ]
}