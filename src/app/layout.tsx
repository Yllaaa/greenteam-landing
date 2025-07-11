import type { Metadata } from "next";
import "./globals.css";
import '@/components/AA-NEW/MODALS/A_GUIDE/headerTour'; // Import to register the tour
import { Montserrat } from "next/font/google";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "@/store/StoreProvider";
import { TourProviderClient } from "@/components/AA-NEW/MODALS/A_GUIDE/TourProviderClient";
import TourInitializer from "@/components/AA-NEW/MODALS/A_GUIDE/tourInitializer";
import TourChainManager from "@/components/AA-NEW/MODALS/A_GUIDE/TourChainManager";
import Script from "next/script"
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" className={` ${montserrat.variable}`}>
        <head>
          {/* Google Tag Manager */}
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-24841MCD9Z"
          ></Script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-24841MCD9Z');
              `,
            }}
          />
          {/* End Google Tag Manager */}
        </head>
        <body>
          <TourProviderClient>
            <TourInitializer />
            <TourChainManager />
            {children}
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
          </TourProviderClient>
        </body>
      </html>
    </StoreProvider>
  );
}