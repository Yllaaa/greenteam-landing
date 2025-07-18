/* eslint-disable @typescript-eslint/no-explicit-any */
// import { GlobalTourProvider } from "@/components/AA-NEW/MODALS/A_GUIDE/tourProvider";
import CookieConsent from "@/components/AA-NEW/MODALS/COOKIES/CookieConsent";
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
    <section data-tour={"all"} lang="en">
      <NextIntlClientProvider messages={messages}>
        {/* <GlobalTourProvider> */}

        <div>
          {children}
          <CookieConsent
          />
        </div>
        {/* </GlobalTourProvider> */}

      </NextIntlClientProvider>
    </section>
  );
}
