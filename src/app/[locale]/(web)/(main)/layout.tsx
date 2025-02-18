/* eslint-disable @typescript-eslint/no-explicit-any */

import Header from "@/components/platform/header/Header";

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
        </header>
        <div>{children}</div>
        <div>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </section>
  );
}
