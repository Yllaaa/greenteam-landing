import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "@/store/StoreProvider";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  style: ["normal"],
  display: "swap",
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
        </body>
      </html>
    </StoreProvider>
  );
}
