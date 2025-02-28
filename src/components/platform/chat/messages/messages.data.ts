export type MessageItem = {
    user: {
        id: string,
        name: string,
        avatar: string,
        work: string
    },
    message: string,
    createdAt: Date
}

export function getUserId() : string {
    return '1'
}

export async function getMessageItems(personId: string): Promise<MessageItem[]> {
    if(personId === '') return [];
    return [
        {
            user: {
                id: '1',
                name: 'Egor Letov',
                avatar: 'https://picsum.photos/200/300',
                work: 'Musician'
            },
            message: 'Hello, how are you?',
            createdAt: new Date('2022-05-01T12:00:00.000Z')
        },
        {
            user: {
                id: '2',
                name: 'Vladimir Mayakovsky',
                avatar: 'https://picsum.photos/201/301',
                work: 'Poet'
            },
            message: 'I am fine, what about you?',
            createdAt: new Date('2022-05-01T13:00:00.000Z')
        },
        {
            user: {
                id: '1',
                name: 'Egor Letov',
                avatar: 'https://picsum.photos/200/300',
                work: 'Musician'
            },
            message: 'I am fine too, thanks',
            createdAt: new Date('2022-05-01T14:00:00.000Z')
        },
        {
            user: {
                id: '1',
                name: 'Egor Letov',
                avatar: 'https://picsum.photos/200/300',
                work: 'Musician'
            },
            message: 'Hello, how are you?',
            createdAt: new Date('2022-05-01T12:00:00.000Z')
        },
        {
            user: {
                id: '2',
                name: 'Vladimir Mayakovsky',
                avatar: 'https://picsum.photos/201/301',
                work: 'Poet'
            },
            message: 'I am fine, what about you?',
            createdAt: new Date('2022-05-01T13:00:00.000Z')
        },
        {
            user: {
                id: '1',
                name: 'Egor Letov',
                avatar: 'https://picsum.photos/200/300',
                work: 'Musician'
            },
            message: 'I am fine too, thanks',
            createdAt: new Date('2022-05-01T14:00:00.000Z')
        }
    ]
}

export function formatChatDate(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Today
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'long' }); // Day of the week (e.g., Monday)
    } else {
        return date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
    }
}