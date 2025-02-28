import { useEffect, useState } from 'react';
import Item from './Item';
import getNews, { NewsItem } from './new.data'
import styles from './news.module.scss'
import Link from 'next/link';

export default function News() {
    const [news, setNews] = useState([] as NewsItem[])

    useEffect(() => {
        getNews().then(data => setNews(data))
    }, [])

    return (
        <div className={styles.news}>
            <div className={styles.header}>
                What&apos;s happening
            </div>
            <div>
                {news.map((newsItem, index) =>
                    <Item key={index} {...newsItem} />
                )}
            </div>
            <div className={styles.showMore}>
                <Link href={"#"}>Show more</Link>
            </div>
        </div>
    )
}