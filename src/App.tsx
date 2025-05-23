// src/App.tsx
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type {
  ChartPoint,
  RawChartData,
  QuestionSurveyData,
  ComparisonDataset,
  ComparisonData,
  FormattedComparisonPoint,
  DashboardData,
  BaBeSurveyJson,
  FormattedBaBeQuestion,
  StatCardProps,
} from "./khaosatModel";
// --- START: Language Translations ---
const translations = {
  en: {
    // Header
    headerTitle: "Digital Skills Training Effectiveness Assessment",
    headerSubtitle: "Visual report on pre and post-training surveys",

    // Navigation
    overview: "Overview",
    beforeTraining: "Before Training",
    afterTraining: "After Training",
    comparison: "Comparison",
    baBeSurvey: "Ba Bể Survey",

    // Overview Stats
    totalParticipants: "Total Survey Participants",
    technologyReadinessBefore: "Technology Adoption Readiness (Before)",
    skillImprovementRate: "Skill Confidence Improvement Rate",

    // Overview Sections
    overviewTitle: "Training Course Effectiveness Summary",
    confidenceChangeTitle: "Changes in Confidence Level",
    toolUsageChangeTitle: "Changes in Tool Usage",
    overallEffectivenessTitle: "Overall Training Course Effectiveness",
    skillApplicationTitle: "Skill Application After Training",
    effectivenessQuestion: "Course effectiveness assessment:",
    applicationQuestion: "Can apply newly learned skills:",

    // Before/After Training & Ba Bể Survey
    beforeTrainingTitle: "Pre-Training Data",
    afterTrainingTitle: "Post-Training Data",
    baBeSurveyTitle: "Ba Bể Tourism Survey Data",
    selectQuestion: "Select question:",
    barChart: "Bar Chart",
    pieChart: "Pie Chart (%)",

    // Comparison
    comparisonTitle: "Before and After Training Comparison",
    selectComparison: "Select comparison:",
    mainConclusions: "Main Conclusions",

    // Conclusions
    conclusion1:
      "Confidence in creating image/video content has increased significantly after the training course.",
    conclusion2:
      "Canva tool usage rate has increased from 6.2% to 70.7% (example, this data should be in JSON).",
    conclusion3:
      "Ability to create tourism promotional videos has improved significantly, with 91.4% of participants able to create videos after the course.",
    conclusion4:
      "Most students (91.4%) can apply newly learned skills to tourism promotion work.",
    conclusion5:
      "The training course is evaluated as very effective with 53.4% of participants finding the course helps significantly improve digital technology usage capabilities.",

    // Footer
    footerCopyright: "Digital Skills Training Effectiveness Assessment Report By Institute of Applied Science and Technology (IAST)",
    footerDescription: "Data collected from pre and post-training surveys",

    // Loading and Error
    loading: "Loading data...",
    errorLoading: "Error loading data:",
    noData: "No data to display.",

    // Chart Labels
    beforeTrainingLabel: "Before Training",
    afterTrainingLabel: "After Training",

    // Ba Bể Survey Specific Translations
    surveyInsightsTitle: "Survey Insights",
    keyFindings: "Key Findings",
    challenges: "Challenges",
    opportunities: "Opportunities",
    surveyRecommendationsTitle: "Survey Recommendations",
    shortTermRec: "Short-Term Recommendations",
    longTermRec: "Long-Term Recommendations",
    priorityRec: "Priority Recommendations",
    analysisDate: "Analysis Date",
    totalSurveyResponsesTitle: "Number of responses",
    totalSurveyResponses: "Total Survey Responses",
  },
  vi: {
    // Header
    headerTitle: "Đánh Giá Hiệu Quả Khóa Tập Huấn Kỹ Thuật Số",
    headerSubtitle: "Báo cáo trực quan về khảo sát trước và sau đào tạo",

    // Navigation
    overview: "Tổng Quan",
    beforeTraining: "Trước Đào Tạo",
    afterTraining: "Sau Đào Tạo",
    comparison: "So Sánh",
    baBeSurvey: "Khảo Sát Ba Bể",

    // Overview Stats
    totalParticipants: "Số Người Tham Gia Khảo Sát",
    technologyReadinessBefore: "Mức Độ Sẵn Sàng Áp Dụng Công Nghệ (Trước)",
    skillImprovementRate: "Mức Cải Thiện Kỹ Năng Tự Tin",

    // Overview Sections
    overviewTitle: "Tổng Kết Hiệu Quả Khóa Đào Tạo",
    confidenceChangeTitle: "Sự Thay Đổi về Mức Độ Tự Tin",
    toolUsageChangeTitle: "Sự Thay Đổi về Sử Dụng Công Cụ",
    overallEffectivenessTitle: "Hiệu Quả Tổng Thể Khóa Đào Tạo",
    skillApplicationTitle: "Áp Dụng Kỹ Năng Sau Đào Tạo",
    effectivenessQuestion: "Đánh giá hiệu quả của khóa học:",
    applicationQuestion: "Có thể áp dụng các kỹ năng mới học:",

    // Before/After Training & Ba Bể Survey
    beforeTrainingTitle: "Dữ Liệu Trước Đào Tạo",
    afterTrainingTitle: "Dữ Liệu Sau Đào Tạo",
    baBeSurveyTitle: "Dữ Liệu Khảo Sát Du Lịch Ba Bể",
    selectQuestion: "Chọn câu hỏi:",
    barChart: "Biểu Đồ Cột",
    pieChart: "Biểu Đồ Tròn (%)",

    // Comparison
    comparisonTitle: "So Sánh Trước và Sau Đào Tạo",
    selectComparison: "Chọn so sánh:",
    mainConclusions: "Kết Luận Chính",

    // Conclusions
    conclusion1:
      "Sự tự tin trong việc tạo nội dung ảnh/video đã tăng đáng kể sau khóa đào tạo.",
    conclusion2:
      "Tỷ lệ sử dụng công cụ Canva đã tăng từ 6.2% lên 70.7% (ví dụ, số liệu này cần có trong JSON).",
    conclusion3:
      "Khả năng tạo video quảng bá du lịch đã cải thiện rõ rệt, với 91.4% người tham gia có thể tạo video sau khóa học.",
    conclusion4:
      "Hầu hết học viên (91.4%) có thể áp dụng các kỹ năng mới học vào công việc quảng bá du lịch.",
    conclusion5:
      "Khóa đào tạo được đánh giá là rất hiệu quả với 53.4% người tham gia nhận thấy khóa học giúp nâng cao nhiều khả năng sử dụng công nghệ số.",

    // Footer
    footerCopyright: "Báo Cáo Đánh Giá Hiệu Quả Khóa Tập Huấn Kỹ Thuật Số Của Viện Khoa Học Và Công Nghệ Ứng Dụng (IAST)",
    footerDescription:
      "Dữ liệu được thu thập từ khảo sát trước và sau khóa đào tạo",

    // Loading and Error
    loading: "Đang tải dữ liệu...",
    errorLoading: "Lỗi tải dữ liệu:",
    noData: "Không có dữ liệu để hiển thị.",

    // Chart Labels
    beforeTrainingLabel: "Trước Đào Tạo",
    afterTrainingLabel: "Sau Đào Tạo",

    // Ba Bể Survey Specific Translations
    surveyInsightsTitle: "Thông Tin Chi Tiết Từ Khảo Sát",
    keyFindings: "Phát Hiện Chính",
    challenges: "Thách Thức",
    opportunities: "Cơ Hội",
    surveyRecommendationsTitle: "Đề Xuất Từ Khảo Sát",
    shortTermRec: "Đề Xuất Ngắn Hạn",
    longTermRec: "Đề Xuất Dài Hạn",
    priorityRec: "Đề Xuất Ưu Tiên",
    analysisDate: "Ngày Phân Tích",
    totalSurveyResponsesTitle: "Số phản hồi",
    totalSurveyResponses: "Tổng Số Phản Hồi Khảo Sát",
  },
};
// --- END: Language Translations ---
type Language = "en" | "vi";
// --- END: Type Definitions ---

