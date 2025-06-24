/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar from "@/components/Landing_Page/00Navbar/Navbar";
import Footer from "@/components/Landing_Page/ZFooter/Footer";
import styles from "./page.module.css";
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
    <section className={styles.bg} lang="en">
      <div className={styles.shadow5}></div>
      <NextIntlClientProvider messages={messages}>
        <header>
          <Navbar />
        </header>
        <div>{children}</div>
        <div>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </section>
  );
}
