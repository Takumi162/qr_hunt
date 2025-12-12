import { getTestTreasure } from "@/lib/db/test";

export default async function TestPage() {
  const data = await getTestTreasure();

  return (
    <div>
      <h1>Firebase 接続テスト</h1>

      {data ? (
        <>
          <p>hintText: {data.hintText}</p>
        </>
      ) : (
        <p>データがありません</p>
      )}
    </div>
  );
}
