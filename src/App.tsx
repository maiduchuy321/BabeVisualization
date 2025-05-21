// src/App.tsx
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// --- START: Định nghĩa Kiểu Dữ liệu (hoặc import từ file riêng) ---
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
// --- END: Định nghĩa Kiểu Dữ liệu ---


// Chuyển đổi dữ liệu cho biểu đồ
const formatBarChartData = (chartData?: RawChartData): ChartPoint[] => {
  if (!chartData || !chartData.labels || !chartData.data) return [];
  return chartData.labels.map((label: string, index: number) => ({
    name: label,
    value: chartData.data[index],
  }));
};

// Chuyển đổi dữ liệu cho biểu đồ so sánh
const formatComparisonData = (comparisonData?: ComparisonData): FormattedComparisonPoint[] => {
  if (!comparisonData || !comparisonData.labels || !comparisonData.datasets) return [];
  return comparisonData.labels.map((label: string, index: number) => {
    const obj: FormattedComparisonPoint = { name: label };
    comparisonData.datasets.forEach((dataset: ComparisonDataset) => {
      // Đảm bảo dataset.label là một string hợp lệ để làm key
      obj[dataset.label] = dataset.data[index];
    });
    return obj;
  });
};

// Màu sắc cho biểu đồ
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Component cho hiển thị thống kê tổng quan
const StatCard: React.FC<StatCardProps> = ({ title, value, bgColor }) => (
  <div className={`p-4 rounded-lg shadow-md ${bgColor}`}>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

// Component chính
export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null); // Quan trọng!
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/dashboard_data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<DashboardData>; // Type assertion
      })
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard data:", err);
        setError(err.message || "An unknown error occurred");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Lỗi tải dữ liệu: {error}</div>;
  }

  // Sau các guard clauses ở trên, TypeScript biết dashboardData không còn là null
  if (!dashboardData) {
    return <div className="min-h-screen flex items-center justify-center">Không có dữ liệu để hiển thị.</div>;
  }

  // Các tính toán, sử dụng optional chaining (?.) để an toàn hơn
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
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Đánh Giá Hiệu Quả Khóa Tập Huấn Kỹ Thuật Số</h1>
          <p className="text-blue-100">Báo cáo trực quan về khảo sát trước và sau đào tạo</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto mt-6 px-4">
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('overview'); setSelectedQuestion(0);}}
          >
            Tổng Quan
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'before' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('before'); setSelectedQuestion(0);}}
          >
            Trước Đào Tạo
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'after' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('after'); setSelectedQuestion(0);}}
          >
            Sau Đào Tạo
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'comparison' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('comparison'); setSelectedQuestion(0);}}
          >
            So Sánh
          </button>
        </div>

        {/* Content Area */}
        <div className="mb-12">
          {/* Overview Tab */}
          {/* Các điều kiện dashboardData.soSanh và dashboardData.sauDaoTao đã được đảm bảo bởi guard clause !dashboardData */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                  title="Số Người Tham Gia Khảo Sát"
                  value={totalRespondentsBefore}
                  bgColor="bg-blue-50"
                />
                <StatCard
                  title="Mức Độ Sẵn Sàng Áp Dụng Công Nghệ (Trước)"
                  value={`${technologyAdoptionPercentBefore}%`}
                  bgColor="bg-green-50"
                />
                <StatCard
                  title="Mức Cải Thiện Kỹ Năng Tự Tin"
                  value={`${parseFloat(improvementPercent) >= 0 ? '+' : ''}${improvementPercent}%`}
                  bgColor="bg-yellow-50"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4">Tổng Kết Hiệu Quả Khóa Đào Tạo</h2>
              
              {/* Kiểm tra dashboardData.soSanh[0] có tồn tại */}
              {dashboardData.soSanh && dashboardData.soSanh[0] && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">Sự Thay Đổi về Mức Độ Tự Tin</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={formatComparisonData(dashboardData.soSanh[0])}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Trước Đào Tạo" fill="#8884d8" />
                      <Bar dataKey="Sau Đào Tạo" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {dashboardData.soSanh && dashboardData.soSanh[1] && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">Sự Thay Đổi về Sử Dụng Công Cụ</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={formatComparisonData(dashboardData.soSanh[1])}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Trước Đào Tạo" fill="#8884d8" />
                      <Bar dataKey="Sau Đào Tạo" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dashboardData.sauDaoTao && dashboardData.sauDaoTao[9]?.pie_chart && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Hiệu Quả Tổng Thể Khóa Đào Tạo</h3>
                    <div className="font-medium text-gray-700 mb-2">Đánh giá hiệu quả của khóa học:</div>
                    <ResponsiveContainer width="100%" height={200}>
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
                    <h3 className="text-lg font-semibold mb-4">Áp Dụng Kỹ Năng Sau Đào Tạo</h3>
                    <div className="font-medium text-gray-700 mb-2">Có thể áp dụng các kỹ năng mới học:</div>
                    <ResponsiveContainer width="100%" height={200}>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Dữ Liệu Trước Đào Tạo</h2>
              
              <div className="mb-4">
                <label htmlFor="select-before" className="block text-gray-700 mb-2">Chọn câu hỏi:</label>
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
                    <h4 className="text-md font-medium mb-2">Biểu Đồ Cột</h4>
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
                    <h4 className="text-md font-medium mb-2">Biểu Đồ Tròn (%)</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={formatBarChartData(dashboardData.truocDaoTao[selectedQuestion].pie_chart)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          // Chú ý label của PieChart:
                          // Nếu pie_chart.data của bạn là giá trị phần trăm (0-100), thì:
                          // label={({name, value}: {name: string; value: number}) => `${name}: ${value}%`}
                          // Nếu pie_chart.data của bạn là giá trị số (số lượt vote) và Recharts tự tính %:
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Dữ Liệu Sau Đào Tạo</h2>
              
              <div className="mb-4">
                <label htmlFor="select-after" className="block text-gray-700 mb-2">Chọn câu hỏi:</label>
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
                    <h4 className="text-md font-medium mb-2">Biểu Đồ Cột</h4>
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
                    <h4 className="text-md font-medium mb-2">Biểu Đồ Tròn (%)</h4>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">So Sánh Trước và Sau Đào Tạo</h2>
              
              <div className="mb-4">
                <label htmlFor="select-comparison" className="block text-gray-700 mb-2">Chọn so sánh:</label>
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
                    data={formatComparisonData(dashboardData.soSanh[selectedQuestion])}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Trước Đào Tạo" fill="#8884d8" />
                    <Bar dataKey="Sau Đào Tạo" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Kết Luận Chính</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Sự tự tin trong việc tạo nội dung ảnh/video đã tăng đáng kể sau khóa đào tạo.</li>
                  <li>Tỷ lệ sử dụng công cụ Canva đã tăng từ 6.2% lên 70.7% (ví dụ, số liệu này cần có trong JSON).</li>
                  <li>Khả năng tạo video quảng bá du lịch đã cải thiện rõ rệt, với 91.4% người tham gia có thể tạo video sau khóa học.</li>
                  <li>Hầu hết học viên (91.4%) có thể áp dụng các kỹ năng mới học vào công việc quảng bá du lịch.</li>
                  <li>Khóa đào tạo được đánh giá là rất hiệu quả với 53.4% người tham gia nhận thấy khóa học giúp nâng cao nhiều khả năng sử dụng công nghệ số.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Báo Cáo Đánh Giá Hiệu Quả Khóa Tập Huấn Kỹ Thuật Số</p>
          <p className="text-sm mt-2">Dữ liệu được thu thập từ khảo sát trước và sau khóa đào tạo</p>
        </div>
      </footer>
    </div>
  );
}