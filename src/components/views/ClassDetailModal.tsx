import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassInfo } from '../../types';
import {
  X,
  Users,
  FileText,
  FileSpreadsheet,
  Award,
  GraduationCap,
  Calendar,
  Building,
  User,
  ArrowRight,
  Plus
} from 'lucide-react';
import { GradeBadge, Badge } from '../common/Badge';
import { formatDate, formatScore } from '../../utils/formatters';

interface ClassDetailModalProps {
  classId: string;
  onClose: () => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({ classId, onClose }) => {
  const {
    getClassDetails,
    setSelectedStudentId,
    setActiveTab,
    setSelectedAssignmentId,
    setSelectedExamId
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'students' | 'assignments' | 'exams' | 'analytics'>('students');

  const { classInfo, students, assignments, exams, avgScore } = getClassDetails(classId);

  if (!classInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
              {classInfo.name}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Lớp {classInfo.name}
                </h3>
                <GradeBadge grade={classInfo.grade} />
                <Badge variant={classInfo.status === 'active' ? 'emerald' : 'slate'} dot>
                  {classInfo.status === 'active' ? 'Đang hoạt động' : 'Lưu trữ'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {classInfo.room} • Năm học {classInfo.academicYear} • GV: {classInfo.teacher}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="grid grid-cols-4 gap-2.5 p-4 bg-slate-100/60 border-b border-slate-200 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">Sĩ số</span>
            <span className="text-base font-extrabold text-slate-900">{students.length} HS</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">Điểm TB môn</span>
            <span className="text-base font-extrabold text-indigo-600">{avgScore} /10</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">Bài tập đã giao</span>
            <span className="text-base font-extrabold text-emerald-600">{assignments.length} bài</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">Đề kiểm tra</span>
            <span className="text-base font-extrabold text-purple-600">{exams.length} đề</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 px-4 bg-white">
          <button
            onClick={() => setActiveTabSub('students')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTabSub === 'students'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Danh sách học sinh ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveTabSub('assignments')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTabSub === 'assignments'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bài tập ({assignments.length})</span>
          </button>
          <button
            onClick={() => setActiveTabSub('exams')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTabSub === 'exams'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Đề kiểm tra ({exams.length})</span>
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTabSub === 'students' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">STT</th>
                      <th className="py-2.5 px-3">Mã HS</th>
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Giới tính</th>
                      <th className="py-2.5 px-3">Ngày sinh</th>
                      <th className="py-2.5 px-3">Điện thoại</th>
                      <th className="py-2.5 px-3 text-right">Hồ sơ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((std, idx) => (
                      <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-600">
                          {std.code}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {std.name}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              std.gender === 'male'
                                ? 'bg-sky-50 text-sky-700'
                                : 'bg-pink-50 text-pink-700'
                            }`}
                          >
                            {std.gender === 'male' ? 'Nam' : 'Nữ'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{formatDate(std.dob)}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                          {std.phone || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedStudentId(std.id);
                              setActiveTab('students');
                              onClose();
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            Xem hồ sơ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTabSub === 'assignments' && (
            <div className="space-y-3">
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có bài tập nào được giao riêng cho lớp này.
                </div>
              ) : (
                assignments.map(asg => (
                  <div
                    key={asg.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-200 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{asg.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Chủ đề: {asg.topic} • Hạn nộp: {formatDate(asg.dueDate)} • {asg.numQuestions} câu hỏi
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAssignmentId(asg.id);
                        setActiveTab('assignments');
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
                    >
                      Chấm điểm
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTabSub === 'exams' && (
            <div className="space-y-3">
              {exams.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có bài kiểm tra nào được gán cho lớp này.
                </div>
              ) : (
                exams.map(ex => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-purple-50/40 rounded-xl border border-slate-200 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                          {ex.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800">{ex.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Thời gian: {ex.durationMinutes} phút • Ngày kiểm tra: {formatDate(ex.examDate)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedExamId(ex.id);
                        setActiveTab('exams');
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-2xs"
                    >
                      Bảng điểm
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
