import BottomNav from "@/components/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0 }}>
        {/* ページ本体 */}
        <div style={{ paddingBottom: 56 }}>
          {children}
        </div>

        {/* 下部ナビ */}
        <BottomNav />
      </body>
    </html>
  );
}
