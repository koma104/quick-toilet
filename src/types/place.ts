export interface Place {
  id: string;
  displayName: string;
  latitude: number;
  longitude: number;
  formattedAddress?: string;
  distance?: number;
}
