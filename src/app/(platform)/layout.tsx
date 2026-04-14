export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="">
        {children}
      </main>
  );
}
