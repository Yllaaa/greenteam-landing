import React from "react";
import EventSection from "./Events/EventSection";
import ProductSection from "./products/ProductSection";
import styles from "./PageBody.module.scss";
import FeedSection from "./feeds/FeedSection";
function PagesBody(props: { pageId: string }) {
  const { pageId } = props;
  return (
    <>
      <section className={styles.body}>
        <div className={styles.events}>
          <FeedSection />
        </div>
        <div className={styles.events}>
          <EventSection slug={pageId} />
        </div>
        <div className={styles.products}>
          <ProductSection slug={pageId} />
        </div>
      </section>
    </>
  );
}

export default PagesBody;
