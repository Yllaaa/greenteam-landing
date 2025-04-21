/* eslint-disable @typescript-eslint/no-explicit-any */

import BallHeader from "@/components/platform/community/AmapHeader/MapHeader";

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
          <div>
            <BallHeader />
          </div>
        </header>
        <div>{children}</div>
      </NextIntlClientProvider>
    </section>
  );
}
