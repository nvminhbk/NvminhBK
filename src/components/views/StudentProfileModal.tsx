import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  School,
  Award,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus
} from 'lucide-react';
import { GradeBadge, Badge } from '../common/Badge';
import { formatDate, formatScore, getPerformanceTier } from '../../utils/formatters';

interface StudentProfileModalProps {
  studentId: string;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  studentId,
  onClose
}) => {
  const {
    students,
    getStudentStats,
    exams,
    assignments,
    saveExamScore,
    saveAssignmentSubmission
  } = useApp();

  const [activeTab, setActiveTab] = useState<'exams' | 'assignments' | 'notes'>('exams');

  const student = students.find(s => s.id === studentId);
  const studentStats = getStudentStats(studentId);

  if (!student) return null;

  const performanceTier = getPerformanceTier(parseFloat(studentStats.overallAverage) || 0);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Xuất sắc':
        return <Badge variant="emerald" dot>Xuất sắc</Badge>;
      case 'Tốt':
        return <Badge variant="blue" dot>Tốt</Badge>;
      case 'Đạt':
        return <Badge variant="amber" dot>Đạt</Badge>;
      default:
        return <Badge variant="rose" dot>Chưa đạt - Cần bồi dưỡng</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {student.name}
                  </h2>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/10">
                    {student.code}
                  </span>
                  <GradeBadge grade={student.grade} size="sm" />
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-indigo-400" />
                    Lớp {student.className}
                  </span>
                  <span>•</span>
                  <span>{student.gender === 'male' ? 'Nam' : 'Nữ'}</span>
                  <span>•</span>
                  <span>Sinh: {formatDate(student.dob)}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar inside Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium block">Điểm TB môn Vật lý</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-cyan-300">{studentStats.overallAverage}</span>
                <span className="text-xs text-slate-400">/ 10</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium block">Xếp loại học lực</span>
              <div className="mt-1">
                {getTierBadge(performanceTier)}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium block">Bài kiểm tra đã làm</span>
              <span className="text-xl font-black text-white mt-0.5 block">{studentStats.examsTaken} bài</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium block">Bài tập đã hoàn thành</span>
              <span className="text-xl font-black text-white mt-0.5 block">{studentStats.assignmentsDone} bài</span>
            </div>
          </div>
        </div>

        {/* Contact Info & Notes Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600">
          {student.phone && (
            <div className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>SĐT HS: <span className="font-mono text-slate-800">{student.phone}</span></span>
            </div>
          )}
          {student.parentPhone && (
            <div className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>SĐT Phụ huynh: <span className="font-mono text-slate-800">{student.parentPhone}</span></span>
            </div>
          )}
          {student.email && (
            <div className="flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>{student.email}</span>
            </div>
          )}
          {student.address && (
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-xs">{student.address}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'exams'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bảng điểm kiểm tra ({studentStats.examScores.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'assignments'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Kết quả bài tập ({studentStats.assignmentSubmissions.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'exams' && (
            <div className="space-y-4">
              {studentStats.examScores.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Học sinh chưa có điểm kiểm tra nào.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Tên đề kiểm tra</th>
                        <th className="py-2.5 px-3">Mã đề</th>
                        <th className="py-2.5 px-3">Ngày thi</th>
                        <th className="py-2.5 px-3">Điểm số</th>
                        <th className="py-2.5 px-3">Đánh giá</th>
                        <th className="py-2.5 px-3">Nhận xét</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentStats.examScores.map(score => {
                        const exam = exams.find(e => e.id === score.examId);
                        const tier = getPerformanceTier(score.score);
                        return (
                          <tr key={score.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 font-bold text-slate-800">
                              {exam ? exam.title : 'Bài kiểm tra'}
                            </td>
                            <td className="py-3 px-3 font-mono text-purple-700 font-semibold">
                              {exam?.code || '-'}
                            </td>
                            <td className="py-3 px-3 text-slate-500">
                              {formatDate(score.gradedDate)}
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-base font-extrabold text-indigo-600">
                                {formatScore(score.score)}
                              </span>
                              <span className="text-[10px] text-slate-400"> /10</span>
                            </td>
                            <td className="py-3 px-3">
                              {getTierBadge(tier)}
                            </td>
                            <td className="py-3 px-3 text-slate-600 italic">
                              {score.teacherFeedback || 'Đã chấm bài'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {studentStats.assignmentSubmissions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có lịch sử nộp bài tập nào.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Tên bài tập</th>
                        <th className="py-2.5 px-3">Chủ đề</th>
                        <th className="py-2.5 px-3">Ngày nộp</th>
                        <th className="py-2.5 px-3">Trạng thái</th>
                        <th className="py-2.5 px-3">Điểm số</th>
                        <th className="py-2.5 px-3">Nhận xét của thầy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentStats.assignmentSubmissions.map(sub => {
                        const asg = assignments.find(a => a.id === sub.assignmentId);
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 font-bold text-slate-800">
                              {asg ? asg.title : 'Bài tập Vật lý'}
                            </td>
                            <td className="py-3 px-3 text-slate-500">
                              {asg?.topic || '-'}
                            </td>
                            <td className="py-3 px-3 text-slate-500">
                              {formatDate(sub.submittedAt)}
                            </td>
                            <td className="py-3 px-3">
                              <Badge variant={sub.score !== undefined ? 'emerald' : sub.status === 'submitted' ? 'blue' : 'amber'} size="sm">
                                {sub.score !== undefined ? 'Đã chấm điểm' : sub.status === 'submitted' ? 'Đã nộp' : 'Chưa nộp'}
                              </Badge>
                            </td>
                            <td className="py-3 px-3">
                              {sub.score !== undefined ? (
                                <span className="font-extrabold text-emerald-600 text-sm">
                                  {formatScore(sub.score)} / 10
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-slate-600 italic">
                              {sub.feedback || 'Hoàn thành bài tập tốt'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
