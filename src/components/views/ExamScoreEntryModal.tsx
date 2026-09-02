import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Exam } from '../../types';
import {
  X,
  FileSpreadsheet,
  Save,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Percent,
  Search,
  School
} from 'lucide-react';
import { GradeBadge, Badge } from '../common/Badge';
import { formatDate, formatScore, getPerformanceTier } from '../../utils/formatters';

interface ExamScoreEntryModalProps {
  examId: string;
  onClose: () => void;
}

export const ExamScoreEntryModal: React.FC<ExamScoreEntryModalProps> = ({
  examId,
  onClose
}) => {
  const {
    exams,
    students,
    classes,
    examScores,
    saveExamScore,
    addToast
  } = useApp();

  const exam = exams.find(e => e.id === examId);

  // Target eligible students
  const eligibleStudents = useMemo(() => {
    if (!exam) return [];
    if (exam.targetClassIds && exam.targetClassIds.length > 0) {
      return students.filter(s => exam.targetClassIds.includes(s.classId));
    }
    return students.filter(s => s.grade === exam.grade);
  }, [exam, students]);

  // Local state for scores: { [studentId]: { score: string, feedback: string } }
  const [scoresState, setScoresState] = useState<
    Record<string, { score: string; feedback: string }>
  >(() => {
    const map: Record<string, { score: string; feedback: string }> = {};
    eligibleStudents.forEach(std => {
      const existing = examScores.find(
        es => es.examId === examId && es.studentId === std.id
      );
      map[std.id] = {
        score: existing !== undefined ? existing.score.toString() : '',
        feedback: existing?.teacherFeedback || ''
      };
    });
    return map;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  if (!exam) return null;

  const handleScoreChange = (studentId: string, val: string) => {
    setScoresState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: val
      }
    }));
  };

  const handleFeedbackChange = (studentId: string, val: string) => {
    setScoresState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        feedback: val
      }
    }));
  };

  // Real-time statistics of current score state
  const computedStats = useMemo(() => {
    const validScores: number[] = [];
    Object.values(scoresState).forEach((item: { score: string; feedback: string }) => {
      const num = parseFloat(item.score);
      if (!isNaN(num) && num >= 0 && num <= 10) {
        validScores.push(num);
      }
    });

    if (validScores.length === 0) {
      return {
        count: 0,
        avg: '0.0',
        max: '0.0',
        min: '0.0',
        passCount: 0,
        goodCount: 0
      };
    }

    const sum = validScores.reduce((a, b) => a + b, 0);
    const avg = (sum / validScores.length).toFixed(1);
    const max = Math.max(...validScores).toFixed(1);
    const min = Math.min(...validScores).toFixed(1);
    const passCount = validScores.filter(s => s >= 5.0).length;
    const goodCount = validScores.filter(s => s >= 8.0).length;

    return {
      count: validScores.length,
      avg,
      max,
      min,
      passCount,
      goodCount
    };
  }, [scoresState]);

  const handleSaveAllScores = () => {
    let savedCount = 0;
    Object.entries(scoresState).forEach(([studentId, data]: [string, { score: string; feedback: string }]) => {
      const std = students.find(s => s.id === studentId);
      if (!std) return;

      const num = parseFloat(data.score);
      if (!isNaN(num) && num >= 0 && num <= 10) {
        saveExamScore({
          examId: exam.id,
          studentId: std.id,
          studentName: std.name,
          classId: std.classId,
          className: std.className,
          grade: std.grade,
          score: Math.min(10, Math.max(0, num)),
          teacherFeedback: data.feedback.trim() || 'Hoàn thành bài kiểm tra',
          gradedDate: new Date().toISOString().split('T')[0]
        });
        savedCount++;
      }
    });

    addToast(`Đã lưu bảng điểm bài kiểm tra cho ${savedCount} học sinh!`, 'success');
  };

  // Filtered displayed list
  const displayedStudents = eligibleStudents.filter(std => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'all' || std.classId === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-300 font-bold border border-purple-400/30">
                {exam.code}
              </span>
              <GradeBadge grade={exam.grade} size="sm" />
              <span className="text-xs text-slate-300 font-medium">
                {exam.durationMinutes} phút • Ngày thi: {formatDate(exam.examDate)}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
              Bảng nhập điểm: {exam.title}
            </h3>
            <p className="text-xs text-slate-300">{exam.topic}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Computed Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 bg-slate-100 border-b border-slate-200 text-center">
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Đã nhập điểm</span>
            <span className="text-base font-extrabold text-slate-900">
              {computedStats.count} / {eligibleStudents.length} HS
            </span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Điểm trung bình</span>
            <span className="text-base font-extrabold text-indigo-600">
              {computedStats.avg} <span className="text-xs font-normal text-slate-400">/10</span>
            </span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Cao nhất (Max)</span>
            <span className="text-base font-extrabold text-emerald-600">
              {computedStats.max} đ
            </span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Thấp nhất (Min)</span>
            <span className="text-base font-extrabold text-rose-600">
              {computedStats.min} đ
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Tỉ lệ Khá/Giỏi (≥8)</span>
            <span className="text-base font-extrabold text-purple-600">
              {computedStats.count > 0
                ? `${Math.round((computedStats.goodCount / computedStats.count) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Filter controls inside Modal */}
        <div className="px-5 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm học sinh trong danh sách..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            >
              <option value="all">Tất cả các lớp</option>
              {classes
                .filter(c => c.grade === exam.grade)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSaveAllScores}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Lưu tất cả điểm</span>
          </button>
        </div>

        {/* Score Inputs Table */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3 w-10">STT</th>
                  <th className="py-2.5 px-3">Mã HS</th>
                  <th className="py-2.5 px-3">Họ và tên</th>
                  <th className="py-2.5 px-3">Lớp</th>
                  <th className="py-2.5 px-3 w-32">Điểm số (0 - 10)</th>
                  <th className="py-2.5 px-3 w-28">Xếp loại</th>
                  <th className="py-2.5 px-3">Nhận xét của giáo viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedStudents.map((std, idx) => {
                  const state = scoresState[std.id] || { score: '', feedback: '' };
                  const numScore = parseFloat(state.score);
                  const isValidScore = !isNaN(numScore);
                  const tier = isValidScore ? getPerformanceTier(numScore) : null;

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-600">
                        {std.code}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        {std.name}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-600">
                        {std.className}
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={state.score}
                          onChange={e => handleScoreChange(std.id, e.target.value)}
                          placeholder="8.5"
                          className="w-24 px-3 py-1.5 font-bold text-center text-sm text-indigo-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        {tier ? (
                          <Badge
                            variant={
                              tier === 'Xuất sắc'
                                ? 'emerald'
                                : tier === 'Tốt'
                                ? 'blue'
                                : tier === 'Đạt'
                                ? 'amber'
                                : 'rose'
                            }
                            size="sm"
                          >
                            {tier}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 italic">Chưa nhập</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={state.feedback}
                          onChange={e => handleFeedbackChange(std.id, e.target.value)}
                          placeholder="Nhận xét bài làm (Ví dụ: Đạt điểm cao phần động lực học)..."
                          className="w-full px-3 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
