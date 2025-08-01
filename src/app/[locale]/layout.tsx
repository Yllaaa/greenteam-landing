/* eslint-disable @typescript-eslint/no-explicit-any */
// import { GlobalTourProvider } from "@/components/AA-NEW/MODALS/A_GUIDE/tourProvider";
import CookieConsent from "@/components/AA-NEW/MODALS/COOKIES/CookieConsent";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import TourComponents from "@/components/AA-NEW/MODALS/A_GUIDE/TourComponents";
import { TourProviderClient } from "@/components/AA-NEW/MODALS/A_GUIDE/TourProviderClient";

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
        {/* <GlobalTourProvider> */}
<TourProviderClient>
            <TourComponents />
        <div>
          {children}
          <CookieConsent
          />
          </div>
        </TourProviderClient>
        {/* </GlobalTourProvider> */}

      </NextIntlClientProvider>
    </section>
  );
}
