import { getNextHint } from "@/lib/db/treasures";

export default async function NextPage() {
  const treasure = await getNextHint();

  if (!treasure) {
    return (
      <div style={{ padding: 20 }}>
        <h1>次のお宝のヒント</h1>
        <p>現在公開中のお宝がありません。</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>次のお宝のヒント</h1>

      {/* ヒントテキスト */}
      <h2 style={{ marginTop: 20 }}>{treasure.hintText}</h2>

      {/* ヒント画像 */}
      {treasure.hintImageUrl && (
        <img
          src={treasure.hintImageUrl}
          alt="ヒント画像"
          style={{ width: "100%", maxWidth: 400, marginTop: 20 }}
        />
      )}
    </div>
  );
}
