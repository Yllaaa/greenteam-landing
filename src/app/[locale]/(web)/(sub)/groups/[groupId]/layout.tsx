/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/platform/a-header/Header";
import Footer from "@/components/platform/zfooter/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import styles from "./groups.module.css";
import Grpheader from "@/components/platform/sections/sec_group/header/GrpHeader";
import GroupSides from "@/components/platform/sections/sec_group/sides/GroupSides";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; groupId: string }>;
}) {
  // Await the params
  const { locale, groupId } = await params;

  // Fetch messages server-side
  const messages = await getMessages(locale as any);
  return (
    <section className="platform" lang="en">
      <NextIntlClientProvider messages={messages}>
        <header>
          <div style={{ position: "relative", zIndex: "10" }}>
            <Header />
          </div>
          <div style={{ position: "relative", zIndex: "9", marginTop: "50px" }}>
            <Grpheader groupId={groupId} />
          </div>
        </header>
        <div className={styles.container}>
          <div className={styles.childern}>{children}</div>
          <div className={styles.sidebar}>
            <GroupSides />
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </section>
  );
}
