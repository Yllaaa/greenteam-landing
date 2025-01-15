/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
// import Footer from "@/components/zFooter/Footer";
// import Navbar from "@/components/aaaNavbar/Navbar";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // No need to await params
  const { locale } = params;

  // Fetch messages server-side
  const messages = await getMessages(locale as any);

  return (
    <section lang={locale} className={locale === "ar" ? "rtl" : ""}>
      <NextIntlClientProvider messages={messages}>
        <header>{/* <Navbar /> */}</header>
        <div>{children}</div>
        <div>{/* <Footer /> */}</div>
      </NextIntlClientProvider>
    </section>
  );
}
