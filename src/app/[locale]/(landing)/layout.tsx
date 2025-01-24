/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
// import Footer from "@/components/zfooter/Footer";
import Navbar from "@/components/Landing_Page/00Navbar/Navbar";
// import Navbar from "@/components/aaaNavbar/Navbar";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
  pathname: string;
}) {
  // Await the params
  const { locale } = await params;

  // Fetch messages server-side
  const messages = await getMessages(locale as any);
  return (
    <section lang="en">
      <NextIntlClientProvider messages={messages}>
        <header><Navbar /></header>
        <div>{children}</div>
        <div>
          {/* <Footer /> */}
        </div>
      </NextIntlClientProvider>
    </section>
  );
}
