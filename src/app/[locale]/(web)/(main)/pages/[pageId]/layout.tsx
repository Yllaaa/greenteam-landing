/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import styles from "./page.module.css";
import Pageheader from "@/components/platform/sections/sec_pages/header/PageHeader";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; pageId: string }>;
}) {
  // Await the params
  const { locale, pageId } = await params;

  // Fetch messages server-side
  const messages = await getMessages(locale as any);
  return (
    <section className="platform" lang="en">
      <NextIntlClientProvider messages={messages}>
        <header>
          <div style={{ position: "relative", zIndex: "9", marginTop: "50px" }}>
            <Pageheader pageId={pageId} />
          </div>
        </header>

        <div className={styles.childern}>{children}</div>
      </NextIntlClientProvider>
    </section>
  );
}
