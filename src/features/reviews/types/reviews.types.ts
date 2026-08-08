export interface WeeklyReviewDTO {
  id: string;
  weekLabel: string;
  wins: string[];
  challenges: string[];
  focusNext: string[];
}

export interface MonthlyReviewDTO {
  id: string;
  monthLabel: string;
  summary: string;
  highlights: string[];
  lowlights: string[];
  nextFocus: string[];
}
