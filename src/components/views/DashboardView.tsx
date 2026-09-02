import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  School,
  Users,
  FileText,
  FileSpreadsheet,
  Award,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertCircle
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
  Legend
} from 'recharts';
import { Badge, GradeBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const {
    stats,
    assignments,
    activityLogs,
    teacherProfile,
    setActiveTab,
    setSelectedAssignmentId,
    setSelectedClassId
  } = useApp();

  // Upcoming assignments
  const upcomingAssignments = [...assignments]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string, dueDate: string) => {
    const isPastDue = new Date(dueDate).getTime() < new Date().getTime();
    if (status === 'closed') {
      return <Badge variant="slate">Đã đóng</Badge>;
    }
    if (isPastDue) {
      return <Badge variant="rose" dot>Quá hạn</Badge>;
    }
    return <Badge variant="emerald" dot>Đang giao</Badge>;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'score_entry':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'assignment_create':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'exam_create':
        return <FileSpreadsheet className="w-4 h-4 text-purple-600" />;
      case 'student_add':
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <School className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-indigo-900/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Năm học {teacherProfile.academicYear} • {teacherProfile.school}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Xin chào, {teacherProfile.name}! 👋
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Chúc thầy một ngày giảng dạy và nghiên cứu Vật lý hiệu quả. Dưới đây là tổng hợp nhanh tình hình học tập của các lớp khối 10, 11 và 12.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('assignments')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-indigo-500/20 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Giao bài tập</span>
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10 backdrop-blur-xs active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Tạo đề kiểm tra</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 5 Primary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-4">
        {/* Total Classes */}
        <div 
          onClick={() => setActiveTab('classes')}
          className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-blue-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng số lớp</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <School className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{stats.totalClasses}</span>
            <span className="text-xs font-medium text-slate-400">lớp</span>
          </div>
          <p className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-0.5">
            Xem danh sách lớp <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Total Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-indigo-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng học sinh</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{stats.totalStudents}</span>
            <span className="text-xs font-medium text-slate-400">học sinh</span>
          </div>
          <p className="mt-2 text-[11px] text-indigo-600 font-semibold flex items-center gap-0.5">
            Quản lý hồ sơ <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Total Assignments */}
        <div 
          onClick={() => setActiveTab('assignments')}
          className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-emerald-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng bài tập</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{stats.totalAssignments}</span>
            <span className="text-xs font-medium text-slate-400">chủ đề</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
            Theo dõi nộp bài <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Total Exams */}
        <div 
          onClick={() => setActiveTab('exams')}
          className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-purple-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đề kiểm tra</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{stats.totalExams}</span>
            <span className="text-xs font-medium text-slate-400">đề thi</span>
          </div>
          <p className="mt-2 text-[11px] text-purple-600 font-semibold flex items-center gap-0.5">
            Nhập bảng điểm <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Overall Average */}
        <div 
          onClick={() => setActiveTab('results')}
          className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-amber-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm TB môn</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{stats.overallAverageScore}</span>
            <span className="text-xs font-medium text-slate-400">/ 10</span>
          </div>
          <p className="mt-2 text-[11px] text-amber-600 font-semibold flex items-center gap-0.5">
            Xem phổ điểm <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Grade-by-Grade 3 Cards (KHỐI 10, KHỐI 11, KHỐI 12) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Thống kê học tập theo từng khối
          </h3>
          <span className="text-xs text-slate-500 font-medium">Chương trình GDPT mới 2018</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Grade 10 Card */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-blue-50/20 rounded-2xl p-5 border border-blue-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-extrabold bg-blue-600 text-white rounded-lg shadow-2xs">
                  KHỐI 10
                </span>
                <span className="text-xs font-semibold text-blue-900">Cơ học & Động lực học</span>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                {stats.grade10.classCount} lớp
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white/90 rounded-xl border border-blue-100 shadow-2xs">
                <span className="text-[11px] font-medium text-slate-500 block">Số học sinh</span>
                <span className="text-xl font-extrabold text-blue-950 mt-0.5 block">{stats.grade10.studentCount} HS</span>
              </div>
              <div className="p-3 bg-white/90 rounded-xl border border-blue-100 shadow-2xs">
                <span className="text-[11px] font-medium text-slate-500 block">Điểm trung bình</span>
                <span className="text-xl font-extrabold text-blue-600 mt-0.5 block">{stats.grade10.avgScore} <span className="text-xs font-normal text-slate-400">/10</span></span>
              </div>
            </div>
          </div>

          {/* Grade 11 Card */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/20 rounded-2xl p-5 border border-indigo-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-extrabold bg-indigo-600 text-white rounded-lg shadow-2xs">
                  KHỐI 11
                </span>
                <span className="text-xs font-semibold text-indigo-900">Dao động & Sóng, Điện từ</span>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                {stats.grade11.classCount} lớp
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[11px] font-medium text-slate-500 block">Số học sinh</span>
                <span className="text-xl font-extrabold text-indigo-950 mt-0.5 block">{stats.grade11.studentCount} HS</span>
              </div>
              <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[11px] font-medium text-slate-500 block">Điểm trung bình</span>
                <span className="text-xl font-extrabold text-indigo-600 mt-0.5 block">{stats.grade11.avgScore} <span className="text-xs font-normal text-slate-400">/10</span></span>
              </div>
            </div>
          </div>

          {/* Grade 12 Card */}
          <div className="bg-gradient-to-br from-purple-50/70 via-white to-purple-50/20 rounded-2xl p-5 border border-purple-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-extrabold bg-purple-600 text-white rounded-lg shadow-2xs">
                  KHỐI 12
                </span>
                <span className="text-xs font-semibold text-purple-900">Vật lý nhiệt & Hạt nhân</span>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full">
                {stats.grade12.classCount} lớp
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white/90 rounded-xl border border-purple-100 shadow-2xs">
                <span className="text-[11px] font-medium text-slate-500 block">Số học sinh</span>
                <span className="text-xl font-extrabold text-purple-950 mt-0.5 block">{stats.grade12.studentCount} HS</span>
              </div>
              <div className="p-3 bg-white/90 rounded-xl border border-purple-100 shadow-2xs">
                <span className="text-[11px] font-medium text-slate-500 block">Điểm trung bình</span>
                <span className="text-xl font-extrabold text-purple-600 mt-0.5 block">{stats.grade12.avgScore} <span className="text-xs font-normal text-slate-400">/10</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Class Average Score */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Điểm trung bình Vật lý theo từng lớp
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                So sánh kết quả điểm bài tập & kiểm tra giữa các lớp
              </p>
            </div>
            <button
              onClick={() => setActiveTab('results')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
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
                  formatter={(value: any) => [`${value} điểm`, 'Điểm TB']}
                  labelFormatter={(label) => `Lớp ${label}`}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar
                  dataKey="avgScore"
                  radius={[6, 6, 0, 0]}
                  fill="#4f46e5"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Performance Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Phân loại kết quả học tập
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tỉ lệ xếp loại của học sinh toàn khối
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.performanceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value}% (${item.payload.count} học sinh)`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {stats.performanceDistribution.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-bold text-slate-900 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Upcoming Assignments + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Assignments Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Bài tập Vật lý gần đến hạn
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Tên bài tập</th>
                  <th className="py-2.5 px-3">Khối</th>
                  <th className="py-2.5 px-3">Hạn nộp</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingAssignments.map(asg => (
                  <tr key={asg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {asg.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {asg.topic}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <GradeBadge grade={asg.grade} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      {formatDate(asg.dueDate)}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(asg.status, asg.dueDate)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedAssignmentId(asg.id);
                          setActiveTab('assignments');
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities Log */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Hoạt động gần đây
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Nhật ký</span>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {activityLogs.slice(0, 5).map(act => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5 shadow-2xs">
                  {getActivityIcon(act.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5 line-clamp-2">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {act.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
