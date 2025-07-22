/* eslint-disable @typescript-eslint/no-explicit-any */

import Header from "@/components/platform/a-header/Header";
import BackButton from "@/components/platform/breadcrumb/BackButton";
import ReactQueryProvider from "@/components/platform/Payment/Plans/providers/plansProvider";

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
    <section data-tour={"all"} className="platform" lang="en">
      <NextIntlClientProvider messages={messages}>
        <header>
          <div style={{ position: "relative", zIndex: "1000" }}>
            <Header />
            <div>

              <BackButton shouldHideOnFeeds={true} />
            </div>
          </div>
        </header>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <div>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </section>
  );
}