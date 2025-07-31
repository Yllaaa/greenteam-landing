import React from "react";
import styles from "./ProductsFilter.module.css";
import { ProductsFilterProps } from "./ProductsFilterTypes.data";
import { Topics } from "@/components/Assets/topics/Topics.data";
import add from "@/../public/icons/add.svg";
import Image from "next/image";
import { useTranslations } from "next-intl";
import products from "@/../public/icons/products.svg";
// import AddNewEvent from "@/components/platform/community-modals/AddNewEvent";
function ProductsFilter(props: ProductsFilterProps) {
  const { section, setPage, setSection, setAddNew } = props;
const t = useTranslations("web.products.filter");
  const topics = Topics;

  const handleAddNew = () => {
    setAddNew(true);
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <Image src={products} alt="products" width={32} height={32} />
          <h3>{t("products")}</h3>
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
              {t("all")}
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
                {t(topic.name)}
              </li>
            ))}
          </ul>
        </div>
        {
          <div onClick={handleAddNew} className={styles.addBtn}>
            <Image src={add} alt="add" />
            <p>{t("addNew")}</p>
          </div>
        }
      </div>
      {/* <AddNewEvent show={show} onClose={() => setShow(false)} /> */}
    </>
  );
}

export default ProductsFilter;
