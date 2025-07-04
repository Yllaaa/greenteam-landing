import ReactQueryProvider from "@/components/platform/Payment/Plans/providers/plansProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Green Team Subscriptions",
  description: "Subscription plans for Green Team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </div>
  );
}
