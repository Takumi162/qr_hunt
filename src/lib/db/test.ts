import { db } from "../firebase";
import { doc,getDoc } from "firebase/firestore";


export async function getTestTreasure() {
  const ref = doc(db, "treasures", "test1");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data();
}
