export type Place = {
  id: string;
  displayName: string;
  latitude: number;
  longitude: number;
  formattedAddress?: string;
  distance?: number;
  /** Place Details で取得。24時間営業なら true */
  is24h?: boolean;
  /** Place Details で取得。車椅子対応入口なら true */
  wheelchairAccessibleEntrance?: boolean;
  /** Place Details で取得。キッズ向け・ベビーケアなら true */
  goodForChildren?: boolean;
};
