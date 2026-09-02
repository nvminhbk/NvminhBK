import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  School,
  Sparkles,
  Download,
  Filter,
  ArrowUpRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from 'recharts';
import { GradeBadge, Badge } from '../common/Badge';
import { formatScore, getPerformanceTier } from '../../utils/formatters';

export const ResultsAnalyticsView: React.FC = () => {
  const {
    students,
    classes,
    stats,
    getStudentStats,
    setSelectedStudentId,
    setActiveTab,
    addToast
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Compute all students with their calculated average score
  const studentResults = useMemo(() => {
    return students
      .filter(s => {
        const matchesGrade = selectedGrade === 'all' || s.grade.toString() === selectedGrade;
        const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
        return matchesGrade && matchesClass;
      })
      .map(std => {
        const sStats = getStudentStats(std.id);
        const avg = parseFloat(sStats.overallAverage);
        const tier = getPerformanceTier(avg);
        return {
          ...std,
          avg,
          tier,
          examCount: sStats.examsTaken,
          assignmentCount: sStats.assignmentsDone
        };
      });
  }, [students, selectedGrade, selectedClass, getStudentStats]);

  // Score distribution buckets (0-4.9, 5.0-6.4, 6.5-7.9, 8.0-8.9, 9.0-10)
  const scoreBuckets = useMemo(() => {
    const buckets = [
      { range: '0 - 4.9 (Yếu)', count: 0, color: '#f43f5e' },
      { range: '5.0 - 6.4 (TB)', count: 0, color: '#f59e0b' },
      { range: '6.5 - 7.9 (Khá)', count: 0, color: '#6366f1' },
      { range: '8.0 - 8.9 (Giỏi)', count: 0, color: '#3b82f6' },
      { range: '9.0 - 10 (Xuất sắc)', count: 0, color: '#10b981' }
    ];

    studentResults.forEach(s => {
      if (s.avg < 5.0) buckets[0].count++;
      else if (s.avg < 6.5) buckets[1].count++;
      else if (s.avg < 8.0) buckets[2].count++;
      else if (s.avg < 9.0) buckets[3].count++;
      else buckets[4].count++;
    });

    return buckets;
  }, [studentResults]);

  // Overall average for the filtered set
  const filteredAverage = useMemo(() => {
    if (studentResults.length === 0) return '0.0';
    const sum = studentResults.reduce((a, b) => a + b.avg, 0);
    return (sum / studentResults.length).toFixed(1);
  }, [studentResults]);

  // Top Performers (Rank 1-10)
  const topStudents = useMemo(() => {
    return [...studentResults].sort((a, b) => b.avg - a.avg).slice(0, 10);
  }, [studentResults]);

  // Underperforming students needing support (Score < 6.5)
  const studentsNeedingHelp = useMemo(() => {
    return studentResults.filter(s => s.avg < 6.5).sort((a, b) => a.avg - b.avg);
  }, [studentResults]);

  // Export summary report
  const handleExportReport = () => {
    addToast('Đã xuất báo cáo thống kê kết quả học tập thành công!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Kết quả học tập & Phân tích chất lượng bộ môn
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Báo cáo phổ điểm, danh sách học sinh xuất sắc và diện học sinh cần củng cố kiến thức
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Bộ lọc phạm vi phân tích:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={e => {
              setSelectedGrade(e.target.value);
              setSelectedClass('all');
            }}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả các khối (10, 11, 12)</option>
            <option value="10">Chỉ Khối 10</option>
            <option value="11">Chỉ Khối 11</option>
            <option value="12">Chỉ Khối 12</option>
          </select>

          {/* Class filter */}
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả các lớp</option>
            {classes
              .filter(c => selectedGrade === 'all' || c.grade.toString() === selectedGrade)
              .map(cls => (
                <option key={cls.id} value={cls.id}>
                  Lớp {cls.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Điểm TB môn Vật lý
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black text-indigo-600">{filteredAverage}</span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Dựa trên {studentResults.length} học sinh
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Tỉ lệ Đạt chuẩn (≥ 5.0)
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black text-emerald-600">
              {studentResults.length > 0
                ? `${Math.round(
                    (studentResults.filter(s => s.avg >= 5.0).length /
                      studentResults.length) *
                      100
                  )}%`
                : '0%'}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {studentResults.filter(s => s.avg >= 5.0).length} học sinh đạt yêu cầu
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Học lực Giỏi & Xuất sắc (≥ 8.0)
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black text-blue-600">
              {studentResults.length > 0
                ? `${Math.round(
                    (studentResults.filter(s => s.avg >= 8.0).length /
                      studentResults.length) *
                      100
                  )}%`
                : '0%'}
            </span>
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
            {studentResults.filter(s => s.avg >= 8.0).length} học sinh mũi nhọn
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Cần củng cố kiến thức (&lt; 6.5)
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black text-rose-600">
              {studentsNeedingHelp.length}
            </span>
            <span className="text-xs text-slate-400">học sinh</span>
          </div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
            Cần phụ đạo thêm các chủ đề khó
          </span>
        </div>
      </div>

      {/* 2 Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phổ điểm Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Phân bố phổ điểm môn Vật lý
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Số lượng học sinh trong từng khung điểm
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="range" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} học sinh`, 'Số lượng']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreBuckets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Điểm TB giữa các lớp */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              So sánh điểm trung bình các lớp
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mức độ đồng đều kiến thức giữa các lớp bộ môn
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.classAverageScores}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="className" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} điểm`, 'Điểm TB']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="avgScore" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bảng vàng thành tích (Top 10) & Danh sách cần củng cố */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 High Performers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Bảng vàng thành tích – Top học sinh xuất sắc
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {topStudents.map((std, idx) => (
              <div
                key={std.id}
                onClick={() => {
                  setSelectedStudentId(std.id);
                  setActiveTab('students');
                }}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-700'
                        : idx === 2
                        ? 'bg-amber-900/10 text-amber-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {std.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Lớp {std.className} • Khối {std.grade}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-indigo-600">
                    {std.avg} <span className="text-[10px] text-slate-400 font-normal">/10</span>
                  </span>
                  <Badge variant="emerald" size="sm">
                    {std.tier}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Học sinh cần phụ đạo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900">
              Danh sách học sinh cần củng cố kiến thức
            </h3>
          </div>

          {studentsNeedingHelp.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Tuyệt vời! Hiện không có học sinh nào dưới 6.5 điểm.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {studentsNeedingHelp.map(std => (
                <div
                  key={std.id}
                  onClick={() => {
                    setSelectedStudentId(std.id);
                    setActiveTab('students');
                  }}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {std.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Lớp {std.className} • Mã: {std.code}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-extrabold text-rose-600">
                      {std.avg} /10
                    </span>
                    <Badge variant="rose" size="sm" dot>
                      Cần phụ đạo
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
