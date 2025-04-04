import Item from "./Item";
// import { getPageItems } from "./pages.data";
import styles from "./pages.module.scss";

export default async function Pages() {
  // const pages = await getPageItems();
  // console.log("pages", pages);
  const pages = [
    {
      likes: 100,
      followers: 15,
      name: "string",
      description: "string",
    },
    {
      likes: 100,
      followers: 15,
      name: "string",
      description: "string",
    },
    {
      likes: 100,
      followers: 15,
      name: "string",
      description: "string",
    },
    {
      likes: 100,
      followers: 15,
      name: "string",
      description: "string",
    },
    {
      likes: 100,
      followers: 15,
      name: "string",
      description: "string",
    },
  ];
  return (
    <div className={styles.pages}>
      {pages.map((page, index) => (
        <Item key={index} {...page} />
      ))}
    </div>
  );
}
