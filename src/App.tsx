// src/App.tsx
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

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
    
    // Before/After Training
    beforeTrainingTitle: "Pre-Training Data",
    afterTrainingTitle: "Post-Training Data",
    selectQuestion: "Select question:",
    barChart: "Bar Chart",
    pieChart: "Pie Chart (%)",
    
    // Comparison
    comparisonTitle: "Before and After Training Comparison",
    selectComparison: "Select comparison:",
    mainConclusions: "Main Conclusions",
    
    // Conclusions
    conclusion1: "Confidence in creating image/video content has increased significantly after the training course.",
    conclusion2: "Canva tool usage rate has increased from 6.2% to 70.7% (example, this data should be in JSON).",
    conclusion3: "Ability to create tourism promotional videos has improved significantly, with 91.4% of participants able to create videos after the course.",
    conclusion4: "Most students (91.4%) can apply newly learned skills to tourism promotion work.",
    conclusion5: "The training course is evaluated as very effective with 53.4% of participants finding the course helps significantly improve digital technology usage capabilities.",
    
    // Footer
    footerCopyright: "Digital Skills Training Effectiveness Assessment Report",
    footerDescription: "Data collected from pre and post-training surveys",
    
    // Loading and Error
    loading: "Loading data...",
    errorLoading: "Error loading data:",
    noData: "No data to display.",
    
    // Chart Labels
    beforeTrainingLabel: "Before Training",
    afterTrainingLabel: "After Training"
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
    
    // Before/After Training
    beforeTrainingTitle: "Dữ Liệu Trước Đào Tạo",
    afterTrainingTitle: "Dữ Liệu Sau Đào Tạo",
    selectQuestion: "Chọn câu hỏi:",
    barChart: "Biểu Đồ Cột",
    pieChart: "Biểu Đồ Tròn (%)",
    
    // Comparison
    comparisonTitle: "So Sánh Trước và Sau Đào Tạo",
    selectComparison: "Chọn so sánh:",
    mainConclusions: "Kết Luận Chính",
    
    // Conclusions
    conclusion1: "Sự tự tin trong việc tạo nội dung ảnh/video đã tăng đáng kể sau khóa đào tạo.",
    conclusion2: "Tỷ lệ sử dụng công cụ Canva đã tăng từ 6.2% lên 70.7% (ví dụ, số liệu này cần có trong JSON).",
    conclusion3: "Khả năng tạo video quảng bá du lịch đã cải thiện rõ rệt, với 91.4% người tham gia có thể tạo video sau khóa học.",
    conclusion4: "Hầu hết học viên (91.4%) có thể áp dụng các kỹ năng mới học vào công việc quảng bá du lịch.",
    conclusion5: "Khóa đào tạo được đánh giá là rất hiệu quả với 53.4% người tham gia nhận thấy khóa học giúp nâng cao nhiều khả năng sử dụng công nghệ số.",
    
    // Footer
    footerCopyright: "Báo Cáo Đánh Giá Hiệu Quả Khóa Tập Huấn Kỹ Thuật Số",
    footerDescription: "Dữ liệu được thu thập từ khảo sát trước và sau khóa đào tạo",
    
    // Loading and Error
    loading: "Đang tải dữ liệu...",
    errorLoading: "Lỗi tải dữ liệu:",
    noData: "Không có dữ liệu để hiển thị.",
    
    // Chart Labels
    beforeTrainingLabel: "Trước Đào Tạo",
    afterTrainingLabel: "Sau Đào Tạo"
  }
};
// --- END: Language Translations ---

// --- START: Type Definitions ---
interface ChartPoint {
  name: string;
  value: number;
}

interface RawChartData {
  labels: string[];
  data: number[];
}

interface QuestionSurveyData {
  question_text: string;
  bar_chart: RawChartData;
  pie_chart: RawChartData;
}

interface ComparisonDataset {
  label: string;
  data: number[];
}

interface ComparisonData {
  title: string;
  labels: string[];
  datasets: ComparisonDataset[];
}

interface FormattedComparisonPoint {
  name: string;
  [key: string]: string | number;
}

