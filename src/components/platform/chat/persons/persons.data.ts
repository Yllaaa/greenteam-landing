export type PersonItem = {
    id: string,
    name: string,
    avatar: string,
    work: string,
    active: boolean
}

export async function getPersons(): Promise<PersonItem[]> {
    return [
        {
            id: '2',
            name: 'Egor Letov',
            avatar: 'https://picsum.photos/200/300',
            work: 'Musician',
            active: false
        },
        {
            id: '3',
            name: 'Vladimir Mayakovsky',
            avatar: 'https://picsum.photos/201/301',
            work: 'Poet',
            active: false
        },
        {
            id: '4',
            name: 'Elon Musk',
            avatar: 'https://picsum.photos/202/302',
            work: 'Businessman',
            active: true
        }
    ]
}