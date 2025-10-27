export interface Track {
  id: string | number;
  title: string;
  artist: string;
  album: {
    title: string;
    cover_medium: string;
    id: number;
  };
  preview: string;
  duration: number;
}