// Data formatting functions
const formatBarChartData = (chartData?: RawChartData): ChartPoint[] => {
  if (!chartData || !chartData.labels || !chartData.data) return [];
  return chartData.labels.map((label: string, index: number) => ({
    name: label,
    value: chartData.data[index],
  }));
};

const formatComparisonData = (
  comparisonData?: ComparisonData,
  language: Language = "vi"
): FormattedComparisonPoint[] => {
  if (!comparisonData || !comparisonData.labels || !comparisonData.datasets)
    return [];
  const t = translations[language];

  return comparisonData.labels.map((label: string, index: number) => {
    const obj: FormattedComparisonPoint = { name: label };
    comparisonData.datasets.forEach((dataset: ComparisonDataset) => {
      const translatedLabel =
        dataset.label === "Trước Đào Tạo"
          ? t.beforeTrainingLabel
          : dataset.label === "Sau Đào Tạo"
          ? t.afterTrainingLabel
          : dataset.label;
      obj[translatedLabel] = dataset.data[index];
    });
    return obj;
  });
};

const formatBaBeSurveyData = (
  rawData: BaBeSurveyJson | null
): FormattedBaBeQuestion[] => {
  if (!rawData || !rawData.questions) return [];

  return Object.entries(rawData.questions)
    .map(([id, questionData]) => {
      if (
        !questionData.breakdown ||
        Object.keys(questionData.breakdown).length === 0
      ) {
        return {
          id,
          question_text: questionData.title,
          totalResponsesForQuestion: questionData.totalResponses,
          chartData: { labels: [], data: [] },
        };
      }

      const labels = Object.keys(questionData.breakdown);
      const data = Object.values(questionData.breakdown);

      return {
        id,
        question_text: questionData.title,
        totalResponsesForQuestion: questionData.totalResponses,
        chartData: { labels, data },
      };
    })
    .filter(
      (q) => q.chartData.labels.length > 0 || q.totalResponsesForQuestion === 0
    ); // Keep questions even if no breakdown but 0 responses.
};

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#A2D2FF",
  "#FFB6C1",
  "#FFD700",
  "#98FB98",
];