interface DashboardData {
  truocDaoTao: QuestionSurveyData[];
  sauDaoTao: QuestionSurveyData[];
  soSanh: ComparisonData[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  bgColor: string;
}

type Language = 'en' | 'vi';
// --- END: Type Definitions ---

// Data formatting functions
const formatBarChartData = (chartData?: RawChartData): ChartPoint[] => {
  if (!chartData || !chartData.labels || !chartData.data) return [];
  return chartData.labels.map((label: string, index: number) => ({
    name: label,
    value: chartData.data[index],
  }));
};

const formatComparisonData = (comparisonData?: ComparisonData, language: Language = 'vi'): FormattedComparisonPoint[] => {
  if (!comparisonData || !comparisonData.labels || !comparisonData.datasets) return [];
  const t = translations[language];
  
  return comparisonData.labels.map((label: string, index: number) => {
    const obj: FormattedComparisonPoint = { name: label };
    comparisonData.datasets.forEach((dataset: ComparisonDataset) => {
      // Translate dataset labels
      const translatedLabel = dataset.label === 'Trước Đào Tạo' ? t.beforeTrainingLabel : 
                             dataset.label === 'Sau Đào Tạo' ? t.afterTrainingLabel : 
                             dataset.label;
      obj[translatedLabel] = dataset.data[index];
    });
    return obj;
  });
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Language Toggle Component
const LanguageToggle: React.FC<{ language: Language; onToggle: () => void }> = ({ language, onToggle }) => (
  <button
    onClick={onToggle}
    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-md transition-colors duration-200"
  >
    <span className="text-sm font-medium">
      {language === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN'}
    </span>
    <span className="text-xs opacity-75">
      {language === 'vi' ? '→ EN' : '→ VI'}
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
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('vi');

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
  };

  // Alternative: Load data once and translate content
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Try to load language-specific file first, then fallback to default
    const tryLoadFile = async () => {
      const fileNames = [
        language === 'vi' 
          ? '/dashboard_data_tourism_survey_vietnamese.json'
          : '/dashboard_data_tourism_survey_english.json',
        '/dashboard_data.json' // fallback
      ];

      for (const fileName of fileNames) {
        try {
          console.log(`Trying to load: ${fileName}`);
          const response = await fetch(fileName);
          if (response.ok) {
            const data = await response.json() as DashboardData;
            console.log(`Successfully loaded: ${fileName}`);
            setDashboardData(data);
            setLoading(false);
            setSelectedQuestion(0);
            return;
          }
        } catch (err) {
          console.warn(`Failed to load ${fileName}:`, err);
          continue;
        }
      }
      
      // If all files failed
      throw new Error("All data files failed to load");
    };

    tryLoadFile().catch(err => {
      console.error("All attempts to load data failed:", err);
      setError("Unable to load data files. Please check if the JSON files exist.");
      setLoading(false);
    });
  }, [language]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t.loading}</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{t.errorLoading} {error}</div>;
  }

  if (!dashboardData) {
    return <div className="min-h-screen flex items-center justify-center">{t.noData}</div>;
  }

  // Calculations
  const totalRespondentsBefore = dashboardData.truocDaoTao?.[0]?.bar_chart?.data?.reduce((a: number, b: number) => a + b, 0) || 0;
  const totalRespondentsAfter = dashboardData.sauDaoTao?.[0]?.bar_chart?.data?.reduce((a: number, b: number) => a + b, 0) || 0;

  const technologyAdoptionData = dashboardData.truocDaoTao?.[6]?.bar_chart?.data;
  const technologyAdoptionBefore = technologyAdoptionData ? (technologyAdoptionData[0] || 0) + (technologyAdoptionData[1] || 0) : 0;
  const technologyAdoptionPercentBefore = totalRespondentsBefore > 0 ? ((technologyAdoptionBefore / totalRespondentsBefore) * 100).toFixed(1) : "0.0";

  const confidenceBeforeData = dashboardData.truocDaoTao?.[3]?.bar_chart?.data;
  const confidenceInCreatingContentBefore = confidenceBeforeData ? (confidenceBeforeData[0] || 0) + (confidenceBeforeData[1] || 0) : 0;

  const confidenceAfterData = dashboardData.sauDaoTao?.[0]?.bar_chart?.data;
  const confidenceInCreatingContentAfter = confidenceAfterData ? (confidenceAfterData[0] || 0) + (confidenceAfterData[1] || 0) : 0;

  const confidencePercentBefore = totalRespondentsBefore > 0 ? ((confidenceInCreatingContentBefore / totalRespondentsBefore) * 100).toFixed(1) : "0.0";
  const confidencePercentAfter = totalRespondentsAfter > 0 ? ((confidenceInCreatingContentAfter / totalRespondentsAfter) * 100).toFixed(1) : "0.0";

  const improvementPercent = (parseFloat(confidencePercentAfter) - parseFloat(confidencePercentBefore)).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{t.headerTitle}</h1>
            <p className="text-blue-100">{t.headerSubtitle}</p>
          </div>
          <div className="ml-4">
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto mt-6 px-4">
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('overview'); setSelectedQuestion(0);}}
          >
            {t.overview}
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'before' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('before'); setSelectedQuestion(0);}}
          >
            {t.beforeTraining}
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'after' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('after'); setSelectedQuestion(0);}}
          >
            {t.afterTraining}
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'comparison' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('comparison'); setSelectedQuestion(0);}}
          >
            {t.comparison}
          </button>
        </div>

        {/* Content Area */}
        <div className="mb-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
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
                  value={`${parseFloat(improvementPercent) >= 0 ? '+' : ''}${improvementPercent}%`}
                  bgColor="bg-yellow-50"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.overviewTitle}</h2>
              
              {dashboardData.soSanh && dashboardData.soSanh[0] && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">{t.confidenceChangeTitle}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={formatComparisonData(dashboardData.soSanh[0], language)}
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
                  <h3 className="text-lg font-semibold mb-4">{t.toolUsageChangeTitle}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={formatComparisonData(dashboardData.soSanh[1], language)}
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
                {dashboardData.sauDaoTao && dashboardData.sauDaoTao[9]?.pie_chart && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">{t.overallEffectivenessTitle}</h3>
                    <div className="font-medium text-gray-700 mb-2">{t.effectivenessQuestion}</div>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={formatBarChartData(dashboardData.sauDaoTao[9].pie_chart)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}: {name: string; percent: number}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {formatBarChartData(dashboardData.sauDaoTao[9].pie_chart).map((_entry: ChartPoint, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {dashboardData.sauDaoTao && dashboardData.sauDaoTao[6]?.pie_chart && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">{t.skillApplicationTitle}</h3>
                    <div className="font-medium text-gray-700 mb-2">{t.applicationQuestion}</div>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={formatBarChartData(dashboardData.sauDaoTao[6].pie_chart)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}: {name: string; percent: number}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {formatBarChartData(dashboardData.sauDaoTao[6].pie_chart).map((_entry: ChartPoint, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Before Training Tab */}
          {activeTab === 'before' && dashboardData.truocDaoTao && dashboardData.truocDaoTao[selectedQuestion] && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.beforeTrainingTitle}</h2>
              
              <div className="mb-4">
                <label htmlFor="select-before" className="block text-gray-700 mb-2">{t.selectQuestion}</label>
                <select
                  id="select-before"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(parseInt(e.target.value))}
                >
                  {dashboardData.truocDaoTao.map((q: QuestionSurveyData, index: number) => (
                    <option key={index} value={index}>
                      {q.question_text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">{dashboardData.truocDaoTao[selectedQuestion].question_text}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium mb-2">{t.barChart}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={formatBarChartData(dashboardData.truocDaoTao[selectedQuestion].bar_chart)}
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
                          data={formatBarChartData(dashboardData.truocDaoTao[selectedQuestion].pie_chart)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}: {name: string; percent: number}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {formatBarChartData(dashboardData.truocDaoTao[selectedQuestion].pie_chart).map((_entry: ChartPoint, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* After Training Tab */}
          {activeTab === 'after' && dashboardData.sauDaoTao && dashboardData.sauDaoTao[selectedQuestion] && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.afterTrainingTitle}</h2>
              
              <div className="mb-4">
                <label htmlFor="select-after" className="block text-gray-700 mb-2">{t.selectQuestion}</label>
                <select
                  id="select-after"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(parseInt(e.target.value))}
                >
                  {dashboardData.sauDaoTao.map((q: QuestionSurveyData, index: number) => (
                    <option key={index} value={index}>
                      {q.question_text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">{dashboardData.sauDaoTao[selectedQuestion].question_text}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium mb-2">{t.barChart}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={formatBarChartData(dashboardData.sauDaoTao[selectedQuestion].bar_chart)}
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
                          data={formatBarChartData(dashboardData.sauDaoTao[selectedQuestion].pie_chart)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}: {name: string; percent: number}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {formatBarChartData(dashboardData.sauDaoTao[selectedQuestion].pie_chart).map((_entry: ChartPoint, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Tab */}
          {activeTab === 'comparison' && dashboardData.soSanh && dashboardData.soSanh[selectedQuestion] && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.comparisonTitle}</h2>
              
              <div className="mb-4">
                <label htmlFor="select-comparison" className="block text-gray-700 mb-2">{t.selectComparison}</label>
                <select
                  id="select-comparison"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(parseInt(e.target.value))}
                >
                  {dashboardData.soSanh.map((q: ComparisonData, index: number) => (
                    <option key={index} value={index}>
                      {q.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">{dashboardData.soSanh[selectedQuestion].title}</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={formatComparisonData(dashboardData.soSanh[selectedQuestion], language)}
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
                <h3 className="text-lg font-semibold mb-4">{t.mainConclusions}</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{t.conclusion1}</li>
                  <li>{t.conclusion2}</li>
                  <li>{t.conclusion3}</li>
                  <li>{t.conclusion4}</li>
                  <li>{t.conclusion5}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} {t.footerCopyright}</p>
          <p className="text-sm mt-2">{t.footerDescription}</p>
        </div>
      </footer>
    </div>
  );
}