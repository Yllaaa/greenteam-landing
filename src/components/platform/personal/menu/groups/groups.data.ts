export type GroupItem = {
    logo: string;
    title: string;
    description: string;
    members: number;
}

export function formatNumber(num: number): string {
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
}

export async function getGroupItems(): Promise<GroupItem[]> {
    return [
        {
            logo: '/about/aoura.jpeg',
            title: 'Group 1',
            description: 'Group Description',
            members: 10,
        }, {
            logo: '/about/aoura.jpeg',
            title: 'Group 1',
            description: 'Group Description',
            members: 10,
        }, {
            logo: '/about/aoura.jpeg',
            title: 'Group 1',
            description: 'Group Description',
            members: 10,
        }
    ]
}