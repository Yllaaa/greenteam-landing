import React from "react";
import styles from "./ProductsFilter.module.css";
import { ProductsFilterProps } from "./ProductsFilterTypes.data";
import { Topics } from "@/components/Assets/topics/Topics.data";
import { useTranslations } from "next-intl";
import products from "@/../public/icons/products.svg";
import Image from "next/image";
function ProductsFilter(props: ProductsFilterProps) {
  const { section, setPage, setSection, setAddNew } = props;
  const topics = Topics;

  const handleAddNew = () => {
    setAddNew(true);
  };

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Handle horizontal scrolling with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      // e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };
  const t = useTranslations("web.products.filter");
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Image src={products} alt="products" width={32} height={32} />
          <h3 className={styles.title}>{t("products")}</h3>
          <div className={styles.addBtnMobile}>
            <button onClick={handleAddNew}>{t("addNew")}</button>
          </div>
        </div>

        <div
          className={styles.filterSection}
          ref={scrollRef}
          onWheel={handleWheel}
        >
          <div className={styles.scrollIndicatorLeft}></div>
          <ul className={styles.filterList}>
            <li
              className={`${styles.filterItem} ${section === 0 ? styles.active : ""}`}
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
                className={`${styles.filterItem} ${section === topic.id ? styles.active : ""}`}
                onClick={() => {
                  setPage(1);
                  setSection(topic.id);
                }}
              >
                {t(topic.name)}
              </li>
            ))}
          </ul>
          <div className={styles.scrollIndicatorRight}></div>
        </div>

        <div className={styles.addBtnDesktop}>
          <button onClick={handleAddNew}>Add Product</button>
        </div>
      </div>
    </div>
  );
}

export default ProductsFilter;