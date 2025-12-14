export type Gift = {
  title: string;
  imageUrl: string;
  shopName: string;
  price: number;
};

export type Treasure = {
  id: string;
  hintText: string;
  hintImageUrl?: string | null;
  answerText: string;
  answerImageUrl?: string | null;
  order: number;
  isActive: boolean;
  isFound?: boolean;

  gift?: Gift; // ← ★ これが重要
};
