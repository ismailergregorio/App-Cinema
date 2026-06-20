
export interface  Filme {
  adult: boolean;
  backdropPath: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  posterPath: string;
  release_date: string;
  softcore: boolean;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export interface Categorias{
  id: number;
  name: string;
};
