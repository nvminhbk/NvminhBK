import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  Save,
  AlertCircle
} from 'lucide-react';
import { GradeBadge, Badge } from '../common/Badge';
import { formatDate, formatScore } from '../../utils/formatters';

interface AssignmentDetailModalProps {
  assignmentId: string;
  onClose: () => void;
}

export const AssignmentDetailModal: React.FC<AssignmentDetailModalProps> = ({
  assignmentId,
  onClose
}) => {
  const {
    assignments,
    students,
    classes,
    saveAssignmentSubmission,
    addToast
  } = useApp();

  const assignment = assignments.find(a => a.id === assignmentId);

  // Eligible students for this assignment
  const eligibleStudents = students.filter(s => {
    if (!assignment) return false;
    const targetIds = assignment.targetClassIds || assignment.classIds;
    if (targetIds && targetIds.length > 0) {
      return targetIds.includes(s.classId);
    }
    return s.grade === assignment.grade;
  });

  // Local editing scores map { studentId: { score: number, feedback: string } }
  const [submissionsState, setSubmissionsState] = useState<
    Record<string, { score: string; feedback: string; submitted: boolean }>
  >(() => {
    if (!assignment) return {};
    const map: Record<string, { score: string; feedback: string; submitted: boolean }> = {};
    eligibleStudents.forEach(s => {
      const existing = assignment.submissions?.find(sub => sub.studentId === s.id);
      map[s.id] = {
        score: existing?.score !== undefined ? existing.score.toString() : '',
        feedback: existing?.feedback || '',
        submitted: !!existing
      };
    });
    return map;
  });

  if (!assignment) return null;

  const handleScoreChange = (studentId: string, val: string) => {
    setSubmissionsState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: val
      }
    }));
  };

  const handleFeedbackChange = (studentId: string, val: string) => {
    setSubmissionsState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        feedback: val
      }
    }));
  };

  const handleToggleSubmitted = (studentId: string) => {
    setSubmissionsState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        submitted: !prev[studentId].submitted
      }
    }));
  };

  const handleSaveAll = () => {
    let savedCount = 0;
    Object.entries(submissionsState).forEach(([studentId, data]: [string, { score: string; feedback: string; submitted: boolean }]) => {
      const std = students.find(s => s.id === studentId);
      if (!std) return;

      const numScore = data.score !== '' ? parseFloat(data.score) : undefined;
      const validScore =
        numScore !== undefined && !isNaN(numScore)
          ? Math.min(10, Math.max(0, numScore))
          : undefined;

      if (validScore !== undefined || data.submitted) {
        saveAssignmentSubmission({
          assignmentId: assignment.id,
          studentId: std.id,
          score: validScore !== undefined ? validScore : 8,
          status: 'submitted',
          feedback: data.feedback.trim() || 'Đã nộp bài tập đúng hạn.'
        });
        savedCount++;
      }
    });

    addToast(`Đã lưu điểm và nhận xét cho ${savedCount} học sinh!`, 'success');
  };

  const submittedCount = Object.values(submissionsState).filter(
    (s: { score: string; feedback: string; submitted: boolean }) => s.submitted || s.score !== ''
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <GradeBadge grade={assignment.grade} />
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {assignment.chapter}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Hạn nộp: {formatDate(assignment.dueDate)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{assignment.title}</h3>
            <p className="text-xs text-slate-600 max-w-2xl">{assignment.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info stats strip */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-100/70 border-b border-slate-200 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">Số câu hỏi</span>
            <span className="text-base font-extrabold text-slate-900">{assignment.numQuestions} câu</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">Tỉ lệ nộp bài</span>
            <span className="text-base font-extrabold text-emerald-600">
              {submittedCount} / {eligibleStudents.length} HS
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">Chủ đề Vật lý</span>
            <span className="text-xs font-bold text-indigo-700 truncate block mt-0.5">
              {assignment.topic}
            </span>
          </div>
        </div>

        {/* Grading List Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Danh sách chấm điểm & nhận xét bài tập
            </h4>
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Lưu bảng điểm</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10">STT</th>
                  <th className="py-2.5 px-3">Học sinh</th>
                  <th className="py-2.5 px-3">Lớp</th>
                  <th className="py-2.5 px-3">Trạng thái nộp</th>
                  <th className="py-2.5 px-3 w-28">Điểm số (0-10)</th>
                  <th className="py-2.5 px-3">Nhận xét của giáo viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {eligibleStudents.map((std, idx) => {
                  const state = submissionsState[std.id] || {
                    score: '',
                    feedback: '',
                    submitted: false
                  };

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{std.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{std.code}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-600">
                        {std.className}
                      </td>
                      <td className="py-3 px-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={state.submitted || state.score !== ''}
                            onChange={() => handleToggleSubmitted(std.id)}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                          />
                          <span
                            className={`text-[11px] font-semibold ${
                              state.submitted || state.score !== ''
                                ? 'text-emerald-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {state.submitted || state.score !== '' ? 'Đã nộp' : 'Chưa nộp'}
                          </span>
                        </label>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={state.score}
                          onChange={e => handleScoreChange(std.id, e.target.value)}
                          placeholder="8.5"
                          className="w-20 px-2.5 py-1.5 font-bold text-center text-indigo-600 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={state.feedback}
                          onChange={e => handleFeedbackChange(std.id, e.target.value)}
                          placeholder="Nhận xét (ví dụ: Nắm chắc công thức, trình bày tốt)..."
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
