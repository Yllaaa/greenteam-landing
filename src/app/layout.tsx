import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "@/store/StoreProvider";
import Script from "next/script";
import ClientOnlyToast from "@/Utils/ToastNotification/ClientOnlyToast";
// import { TourProviderClient } from "@/components/AA-NEW/MODALS/A_GUIDE/TourProviderClient";
// import TourComponents from "@/components/AA-NEW/MODALS/A_GUIDE/TourComponents";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  style: ["normal"],
  display: "swap",
  fallback: ["system-ui", "sans-serif", "arial"],
  variable: "--monta",
});

export const metadata: Metadata = {
  
  title: "GREEN TEAM",
  description: "Life not only life",
  icons: {
    icon: '/favicon.png', // or '/favicon.png'
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" className={` ${montserrat.variable}`}>
        <body>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-3KCMFBG4FN"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3KCMFBG4FN');
            `}
          </Script>

          {/* <TourProviderClient>
            <TourComponents /> */}
            {children}
            <ClientOnlyToast />
          {/* </TourProviderClient> */}
        </body>
      </html>
    </StoreProvider>
  );
}