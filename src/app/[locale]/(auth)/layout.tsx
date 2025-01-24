export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <section lang="en">
      <div>{children}</div>
    </section>
  );
}
