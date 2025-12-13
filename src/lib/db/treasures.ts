import { db } from "../firebase";
import { query,collection,where,getDocs,getDoc,doc,updateDoc,orderBy,limit } from "firebase/firestore";


//Firebaseと通信する関数（データの取得や編集）はこのファイルにまとめる。


//公開中のヒントを取得する関数を宣言する。

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
    //確実にデータを一件だけ取得するため0番目のデータを返り値に指定する。
    id: snap.docs[0].id,
    hintText: snap.docs[0].data().hintText,
    hintImageUrl: snap.docs[0].data().hintImageUrl,
    answerText: snap.docs[0].data().answerText,
    answerImageUrl: snap.docs[0].data().answerImageUrl,
    order: snap.docs[0].data().order,
    isActive: snap.docs[0].data().isActive
};

}


//読み込まれたQRコードが「どのお宝のQRコードだったか」を確かめるために、お宝をidで検索するための関数を作る。
export async function getTreasureById(id :string){
    const ref = doc(db,"treasures",id);
    const snap = await getDoc(ref);

    if(!snap.exists()){
        console.log("該当するお宝を見つけられませんでした。");
        return null;
        
    }

    return {
        id:snap.id,
        hintText: snap.data().hintText,
        hintImageUrl: snap.data().hintImageUrl,
        answerText: snap.data().answerText,
        answerImageUrl: snap.data().answerImageUrl,
        order: snap.data().order,
        isActive: snap.data().isActive,
        isFound: snap.data().isFound,
    }
}


// QRで読まれた treasureId からゲームを1ステップ進める

//scannerId(QRコードに埋め込むUrlはfirestoreのドキュメントと対応させる)
export async function advanceFromTreasure(scannedId: string) {
  // ① QRに対応する宝を読み込む
  const currentRef = doc(db, "treasures", scannedId);
  const currentSnap = await getDoc(currentRef);

  if (!currentSnap.exists()) {
    // そのIDの宝が存在しない(プロジェクトと関係のないQRが読み込まれた場合。)
    //"not-found"を返す
    return { status: "not-found" as const };
  }

  const current = currentSnap.data() as any;
  //返り値(firestoreから取得したオブジェクト)の型がわからないため、型をanyとして無視させる(typescript的に重要)

  // ② 今アクティブなお宝かどうかチェック
  if (!current.isActive) {
    if(current.isFound == true) return { status: "is-found" as const };
    
    // もう終わってる or まだ出番じゃない宝
    return { status: "not-active" as const };
  }

  const currentOrder = current.order ?? 0;

  // ③ 「次の順番」の宝を1件だけ探す
  //今のorder以降のお宝を残す。
  //orderがasc(ascending :昇順、古い→新しい順)に並べる。
  //limitで最初の一件(=次のお宝)を取り出す。
  const q = query(
    collection(db, "treasures"),
    where("order", ">", currentOrder),
    orderBy("order", "asc"),
    limit(1)
  );
  const nextSnap = await getDocs(q);

  // ④ 今の宝を「見つかった & 非アクティブ」に更新
  //currentRefにはQRコードで読まれたQRコードのドキュメントが入っている。
  await updateDoc(currentRef, {
    isActive: false,
    isFound: true,
  });

  // ⑤ 次の宝があれば isActive にする
  //nextIdの型はstringまたはnullにするという変数定義(typescript仕様)
  let nextId: string | null = null;
  if (!nextSnap.empty) {
    //次のお宝がある場合、nextDocにデータを代入する。
    const nextDoc = nextSnap.docs[0];
    //次のお宝のアクティブ状態を更新して「公開中にする」
    await updateDoc(nextDoc.ref, {
      isActive: true,
    });
    //次のお宝のidを管理する変数を定義する。
    nextId = nextDoc.id;
  }

  return {
    //他のパターン(not-foundやnot-active)に対して進行したことを示すadvancedを返す。
    status: "advanced" as const,
    //次のお宝のIdを返す。
    nextTreasureId: nextId, // 最後の宝なら null
  };
}
