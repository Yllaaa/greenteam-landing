import React from "react";
import styles from "./ProductsFilter.module.css";
import { ProductsFilterProps } from "./ProductsFilterTypes.data";
import { Topics } from "@/components/Assets/topics/Topics.data";
import products from "@/../public/icons/products.svg";
import Image from "next/image";
// import AddNewEvent from "@/components/platform/community-modals/AddNewEvent";
function ProductsFilter(props: ProductsFilterProps) {
  const { section, setPage, setSection } = props;

  const topics = Topics;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <Image src={products} alt="products" width={32} height={32} />
          <h3>Products</h3>
        </div>
        <div className={styles.filterSection}>
          <ul>
            <li
              style={
                section === 0 ? { color: "#97B00F", opacity: 1 } : { color: "" }
              }
              onClick={() => {
                setPage(1);
                setSection(0);
              }}
            >
              all
            </li>
            {topics.map((topic) => (
              <li
                key={topic.id}
                style={
                  section === topic.id
                    ? { color: "#97B00F", opacity: 1 }
                    : { color: "" }
                }
                onClick={() => {
                  setPage(1);
                  setSection(topic.id);
                }}
              >
                {topic.name}
              </li>
            ))}
          </ul>
        </div>
        {/* <div className={styles.addBtn}>
          <button onClick={handleAddNew}>Add Product</button>
        </div> */}
      </div>
      {/* <AddNewEvent show={show} onClose={() => setShow(false)} /> */}
    </>
  );
}

export default ProductsFilter;
