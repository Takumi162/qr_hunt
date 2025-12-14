import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { getTreasureById } from "./treasures";

// ギフト一覧画面用：取得済みギフトカードを返す
export async function getFoundGiftCards() {
  const q = query(
    collection(db, "foundTreasures"),
    orderBy("foundAt", "desc")
  );

  const snap = await getDocs(q);
  if (snap.empty) return [];

  const seen = new Set<string>();
  const result = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const treasureId = data.treasureId;
    if (!treasureId) continue;

    // 同じ宝は1回だけ
    if (seen.has(treasureId)) continue;
    seen.add(treasureId);

    const treasure = await getTreasureById(treasureId);
    if (!treasure) continue;
    if (!treasure.gift) continue;

    result.push({
      treasureId,
      foundAt: data.foundAt?.toDate?.() ?? null,
      gift: treasure.gift,
    });
  }

  return result;
}

export async function logTreasureFound(
  treasureId: string,
  userId?: string | null
) {
  // ① すでに見つかっているか確認
  const q = query(
    collection(db, "foundTreasures"),
    where("treasureId", "==", treasureId)
  );
  const snap = await getDocs(q);

  const isFirstFinder = snap.empty;

  // ★ ここが重要
  const safeUserId = userId ?? null;

  // ② ログを追加
  await addDoc(collection(db, "foundTreasures"), {
    treasureId,
    userId: safeUserId, // ← undefined が入らない
    foundAt: serverTimestamp(),
    isWinner: isFirstFinder,
  });

  return isFirstFinder;
}
