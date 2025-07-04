/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/platform/a-header/Header";
import Footer from "@/components/platform/zfooter/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import styles from "./personal.module.css";
import BackButton from "@/components/platform/breadcrumb/BackButton";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await the params
  const { locale } = await params;

  // Fetch messages server-side
  const messages = await getMessages(locale as any);
  return (
    <section className="platform" lang="en">
      <NextIntlClientProvider messages={messages}>
        <header>
          <div style={{ position: "relative", zIndex: "10" }}>
            <Header />
            <BackButton shouldHideOnFeeds={true} />
          </div>
        </header>
        <div className={styles.container}>
          <div className={styles.childern}>{children}</div>
        </div>
        <div>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </section>
  );
}
