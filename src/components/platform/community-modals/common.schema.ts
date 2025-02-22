import { common } from "@/Utils/backendEndpoints/backend-endpoints";

export const fetchTopics = async (setTopics: (topics: { [key: number]: string }) => void) => {
    fetch(common.topics)
            .then(res => res.json())
            .then(data => {
                const topicsMap: { [key: number]: string } = {};
                data.forEach((topic: { id: number; name: string }) => {
                    topicsMap[topic.id] = topic.name;
                });
                setTopics(topicsMap);
            })
            .catch(err => console.log(err))
}