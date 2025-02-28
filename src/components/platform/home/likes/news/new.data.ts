
export type NewsItem = {
    source: string,
    published: Date,
    title: string,
    hashtag: string,
    photo: string,
}

export default async function getNews(): Promise<NewsItem[]> {
    return [
        {
            source: 'The Verge',
            published: new Date('2022-05-01T12:00:00.000Z'),
            title: 'Elon Musk says Twitter deal is on hold pending spam bot details',
            hashtag: '#elonmusk',
            photo: 'https://picsum.photos/200/301'
        },
        {
            source: 'Ars Technica',
            published: new Date('2022-05-01T13:00:00.000Z'),
            title: 'The latest Twitter drama is a reminder that the service is broken',
            hashtag: '#twitter',
            photo: 'https://picsum.photos/200/301'
        },
        {
            source: 'The New York Times',
            published: new Date('2022-05-01T14:00:00.000Z'),
            title: 'Twitter\'s Jack Dorsey is out as C.E.O. Again.',
            hashtag: '#jackdorsey',
            photo: 'https://picsum.photos/200/301'
        },
    ]
}

export function getPassedTime(published: Date): string {
    const diff = Math.abs(Date.now() - published.getTime()) / 1000;
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;

    if (diff < 10) {
        return 'just now';
    }
    if (diff < minute) {
        return `${Math.floor(diff)}s`;
    }
    if (diff < hour) {
        return `${Math.floor(diff / minute)}m`;
    }
    if (diff < day) {
        return `${Math.floor(diff / hour)}h`;
    }
    return `${Math.floor(diff / day)}d`;
}
