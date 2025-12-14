import Link from "next/link";
import { getFoundGiftCards } from "@/lib/db/foundTreasures";

export default async function FoundPage() {
  const items = await getFoundGiftCards();
  

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "16px 12px 80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        獲得したギフト
      </h1>

      {items.length === 0 && (
        <p style={{ fontSize: 14, color: "#666" }}>
          まだギフトはありません。
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <Link
            key={item.treasureId}
            href={`/found/${item.treasureId}`}
            style={{
              display: "flex",
              gap: 12,
              padding: 12,
              borderRadius: 12,
              backgroundColor: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {/* ギフト画像 */}
            {item.gift.imageUrl && (
              <img
                src={item.gift.imageUrl}
                alt="ギフトカード"
                style={{
                  width: 72,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: 8,
                  flexShrink: 0,
                }}
              />
            )}

            {/* ギフト説明 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {item.gift.title}
              </div>

              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                {item.gift.shopName}
              </div>

              <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
                {item.gift.description}
              </div>
            </div>

            {/* 右矢印（遷移が分かりやすい） */}
            <span
              style={{
                fontSize: 18,
                color: "#ccc",
                alignSelf: "center",
              }}
            >
              ›
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
