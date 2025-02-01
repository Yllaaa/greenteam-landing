"use client";
import React from 'react'
import PostCardText from './withoutImg/PostCardText'

function PostForums() {
    const randomPost = [
        {
          username: "john_doe",
          job: "Software Engineer",
          title: "The Future of AI",
          post:
            "Artificial Intelligence is revolutionizing the way we live and work. From self-driving cars to personalized recommendations, AI is everywhere.",
          image: "https://picsum.photos/id/237/400/300",
        },
        {
          username: "jane_smith",
          job: "Graphic Designer",
          title: "Design Trends 2023",
          post:
            "This year, we're seeing a lot of bold colors, asymmetrical layouts, and 3D elements in design. What's your favorite trend?",
          image: "https://picsum.photos/id/238/400/300",
        },
        {
          username: "alex_wong",
          job: "Data Scientist",
          title: "Big Data Insights",
          post:
            "Big data is transforming industries by providing insights that were previously unimaginable. The key is to know how to interpret the data.",
          image: "",
        },
        {
          username: "emily_jones",
          job: "Marketing Specialist",
          title: "Social Media Strategies",
          post:
            "Engaging content is the key to success on social media. Here are some tips to boost your online presence.",
          image: "https://picsum.photos/id/238/400/300",
        },
        {
          username: "mike_brown",
          job: "Teacher",
          title: "Remote Learning Tips",
          post:
            "With the rise of remote learning, here are some strategies to keep students engaged and motivated.",
          image: "",
        },
      ];
  return (
    <>
    <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap:"25px", overflow:"auto", scrollbarWidth:"none"}}>
        <PostCardText posts={randomPost}/>
    </div>
    </>
  )
}

export default PostForums