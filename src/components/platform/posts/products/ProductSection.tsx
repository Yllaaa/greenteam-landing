/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import ProductCard from "./Card/ProductCard";
import styles from "./ProductSection.module.css";
import { MdOutlineFilterList } from "react-icons/md";
import { useForm } from "react-hook-form";
function ProductSection() {
  const [openTopics, setOpenTopics] = React.useState(false);
  const topicsRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topicsRef.current &&
        !topicsRef.current.contains(event.target as Node)
      ) {
        setOpenTopics(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [section, setSection] = React.useState<
    "doubt" | "need" | "dream" | "all"
  >("all");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
  console.log(errors);

  const topics = [
    {
      name: "sub1",
      id: "1",
    },
    {
      name: "sub2",
      id: "2",
    },
    {
      name: "sub3",
      id: "3",
    },
  ];
  const [mainTopicId, setMainTopicId] = React.useState<string | "all">("all"); // "3a9073ba-82da-4017-9fc2-52d318d0a050";
  return (
    <>
      <div className={styles.container}>
        {/*  */}
        <div className={styles.header}>
          <div className={styles.title}>
            <h3>
              <span className={styles.titleText}>Products</span>
            </h3>
          </div>
          <div className={styles.filterSection}>
            <ul>
              <li
                style={section === "all" ? { color: "#97B00F" } : { color: "" }}
                onClick={() => setSection("all")}
              >
                all
              </li>
              <li
                style={
                  section === "doubt" ? { color: "#97B00F" } : { color: "" }
                }
                onClick={() => setSection("doubt")}
              >
                doubt
              </li>
              <li
                style={
                  section === "dream" ? { color: "#97B00F" } : { color: "" }
                }
                onClick={() => setSection("dream")}
              >
                dream
              </li>
              <li
                style={
                  section === "need" ? { color: "#97B00F" } : { color: "" }
                }
                onClick={() => setSection("need")}
              >
                need
              </li>
            </ul>
          </div>
          <div className={styles.filterTopics}>
            <div
              onClick={() => setOpenTopics(!openTopics)}
              className={styles.topicsBtn}
            >
              <p>
                <span>
                  <MdOutlineFilterList />
                </span>{" "}
                filter
              </p>
            </div>
            {openTopics && (
              <div ref={topicsRef} className={styles.topicsList}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={styles.filter}>
                    <input
                      {...register("filter")}
                      onClick={() => {
                        setMainTopicId("all");
                        handleSubmit(onSubmit);
                        setOpenTopics(false);
                      }}
                      type="radio"
                      value="all"
                      id="all"
                      checked={mainTopicId === "all"}
                    />
                    <label htmlFor="all">All</label>
                  </div>
                  {topics &&
                    topics?.map((topic) => (
                      <div key={topic.id} className={styles.filter}>
                        <input
                          {...register("filter")}
                          onClick={() => {
                            setMainTopicId(topic.id);
                            handleSubmit(onSubmit);
                            setOpenTopics(false);
                          }}
                          type="radio"
                          value={topic.id}
                          id={topic.id}
                          checked={mainTopicId === topic.id}
                        />
                        <label htmlFor={topic.id}>{topic.name}</label>
                      </div>
                    ))}
                </form>
              </div>
            )}
          </div>
        </div>
        {/*  */}

        <div className={styles.posts}>
          <div className={styles.postContainer}>
            <ProductCard />
          </div>
          <div className={styles.postContainer}>
            <ProductCard />
          </div>
          <div className={styles.postContainer}>
            <ProductCard />
          </div>
          <div className={styles.postContainer}>
            <ProductCard />
          </div>
          <div className={styles.postContainer}>
            <ProductCard />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductSection;
