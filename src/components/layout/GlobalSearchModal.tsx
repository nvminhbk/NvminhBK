import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Users, School, FileText, FileSpreadsheet, X, ArrowRight } from 'lucide-react';
import { GradeBadge } from '../common/Badge';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    students,
    classes,
    assignments,
    exams,
    setActiveTab,
    setSelectedStudentId,
    setSelectedClassId,
    setSelectedAssignmentId,
    setSelectedExamId
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const trimmedQuery = query.trim().toLowerCase();

  const matchedStudents = trimmedQuery
    ? students.filter(
        s =>
          s.name.toLowerCase().includes(trimmedQuery) ||
          s.code.toLowerCase().includes(trimmedQuery) ||
          s.className.toLowerCase().includes(trimmedQuery) ||
          s.phone.includes(trimmedQuery)
      )
    : [];

  const matchedClasses = trimmedQuery
    ? classes.filter(
        c =>
          c.name.toLowerCase().includes(trimmedQuery) ||
          c.teacher.toLowerCase().includes(trimmedQuery) ||
          c.room.toLowerCase().includes(trimmedQuery)
      )
    : [];

  const matchedAssignments = trimmedQuery
    ? assignments.filter(
        a =>
          a.title.toLowerCase().includes(trimmedQuery) ||
          a.chapter.toLowerCase().includes(trimmedQuery) ||
          a.topic.toLowerCase().includes(trimmedQuery)
      )
    : [];

  const matchedExams = trimmedQuery
    ? exams.filter(
        e =>
          e.title.toLowerCase().includes(trimmedQuery) ||
          e.code.toLowerCase().includes(trimmedQuery) ||
          e.topic.toLowerCase().includes(trimmedQuery)
      )
    : [];

  const hasResults =
    matchedStudents.length > 0 ||
    matchedClasses.length > 0 ||
    matchedAssignments.length > 0 ||
    matchedExams.length > 0;

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setActiveTab('students');
    setIsGlobalSearchOpen(false);
  };

  const handleSelectClass = (id: string) => {
    setSelectedClassId(id);
    setActiveTab('classes');
    setIsGlobalSearchOpen(false);
  };

  const handleSelectAssignment = (id: string) => {
    setSelectedAssignmentId(id);
    setActiveTab('assignments');
    setIsGlobalSearchOpen(false);
  };

  const handleSelectExam = (id: string) => {
    setSelectedExamId(id);
    setActiveTab('exams');
    setIsGlobalSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tìm kiếm học sinh, lớp học, bài tập Vật lý, đề kiểm tra..."
            className="w-full bg-transparent text-sm md:text-base font-medium text-slate-800 focus:outline-hidden placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-200/70 hover:bg-slate-200 rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!trimmedQuery && (
            <div className="text-center py-10">
              <p className="text-sm text-slate-500">
                Nhập tên học sinh (ví dụ: <span className="font-semibold text-indigo-600">Nguyễn Văn An</span>), tên lớp (<span className="font-semibold text-indigo-600">10A1</span>) hoặc bài tập để tìm nhanh.
              </p>
            </div>
          )}

          {trimmedQuery && !hasResults && (
            <div className="text-center py-10">
              <p className="text-sm font-semibold text-slate-700">Không tìm thấy kết quả phù hợp</p>
              <p className="text-xs text-slate-400 mt-1">Vui lòng thử lại với từ khóa khác</p>
            </div>
          )}

          {/* Students Group */}
          {matchedStudents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Học sinh ({matchedStudents.length})</span>
              </div>
              <div className="divide-y divide-slate-100 bg-slate-50/70 rounded-xl border border-slate-200/60 overflow-hidden">
                {matchedStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectStudent(student.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-indigo-50/60 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-400">{student.code}</span>
                          <span>•</span>
                          <span>Lớp {student.className}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <GradeBadge grade={student.grade} size="sm" />
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Classes Group */}
          {matchedClasses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                <School className="w-4 h-4 text-blue-600" />
                <span>Lớp học ({matchedClasses.length})</span>
              </div>
              <div className="divide-y divide-slate-100 bg-slate-50/70 rounded-xl border border-slate-200/60 overflow-hidden">
                {matchedClasses.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-blue-50/60 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                        {cls.name}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          Lớp {cls.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {cls.room} • Sĩ số: {cls.studentCount} học sinh
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <GradeBadge grade={cls.grade} size="sm" />
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Group */}
          {matchedAssignments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Bài tập Vật lý ({matchedAssignments.length})</span>
              </div>
              <div className="divide-y divide-slate-100 bg-slate-50/70 rounded-xl border border-slate-200/60 overflow-hidden">
                {matchedAssignments.map(asg => (
                  <button
                    key={asg.id}
                    onClick={() => handleSelectAssignment(asg.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-emerald-50/60 transition-colors text-left group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors truncate">
                        {asg.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {asg.topic} • Hạn nộp: {asg.dueDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <GradeBadge grade={asg.grade} size="sm" />
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exams Group */}
          {matchedExams.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                <span>Đề kiểm tra & Đề thi ({matchedExams.length})</span>
              </div>
              <div className="divide-y divide-slate-100 bg-slate-50/70 rounded-xl border border-slate-200/60 overflow-hidden">
                {matchedExams.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => handleSelectExam(ex.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-purple-50/60 transition-colors text-left group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-purple-600 transition-colors truncate">
                        [{ex.code}] {ex.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {ex.durationMinutes} phút • Ngày thi: {ex.examDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <GradeBadge grade={ex.grade} size="sm" />
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
