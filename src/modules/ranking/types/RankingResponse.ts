export interface RankingResponse {
  points: number;
  total_challenges: number;
  user: {
    id: string;
    name: string;
  };
}
