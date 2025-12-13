"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { advanceFromTreasure } from "@/lib/db/treasures";
import { logTreasureFound } from "@/lib/db/foundTreasures";

export default function ClaimPage() {
  const router = useRouter();
  const params = useParams();
  const treasureId = params.treasureId as string;

  const [message, setMessage] = useState("QRを確認中…");

  useEffect(() => {
    async function run() {
      const id = treasureId; // 安全な string

      try {
        const result = await advanceFromTreasure(id);

        if (result.status === "not-found") {
          setMessage("このQRは存在しません。");
          return;
        }

        if (result.status === "is-found") {
          setMessage("このお宝はすでに発見されました。");
          return;
        }

        if (result.status === "not-active") {
          setMessage("このお宝は現在のターンではありません。");
          return;
        }

        // 成功
        if (result.status === "advanced") {

          // 発見ログを追加
          await logTreasureFound(id);

          setMessage("おめでとう！次のお宝のヒントへ移動します…");

          setTimeout(() => {
            router.push("/next");
          }, 1000);

          return;
        }

      } catch (e) {
        console.error(e);
        setMessage("エラーが発生しました。");
      }
    }

    if (treasureId) run();
  }, [treasureId, router]);

  return (
    <div style={{ padding: 20 }}>
      <h1>お宝チェック中</h1>
      <p>{message}</p>
    </div>
  );
}
