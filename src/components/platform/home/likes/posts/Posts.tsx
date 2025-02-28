import { useEffect, useState } from 'react';
import Item from './Item';
import { getPosts, PostItem } from './posts.data'
import styles from './posts.module.scss'



export default function Posts({ category }: { category: string }) {
    const [posts, setPosts] = useState([] as PostItem[])

    useEffect(() => {
        getPosts().then(data => setPosts(data))
    }, [])


    const filteredPosts = {
        get() {
            if (category == 'All')
                return posts;
            const cat = category.toLowerCase()
            return posts.filter((p) => p.category.toLowerCase() == cat)
        }
    }

    return (
        <div className={styles.postsContainer}>
            <div className={styles.posts}>
                {filteredPosts.get().map((post, index) =>
                    <Item key={index} {...post} />
                )}
            </div>
        </div>
    )
}