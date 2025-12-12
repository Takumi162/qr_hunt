import { db } from "../firebase";
import { query,collection,where,getDocs } from "firebase/firestore";

//次のヒントを取得する関数を宣言する。

export async function getNextHint() {
  const q = query(
    collection(db,"treasures"),
    where("isActive","==",true)
  );

  const snap = await getDocs(q);
  

  if (snap.empty) {
    return null;
  }

  return {
  id: snap.docs[0].id,
  hintText: snap.docs[0].data().hintText,
  hintImageUrl: snap.docs[0].data().hintImageUrl,
  answerText: snap.docs[0].data().answerText,
  answerImageUrl: snap.docs[0].data().answerImageUrl,
  order: snap.docs[0].data().order,
  isActive: snap.docs[0].data().isActive
};

}
