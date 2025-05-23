// --- START: Type Definitions ---
export interface ChartPoint {
  name: string;
  value: number;
}

export interface RawChartData {
  labels: string[];
  data: number[];
}

export interface QuestionSurveyData {
  question_text: string;
  bar_chart: RawChartData;
  pie_chart: RawChartData;
}

export interface ComparisonDataset {
  label: string;
  data: number[];
}

export interface ComparisonData {
  title: string;
  labels: string[];
  datasets: ComparisonDataset[];
}

export interface FormattedComparisonPoint {
  name: string;
  [key: string]: string | number;
}

export interface DashboardData {
  truocDaoTao: QuestionSurveyData[];
  sauDaoTao: QuestionSurveyData[];
  soSanh: ComparisonData[];
}

// Types for Ba Bể Survey Data
export interface BaBeSurveyQuestionRaw {
  title: string;
  totalResponses: number;
  breakdown: { [key: string]: number };
  percentage: { [key: string]: string };
}

export interface BaBeSurveyInsights {
  keyFindings: string[];
  challenges: string[];
  opportunities: string[];
}

export interface BaBeSurveyRecommendations {
  shortTerm: string[];
  longTerm: string[];
  priority: string[];
}

export interface BaBeSurveyJson {
  overview: {
    totalResponses: number;
    analysisDate: string;
    surveyTitle: string;
  };
  questions: {
    [key: string]: BaBeSurveyQuestionRaw;
  };
  insights: BaBeSurveyInsights;
  recommendations: BaBeSurveyRecommendations;
}

export interface FormattedBaBeQuestion {
  id: string;
  question_text: string;
  totalResponsesForQuestion: number;
  chartData: RawChartData; 
}
// End - Types for Ba Bể Survey Data


export interface StatCardProps {
  title: string;
  value: string | number;
  bgColor: string;
}