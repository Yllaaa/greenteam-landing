/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
// import Navbar from "@/components/aaaNavbar/Navbar";

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
    <section lang="en">
      <NextIntlClientProvider messages={messages}>
        <header>{/* <Navbar /> */}</header>
        <div>{children}</div>
      </NextIntlClientProvider>
    </section>
  );
}
