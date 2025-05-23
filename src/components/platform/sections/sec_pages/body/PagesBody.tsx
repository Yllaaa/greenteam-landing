"use client";
import React from "react";
import EventSection from "./Events/EventSection";
import ProductSection from "./products/ProductSection";
import styles from "./PageBody.module.scss";
import FeedSection from "./feeds/FeedSection";
import Pageheader from "../header/PageHeader";
import Settings from "../header/settings/Settings";
function PagesBody(props: { pageId: string }) {
  const { pageId } = props;
  const [settings, setSettings] = React.useState(false);
  return (
    <>
      <section className={styles.body}>
        <div style={{ marginTop: "15px" }}>
          <Pageheader
            pageId={pageId}
            setSettings={setSettings}
            settings={settings}
          />
        </div>
        {settings ? (
          <Settings slug={pageId} />
        ) : (
          <>
            <div className={styles.events}>
              <FeedSection />
            </div>
            <div className={styles.events}>
              <EventSection slug={pageId} />
            </div>
            <div className={styles.products}>
              <ProductSection slug={pageId} />
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default PagesBody;
