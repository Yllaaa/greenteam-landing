import React from "react";
import styles from "./ProductsFilter.module.css";
import { ProductsFilterProps } from "./ProductsFilterTypes.data";
import { Topics } from "@/components/Assets/topics/Topics.data";
import { useAppSelector } from "@/store/hooks";
// import AddNewEvent from "@/components/platform/community-modals/AddNewEvent";
function ProductsFilter(props: ProductsFilterProps) {
  const { section, setPage, setSection, setAddNew } = props;
  const pageStatus = useAppSelector((state) => state.pageState);
  const topics = Topics;

  const handleAddNew = () => {
    setAddNew(true);
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
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
        {pageStatus && pageStatus.isAdmin && (
          <div className={styles.addBtn}>
            <button onClick={handleAddNew}>Add Product</button>
          </div>
        )}
      </div>
      {/* <AddNewEvent show={show} onClose={() => setShow(false)} /> */}
    </>
  );
}

export default ProductsFilter;
