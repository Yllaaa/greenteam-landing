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
