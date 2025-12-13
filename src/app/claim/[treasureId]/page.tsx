"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { advanceFromTreasure } from "@/lib/db/treasures";

export default function ClaimPage() {
  const router = useRouter();
  const params = useParams();        // ← これ必須
  const treasureId = params.treasureId as string;   // ← 取り出す

  const [message, setMessage] = useState("QRを確認中…");

  useEffect(() => {
    async function run() {
      try {
        const result = await advanceFromTreasure(treasureId);

        if (result.status === "not-found") {
          setMessage("このQRは存在しません。");
          return;
        }

        if (result.status === "is_found"){
            setMessage("このお宝は発見済みです。");
            return;
        }

        if (result.status === "not-active") {
          setMessage("このお宝は現在のターンではありません。");
          return;
        }

        // 成功
        setMessage("発見！次のお宝へ移動します…");
        setTimeout(() => router.push("/next"), 1000);

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
