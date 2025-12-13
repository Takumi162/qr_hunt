import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function logTreasureFound(treasureId: string, userId: string | null = null) {
  await addDoc(collection(db, "foundTreasures"), {
    treasureId,
    userId,
    foundAt: serverTimestamp(),
  });
}