// Language Toggle Component
const LanguageToggle: React.FC<{
  language: Language;
  onToggle: () => void;
}> = ({ language, onToggle }) => (
  <button
    onClick={onToggle}
    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-md transition-colors duration-200"
  >
    <span className="text-sm font-medium">
      {language === "vi" ? "🇻🇳 VI" : "🇺🇸 EN"}
    </span>
    <span className="text-xs opacity-75">
      {language === "vi" ? "→ EN" : "→ VI"}
    </span>
  </button>
);

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, bgColor }) => (
  <div className={`p-4 rounded-lg shadow-md ${bgColor}`}>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [baBeSurveyRawData, setBaBeSurveyRawData] =
    useState<BaBeSurveyJson | null>(null);
  const [formattedBaBeQuestions, setFormattedBaBeQuestions] = useState<
    FormattedBaBeQuestion[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("vi");

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "vi" ? "en" : "vi"));
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);

      let trainingDataLoaded = false;
      let baBeDataLoaded = false;

      // Load training/tourism survey data
      const trainingFileNames = [
        language === "vi"
          ? "/dashboard_data_tourism_survey_vietnamese.json"
          : "/dashboard_data_tourism_survey_english.json",
        "/dashboard_data.json",
      ];

      for (const fileName of trainingFileNames) {
        try {
          const response = await fetch(fileName);
          if (response.ok) {
            const data = (await response.json()) as DashboardData;
            setDashboardData(data);
            trainingDataLoaded = true;
            break;
          }
        } catch (err) {
          console.warn(`Failed to load ${fileName}:`, err);
        }
      }

      // Load Ba Bể survey data based on language
      const baBeFileName =
        language === "vi"
          ? "/phan-tich-khao-sat-ba-be.json"
          : "/phan-tich-khao-sat-ba-be-English.json";

      try {
        const response = await fetch(baBeFileName);
        if (response.ok) {
          const data = (await response.json()) as BaBeSurveyJson;
          setBaBeSurveyRawData(data);
          const formatted = formatBaBeSurveyData(data);
          setFormattedBaBeQuestions(formatted);
          baBeDataLoaded = true;
          console.log(`Successfully loaded Ba Bể data: ${baBeFileName}`);
        } else {
          console.warn(
            `Failed to load ${baBeFileName} - Response status: ${response.status}`
          );
        }
      } catch (err) {
        console.warn(`Error fetching ${baBeFileName}:`, err);

        // Fallback: try the other language file if the preferred one fails
        const fallbackFileName =
          language === "vi"
            ? "/phan-tich-khao-sat-ba-be-English.json"
            : "/phan-tich-khao-sat-ba-be.json";

        try {
          console.log(`Attempting fallback to: ${fallbackFileName}`);
          const fallbackResponse = await fetch(fallbackFileName);
          if (fallbackResponse.ok) {
            const data = (await fallbackResponse.json()) as BaBeSurveyJson;
            setBaBeSurveyRawData(data);
            const formatted = formatBaBeSurveyData(data);
            setFormattedBaBeQuestions(formatted);
            baBeDataLoaded = true;
            console.log(
              `Successfully loaded fallback Ba Bể data: ${fallbackFileName}`
            );
          }
        } catch (fallbackErr) {
          console.warn(
            `Fallback also failed for ${fallbackFileName}:`,
            fallbackErr
          );
        }
      }

      // Set initial state and handle errors
      if (trainingDataLoaded || baBeDataLoaded) {
        setSelectedQuestion(0);
      } else {
        setError(
          "Unable to load any data files. Please check if JSON files exist in the public folder."
        );
      }

      setLoading(false);
    };

    loadAllData();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t.loading}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {t.errorLoading} {error}
      </div>
    );
  }

  if (!dashboardData && !baBeSurveyRawData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t.noData}
      </div>
    );
  }

  const totalRespondentsBefore =
    dashboardData?.truocDaoTao?.[0]?.bar_chart?.data?.reduce(
      (a: number, b: number) => a + b,
      0
    ) || 0;

  const technologyAdoptionData =
    dashboardData?.truocDaoTao?.[6]?.bar_chart?.data;
  const technologyAdoptionBefore = technologyAdoptionData
    ? (technologyAdoptionData[0] || 0) + (technologyAdoptionData[1] || 0)
    : 0;
  const technologyAdoptionPercentBefore =
    totalRespondentsBefore > 0
      ? ((technologyAdoptionBefore / totalRespondentsBefore) * 100).toFixed(1)
      : "0.0";

  const confidenceBeforeData = dashboardData?.truocDaoTao?.[3]?.bar_chart?.data;
  const confidenceInCreatingContentBefore = confidenceBeforeData
    ? (confidenceBeforeData[0] || 0) + (confidenceBeforeData[1] || 0)
    : 0;

  const totalRespondentsAfter =
    dashboardData?.sauDaoTao?.[0]?.bar_chart?.data?.reduce(
      (a: number, b: number) => a + b,
      0
    ) || 0;
  const confidenceAfterData = dashboardData?.sauDaoTao?.[0]?.bar_chart?.data;
  const confidenceInCreatingContentAfter = confidenceAfterData
    ? (confidenceAfterData[0] || 0) + (confidenceAfterData[1] || 0)
    : 0;

  const confidencePercentBefore =
    totalRespondentsBefore > 0
      ? (
          (confidenceInCreatingContentBefore / totalRespondentsBefore) *
          100
        ).toFixed(1)
      : "0.0";
  const confidencePercentAfter =
    totalRespondentsAfter > 0
      ? (
          (confidenceInCreatingContentAfter / totalRespondentsAfter) *
          100
        ).toFixed(1)
      : "0.0";

  const improvementPercent = (
    parseFloat(confidencePercentAfter) - parseFloat(confidencePercentBefore)
  ).toFixed(1);

  const currentBaBeSurveyQuestion = formattedBaBeQuestions[selectedQuestion];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        language === "vi" ? "vi-VN" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch (e) {
      return dateString; // fallback to original string if date is invalid
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-4">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-6 w-auto sm:h-8 md:h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold truncate">
              {t.headerTitle}
            </h1>
            <p className="text-blue-100 text-sm md:text-base truncate">
              {t.headerSubtitle}
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex-shrink-0">
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          </div>
        </div>
      </header>

      <div className="container mx-auto mt-6 px-4">
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "overview"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("overview");
              setSelectedQuestion(0);
            }}
          >
            {t.overview}
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "before"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("before");
              setSelectedQuestion(0);
            }}
          >
            {t.beforeTraining}
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "after"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("after");
              setSelectedQuestion(0);
            }}
          >
            {t.afterTraining}
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "comparison"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("comparison");
              setSelectedQuestion(0);
            }}
          >
            {t.comparison}
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "baBeSurvey"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("baBeSurvey");
              setSelectedQuestion(0);
            }}
          >
            {t.baBeSurvey}
          </button>
        </div>

        <div className="mb-12">
          {activeTab === "overview" && dashboardData && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                  title={t.totalParticipants}
                  value={totalRespondentsBefore}
                  bgColor="bg-blue-50"
                />
                <StatCard
                  title={t.technologyReadinessBefore}
                  value={`${technologyAdoptionPercentBefore}%`}
                  bgColor="bg-green-50"
                />
                <StatCard
                  title={t.skillImprovementRate}
                  value={`${
                    parseFloat(improvementPercent) >= 0 ? "+" : ""
                  }${improvementPercent}%`}
                  bgColor="bg-yellow-50"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t.overviewTitle}
              </h2>

              {dashboardData.soSanh && dashboardData.soSanh[0] && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {t.confidenceChangeTitle}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={formatComparisonData(
                        dashboardData.soSanh[0],
                        language
                      )}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={t.beforeTrainingLabel} fill="#8884d8" />
                      <Bar dataKey={t.afterTrainingLabel} fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {dashboardData.soSanh && dashboardData.soSanh[1] && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {t.toolUsageChangeTitle}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={formatComparisonData(
                        dashboardData.soSanh[1],
                        language
                      )}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={t.beforeTrainingLabel} fill="#8884d8" />
                      <Bar dataKey={t.afterTrainingLabel} fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dashboardData.sauDaoTao &&
                  dashboardData.sauDaoTao[9]?.pie_chart && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-4">
                        {t.overallEffectivenessTitle}
                      </h3>
                      <div className="font-medium text-gray-700 mb-2">
                        {t.effectivenessQuestion}
                      </div>
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={formatBarChartData(
                              dashboardData.sauDaoTao[9].pie_chart
                            )}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            labelLine={false}
                            label={({
                              name,
                              percent,
                            }: {
                              name: string;
                              percent: number;
                            }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          >
                            {formatBarChartData(
                              dashboardData.sauDaoTao[9].pie_chart
                            ).map((_entry: ChartPoint, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                {dashboardData.sauDaoTao &&
                  dashboardData.sauDaoTao[6]?.pie_chart && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-4">
                        {t.skillApplicationTitle}
                      </h3>
                      <div className="font-medium text-gray-700 mb-2">
                        {t.applicationQuestion}
                      </div>
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={formatBarChartData(
                              dashboardData.sauDaoTao[6].pie_chart
                            )}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            labelLine={false}
                            label={({
                              name,
                              percent,
                            }: {
                              name: string;
                              percent: number;
                            }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          >
                            {formatBarChartData(
                              dashboardData.sauDaoTao[6].pie_chart
                            ).map((_entry: ChartPoint, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
              </div>
            </div>
          )}
          {activeTab === "overview" && !dashboardData && (
            <div className="text-center py-10">
              {t.noData} {t.overview}
            </div>
          )}

          {activeTab === "before" &&
            dashboardData &&
            dashboardData.truocDaoTao[selectedQuestion] && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {t.beforeTrainingTitle}
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="select-before"
                    className="block text-gray-700 mb-2"
                  >
                    {t.selectQuestion}
                  </label>
                  <select
                    id="select-before"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedQuestion}
                    onChange={(e) =>
                      setSelectedQuestion(parseInt(e.target.value))
                    }
                  >
                    {dashboardData.truocDaoTao.map(
                      (q: QuestionSurveyData, index: number) => (
                        <option key={index} value={index}>
                          {q.question_text}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {dashboardData.truocDaoTao[selectedQuestion].question_text}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium mb-2">{t.barChart}</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={formatBarChartData(
                            dashboardData.truocDaoTao[selectedQuestion]
                              .bar_chart
                          )}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-2">{t.pieChart}</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={formatBarChartData(
                              dashboardData.truocDaoTao[selectedQuestion]
                                .pie_chart
                            )}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            labelLine={false}
                            label={({
                              name,
                              percent,
                            }: {
                              name: string;
                              percent: number;
                            }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          >
                            {formatBarChartData(
                              dashboardData.truocDaoTao[selectedQuestion]
                                .pie_chart
                            ).map((_entry: ChartPoint, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {activeTab === "before" &&
            (!dashboardData ||
              !dashboardData.truocDaoTao[selectedQuestion]) && (
              <div className="text-center py-10">
                {t.noData} {t.beforeTraining}
              </div>
            )}

          {activeTab === "after" &&
            dashboardData &&
            dashboardData.sauDaoTao[selectedQuestion] && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {t.afterTrainingTitle}
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="select-after"
                    className="block text-gray-700 mb-2"
                  >
                    {t.selectQuestion}
                  </label>
                  <select
                    id="select-after"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedQuestion}
                    onChange={(e) =>
                      setSelectedQuestion(parseInt(e.target.value))
                    }
                  >
                    {dashboardData.sauDaoTao.map(
                      (q: QuestionSurveyData, index: number) => (
                        <option key={index} value={index}>
                          {q.question_text}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {dashboardData.sauDaoTao[selectedQuestion].question_text}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium mb-2">{t.barChart}</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={formatBarChartData(
                            dashboardData.sauDaoTao[selectedQuestion].bar_chart
                          )}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-2">{t.pieChart}</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={formatBarChartData(
                              dashboardData.sauDaoTao[selectedQuestion]
                                .pie_chart
                            )}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            labelLine={false}
                            label={({
                              name,
                              percent,
                            }: {
                              name: string;
                              percent: number;
                            }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          >
                            {formatBarChartData(
                              dashboardData.sauDaoTao[selectedQuestion]
                                .pie_chart
                            ).map((_entry: ChartPoint, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {activeTab === "after" &&
            (!dashboardData || !dashboardData.sauDaoTao[selectedQuestion]) && (
              <div className="text-center py-10">
                {t.noData} {t.afterTraining}
              </div>
            )}

          {activeTab === "comparison" &&
            dashboardData &&
            dashboardData.soSanh[selectedQuestion] && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {t.comparisonTitle}
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="select-comparison"
                    className="block text-gray-700 mb-2"
                  >
                    {t.selectComparison}
                  </label>
                  <select
                    id="select-comparison"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedQuestion}
                    onChange={(e) =>
                      setSelectedQuestion(parseInt(e.target.value))
                    }
                  >
                    {dashboardData.soSanh.map(
                      (q: ComparisonData, index: number) => (
                        <option key={index} value={index}>
                          {q.title}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {dashboardData.soSanh[selectedQuestion].title}
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={formatComparisonData(
                        dashboardData.soSanh[selectedQuestion],
                        language
                      )}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={t.beforeTrainingLabel} fill="#8884d8" />
                      <Bar dataKey={t.afterTrainingLabel} fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">
                    {t.mainConclusions}
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>{t.conclusion1}</li>
                    <li>{t.conclusion2}</li>
                    <li>{t.conclusion3}</li>
                    <li>{t.conclusion4}</li>
                    <li>{t.conclusion5}</li>
                  </ul>
                </div>
              </div>
            )}
          {activeTab === "comparison" &&
            (!dashboardData || !dashboardData.soSanh[selectedQuestion]) && (
              <div className="text-center py-10">
                {t.noData} {t.comparison}
              </div>
            )}

          {/* Ba Bể Survey Tab - Improved Responsive Version */}
          {activeTab === "baBeSurvey" && baBeSurveyRawData && (
            <div className="space-y-6 lg:space-y-8">
              {/* Overview Card */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  {baBeSurveyRawData.overview?.surveyTitle || t.baBeSurveyTitle}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                  {baBeSurveyRawData.overview?.totalResponses !== undefined && (
                    <div className="flex items-center gap-1">
                      <span>{t.totalSurveyResponses}:</span>
                      <strong className="text-blue-600">
                        {baBeSurveyRawData.overview.totalResponses}
                      </strong>
                    </div>
                  )}
                  {baBeSurveyRawData.overview?.analysisDate && (
                    <div className="flex items-center gap-1">
                      <span>{t.analysisDate}:</span>
                      <strong className="text-gray-700">
                        {formatDate(baBeSurveyRawData.overview.analysisDate)}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Question and Chart Card */}
              {formattedBaBeQuestions.length > 0 &&
              currentBaBeSurveyQuestion ? (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                  {/* Question Selector */}
                  <div className="mb-6">
                    <label
                      htmlFor="select-ba-be-survey"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t.selectQuestion}
                    </label>
                    <select
                      id="select-ba-be-survey"
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={selectedQuestion}
                      onChange={(e) =>
                        setSelectedQuestion(parseInt(e.target.value))
                      }
                    >
                      {formattedBaBeQuestions.map(
                        (q: FormattedBaBeQuestion, index: number) => (
                          <option key={q.id} value={index}>
                            {q.question_text}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Question Content */}
                  {currentBaBeSurveyQuestion.chartData.labels.length > 0 ? (
                    <div className="space-y-6">
                      {/* Question Header */}
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                          {currentBaBeSurveyQuestion.question_text}
                        </h3>
                        {currentBaBeSurveyQuestion?.totalResponsesForQuestion >
                          0 && (
                          <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block">
                            {t.totalSurveyResponsesTitle}:{" "}
                            {
                              currentBaBeSurveyQuestion.totalResponsesForQuestion
                            }
                          </p>
                        )}
                      </div>

                      {/* Charts Grid */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                        {/* Bar Chart */}
                        <div className="space-y-3">
                          <h4 className="text-base font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-400 rounded"></span>
                            {t.barChart}
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <ResponsiveContainer width="100%" height={320}>
                              <BarChart
                                data={formatBarChartData(
                                  currentBaBeSurveyQuestion.chartData
                                )}
                                margin={{
                                  top: 10,
                                  right: 15,
                                  left: 0,
                                  bottom: 80,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#e5e7eb"
                                />
                                <XAxis
                                  dataKey="name"
                                  interval={0}
                                  angle={-40}
                                  textAnchor="end"
                                  height={90}
                                  tick={{ fontSize: 11, fill: "#6b7280" }}
                                />
                                <YAxis
                                  tick={{ fontSize: 11, fill: "#6b7280" }}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow:
                                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                  }}
                                />
                                <Bar
                                  dataKey="value"
                                  fill="#60a5fa"
                                  radius={[4, 4, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="space-y-3">
                          <h4 className="text-base font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                            {t.pieChart}
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <ResponsiveContainer width="100%" height={380}>
                              <PieChart>
                                <Pie
                                  data={formatBarChartData(
                                    currentBaBeSurveyQuestion.chartData
                                  )}
                                  cx="50%"
                                  cy="40%"
                                  outerRadius={85}
                                  fill="#8884d8"
                                  dataKey="value"
                                  labelLine={false}
                                  label={({
                                    name,
                                    percent,
                                    value,
                                  }: {
                                    name: string;
                                    percent: number;
                                    value: number;
                                  }) =>
                                    `${name}: ${value} (${(
                                      percent * 100
                                    ).toFixed(0)}%)`
                                  }
                                >
                                  {formatBarChartData(
                                    currentBaBeSurveyQuestion.chartData
                                  ).map((_entry: ChartPoint, index: number) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  formatter={(value, _name, props) => [
                                    `${props.payload.name}: ${value} (${(
                                      props.payload.percent * 100
                                    ).toFixed(1)}%)`,
                                    null,
                                  ]}
                                  contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow:
                                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                  }}
                                />
                                <Legend
                                  verticalAlign="bottom"
                                  height={50}
                                  wrapperStyle={{
                                    fontSize: "11px",
                                    paddingTop: "15px",
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-50 rounded-lg p-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          {currentBaBeSurveyQuestion.question_text}
                        </h3>
                        {currentBaBeSurveyQuestion?.totalResponsesForQuestion !==
                          undefined && (
                          <p className="text-sm text-gray-500 mb-4">
                            Số phản hồi cho câu hỏi này:{" "}
                            {
                              currentBaBeSurveyQuestion.totalResponsesForQuestion
                            }
                          </p>
                        )}
                        <p className="text-gray-500">{t.noData}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-gray-500">{t.noData}</div>
                </div>
              )}

              {/* Insights and Recommendations Grid */}
              {(baBeSurveyRawData.insights ||
                baBeSurveyRawData.recommendations) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Key Findings */}
                  {baBeSurveyRawData.insights?.keyFindings &&
                    baBeSurveyRawData.insights.keyFindings.length > 0 && (
                      <div className="p-6 rounded-lg shadow-sm bg-sky-50 border border-sky-100">
                        <h4 className="text-lg font-semibold text-sky-700 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                          {t.keyFindings}
                        </h4>
                        <ul className="space-y-2">
                          {baBeSurveyRawData.insights.keyFindings.map(
                            (item, index) => (
                              <li
                                key={`kf-${index}`}
                                className="flex items-start gap-3 text-sky-700 text-sm"
                              >
                                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Challenges */}
                  {baBeSurveyRawData.insights?.challenges &&
                    baBeSurveyRawData.insights.challenges.length > 0 && (
                      <div className="p-6 rounded-lg shadow-sm bg-red-50 border border-red-100">
                        <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          {t.challenges}
                        </h4>
                        <ul className="space-y-2">
                          {baBeSurveyRawData.insights.challenges.map(
                            (item, index) => (
                              <li
                                key={`ch-${index}`}
                                className="flex items-start gap-3 text-red-700 text-sm"
                              >
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Opportunities */}
                  {baBeSurveyRawData.insights?.opportunities &&
                    baBeSurveyRawData.insights.opportunities.length > 0 && (
                      <div className="p-6 rounded-lg shadow-sm bg-emerald-50 border border-emerald-100">
                        <h4 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          {t.opportunities}
                        </h4>
                        <ul className="space-y-2">
                          {baBeSurveyRawData.insights.opportunities.map(
                            (item, index) => (
                              <li
                                key={`op-${index}`}
                                className="flex items-start gap-3 text-emerald-700 text-sm"
                              >
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Short Term Recommendations */}
                  {baBeSurveyRawData.recommendations?.shortTerm &&
                    baBeSurveyRawData.recommendations.shortTerm.length > 0 && (
                      <div className="p-6 rounded-lg shadow-sm bg-green-50 border border-green-100">
                        <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {t.shortTermRec}
                        </h4>
                        <ul className="space-y-2">
                          {baBeSurveyRawData.recommendations.shortTerm.map(
                            (item, index) => (
                              <li
                                key={`st-${index}`}
                                className="flex items-start gap-3 text-green-700 text-sm"
                              >
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Long Term Recommendations */}
                  {baBeSurveyRawData.recommendations?.longTerm &&
                    baBeSurveyRawData.recommendations.longTerm.length > 0 && (
                      <div className="p-6 rounded-lg shadow-sm bg-purple-50 border border-purple-100">
                        <h4 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          {t.longTermRec}
                        </h4>
                        <ul className="space-y-2">
                          {baBeSurveyRawData.recommendations.longTerm.map(
                            (item, index) => (
                              <li
                                key={`lt-${index}`}
                                className="flex items-start gap-3 text-purple-700 text-sm"
                              >
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Priority Recommendations - Full Width */}
                  {baBeSurveyRawData.recommendations?.priority &&
                    baBeSurveyRawData.recommendations.priority.length > 0 && (
                      <div className="p-6 rounded-lg shadow-sm bg-purple-50 border border-purple-100">
                        <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          {t.priorityRec}
                        </h4>
                        <ol className="flex flex-col md: gap-3">
                          {baBeSurveyRawData.recommendations.priority.map(
                            (item, index) => (
                              <li
                                key={`pr-${index}`}
                                className="flex items-start gap-3 text-amber-700 text-sm"
                              >
                                <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {/* No Data State */}
          {activeTab === "baBeSurvey" && !baBeSurveyRawData && (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-500">
                {t.noData} {t.baBeSurvey}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-100 border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>
            © {new Date().getFullYear()} {t.footerCopyright}
          </p>
          <p className="text-sm mt-2">{t.footerDescription}</p>
        </div>
      </footer>
    </div>
  );
}
