import { getTreasureById } from "../../../lib/db/treasures";
import { db } from "../../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";

type Props = {
  params: Promise<{
    treasureId: string;
  }>;
};

export default async function FoundDetailPage({ params }: Props) {
  const { treasureId } = await params;
  const treasure = await getTreasureById(treasureId);

  if (!treasure) {
    return (
      <main style={{ padding: 20 }}>
        <p>このお宝は存在しません。</p>
        <Link href="/found">← 一覧に戻る</Link>
      </main>
    );
  }

  // 発見日時を取得
  const q = query(
    collection(db, "foundTreasures"),
    where("treasureId", "==", treasureId),
    orderBy("foundAt", "desc"),
    limit(1)
  );
  const snap = await getDocs(q);
  const foundAt =
    !snap.empty
      ? snap.docs[0].data().foundAt?.toDate?.() ?? null
      : null;

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "16px 12px 40px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Link
        href="/found"
        style={{
          display: "inline-block",
          marginBottom: 12,
          fontSize: 14,
          color: "#0070f3",
          textDecoration: "none",
        }}
      >
        ← 発見されたお宝一覧に戻る
      </Link>

      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
        発見されたお宝
      </h1>

      
            {/* ギフト情報 */}
      {treasure.gift && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>
            獲得したギフト
          </h2>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 8,
              padding: 12,
              borderRadius: 12,
              backgroundColor: "#f7f7f7",
            }}
          >
            {/* ギフト画像 */}
            {treasure.gift.imageUrl && (
              <img
                src={treasure.gift.imageUrl}
                alt="ギフトカード"
                style={{
                  width: 96,
                  height: 96,
                  objectFit: "cover",
                  borderRadius: 8,
                  flexShrink: 0,
                }}
              />
            )}

            {/* ギフト説明 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {treasure.gift.title}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#555",
                  marginTop: 2,
                }}
              >
                {treasure.gift.shopName}
              </div>

              {treasure.gift.description && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#777",
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {treasure.gift.description}
                </div>
              )}
            </div>
          </div>
        </section>
      )}


      {/* 答えの画像 */}
      {treasure.answerImageUrl && (
        <img
          src={treasure.answerImageUrl}
          alt="お宝の場所"
          style={{
            width: "100%",
            maxHeight: 260,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 16,
          }}
        />
      )}

      {/* 答え */}
      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>答えの場所</h2>
        <p style={{ fontSize: 14 }}>{treasure.answerText}</p>
      </section>

      {/* ヒント */}
      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>出されていたヒント</h2>
        <p style={{ fontSize: 14 }}>{treasure.hintText}</p>
      </section>

      {/* 発見日時 */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>発見日時</h2>
        {foundAt ? (
          <p style={{ fontSize: 13, color: "#555" }}>
            {foundAt.toLocaleString("ja-JP")}
          </p>
        ) : (
          <p style={{ fontSize: 13, color: "#777" }}>
            発見日時の記録がありません
          </p>
        )}
      </section>
      
    </main>
  );
}
