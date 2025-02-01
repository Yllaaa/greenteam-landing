/* eslint-disable @typescript-eslint/no-explicit-any */
import Categories from "@/components/platform/categoriesDimond/Categories";
import Header from "@/components/platform/header/Header";
import MyChallenges from "@/components/platform/suggested/challenges/myChallenges/MyChallenges";
import Suggested from "@/components/platform/suggested/Suggested";
import Footer from "@/components/platform/zfooter/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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
          </div>
          <div
            style={{
              zIndex: "10",
              padding: "40px 30px",
              display: "flex",
              flexDirection: "row",
              gap: "25px",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            <Categories />
            <Suggested />
            <MyChallenges />
          </div>
        </header>
        <div>{children}</div>
        <div>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </section>
  );
}
