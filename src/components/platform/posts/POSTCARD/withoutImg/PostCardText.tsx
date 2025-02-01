"use client";
import React from "react";
import styles from "./PostCardText.module.css";
import Image from "next/image";
import doIcon from "@/../public/ZPLATFORM/post/do.svg";
import like from "@/../public/ZPLATFORM/post/like.svg";
import unlike from "@/../public/ZPLATFORM/post/unlike.svg";
import comment from "@/../public/ZPLATFORM/post/comment.svg";

interface Props {
  posts: {
    username: string;
    job: string;
    title: string;
    post: string;
    image: string;
  }[];
}
function PostCardText(props: Props) {
  const { posts } = props;
  // const randomPost = [
  //   {
  //     username: "john_doe",
  //     job: "Software Engineer",
  //     title: "The Future of AI",
  //     post:
  //       "Artificial Intelligence is revolutionizing the way we live and work. From self-driving cars to personalized recommendations, AI is everywhere.",
  //     image: "https://picsum.photos/id/237/400/300",
  //   },
  //   {
  //     username: "jane_smith",
  //     job: "Graphic Designer",
  //     title: "Design Trends 2023",
  //     post:
  //       "This year, we're seeing a lot of bold colors, asymmetrical layouts, and 3D elements in design. What's your favorite trend?",
  //     image: "https://picsum.photos/id/238/400/300",
  //   },
  //   {
  //     username: "alex_wong",
  //     job: "Data Scientist",
  //     title: "Big Data Insights",
  //     post:
  //       "Big data is transforming industries by providing insights that were previously unimaginable. The key is to know how to interpret the data.",
  //     image: "",
  //   },
  //   {
  //     username: "emily_jones",
  //     job: "Marketing Specialist",
  //     title: "Social Media Strategies",
  //     post:
  //       "Engaging content is the key to success on social media. Here are some tips to boost your online presence.",
  //     image: "https://picsum.photos/id/238/400/300",
  //   },
  //   {
  //     username: "mike_brown",
  //     job: "Teacher",
  //     title: "Remote Learning Tips",
  //     post:
  //       "With the rise of remote learning, here are some strategies to keep students engaged and motivated.",
  //     image: "",
  //   },
  // ];

  return (
    <>
      {posts.map(
        (
          post: {
            username: string;
            job: string;
            title: string;
            post: string;
            image: string;
          },
          index: number
        ) => (
          <div key={index} className={styles.container}>
            <div className={styles.user}>
              <div className={styles.avatar}>
                {post.image ? (
                  <Image
                    src={post.image}
                    alt="image"
                    loading="lazy"
                    width={400}
                    height={300}
                  />
                ) : (
                  <div className={styles.noAvatar}></div>
                )}
              </div>
              <div className={styles.data}>
                <div className={styles.username}>
                  <p>{post.username}</p> {" . "}
                  <span>Follow</span>
                </div>
                <div className={styles.job}>{post.job}</div>
              </div>
            </div>
            <div className={styles.scrollable}>
              <div className={styles.body}>
                <div className={styles.title}>{post.title}</div>
                <div className={styles.post}>
                  {post.post} Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Porro sequi ipsum molestias, deleniti dignissimos eaque
                  rerum aut possimus quo, fuga amet sint ex culpa magnam vitae
                  officiis quam ut at. Lorem ipsum dolor, sit amet consectetur
                  adipisicing elit. Doloremque nam sequi quibusdam aut ipsa
                  quisquam saepe debitis dolorum nesciunt culpa sit, ullam,
                  fugit at ipsum iste praesentium. Dignissimos tempora, atque
                  eaque repellat dolorum illo natus voluptas? Voluptates ea
                  ratione beatae officia, enim temporibus quas accusantium
                  aliquam distinctio! Distinctio, dolore iste!
                </div>
              </div>
              {post.image && (
                <div className={styles.image}>
                  <Image
                    src={post.image}
                    alt="image"
                    loading="lazy"
                    width={400}
                    height={300}
                  />
                </div>
              )}
            </div>
            <div className={styles.reactionBtns}>
              <div className={styles.btn}>
                <Image src={doIcon} alt="do" />
                <p>
                  <span>Do</span>
                </p>
              </div>
              <div className={styles.btn}>
                <Image src={like} alt="like" />
                <p>
                  <span>Like</span>
                </p>
              </div>
              <div className={styles.btn}>
                <Image src={unlike} alt="unlike" />
                <p>
                  <span>Unlike</span>
                </p>
              </div>
              <div className={styles.btn}>
                <Image src={comment} alt="comment" />
                <p>
                  <span>Comment</span>
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default PostCardText;
