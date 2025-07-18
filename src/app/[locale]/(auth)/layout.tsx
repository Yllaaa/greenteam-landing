import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await the params
    const { locale } = await params;
  
    // Fetch messages server-side
    const messages = await getMessages({locale: locale});
  return (
    <section lang="en">
      <NextIntlClientProvider messages={messages}>
        <div>{children}</div>
      </NextIntlClientProvider>
    </section>
  );
}
