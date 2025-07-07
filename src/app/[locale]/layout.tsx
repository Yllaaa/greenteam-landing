/* eslint-disable @typescript-eslint/no-explicit-any */
import CookieConsent from "@/components/AA-NEW/MODALS/COOKIES/CookieConsent";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
// import '../styles/globals.css'
import 'shepherd.js/dist/css/shepherd.css'
import { ShepherdProvider } from "@/components/AA-NEW/MODALS/A_GUIDE/ShepherdProvider";
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
        <ShepherdProvider>
          <div>
            {children}
            <CookieConsent
            />
          </div>
        </ShepherdProvider>
      </NextIntlClientProvider>
    </section>
  );
}
