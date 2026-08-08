export interface HeatmapPoint {
  day: string;
  hour: string;
  score: number;
}

export interface SeriesAggregate {
  label: string;
  value: number;
  followers: number;
  count: number;
}
