import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exam, ExamType, GradeLevel } from '../../types';
import {
  Plus,
  Search,
  FileSpreadsheet,
  Calendar,
  Clock,
  Award,
  Users,
  Eye,
  Edit2,
  Trash2,
  BookOpen,
  Sparkles,
  School,
  X
} from 'lucide-react';
import { GradeBadge, Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ExamScoreEntryModal } from './ExamScoreEntryModal';
import { formatDate, formatScore } from '../../utils/formatters';

export const ExamsView: React.FC = () => {
  const {
    exams,
    classes,
    examScores,
    addExam,
    updateExam,
    deleteExam,
    showConfirmDialog,
    selectedExamId,
    setSelectedExamId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('all');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    grade: 10 as GradeLevel,
    type: '45_min' as ExamType,
    semester: 'HK1' as 'HK1' | 'HK2' | 'both',
    durationMinutes: 45,
    totalQuestions: 40,
    examDate: '2026-09-30',
    targetClassIds: [] as string[],
    topic: 'Vật lý THPT',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredExams = exams.filter(ex => {
    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      selectedGradeFilter === 'all' || ex.grade.toString() === selectedGradeFilter;

    const matchesType =
      selectedTypeFilter === 'all' || ex.type === selectedTypeFilter;

    const matchesSemester =
      selectedSemesterFilter === 'all' || ex.semester === selectedSemesterFilter;

    return matchesSearch && matchesGrade && matchesType && matchesSemester;
  });

  const getExamTypeLabel = (type: ExamType) => {
    switch (type) {
      case '15_min':
        return 'Kiểm tra 15p';
      case '45_min':
        return 'Kiểm tra 1 tiết (45p)';
      case 'midterm':
        return 'Thi giữa kỳ';
      case 'final':
        return 'Thi cuối kỳ';
    }
  };

  const getExamTypeBadge = (type: ExamType) => {
    switch (type) {
      case '15_min':
        return <Badge variant="blue">15 Phút</Badge>;
      case '45_min':
        return <Badge variant="indigo">1 Tiết (45p)</Badge>;
      case 'midterm':
        return <Badge variant="purple">Giữa kỳ</Badge>;
      case 'final':
        return <Badge variant="rose">Cuối kỳ</Badge>;
    }
  };

  const handleOpenAddModal = () => {
    setEditingExam(null);
    const initialGrade: GradeLevel = 10;
    const generatedCode = `DE-${initialGrade}-${Math.floor(10 + Math.random() * 90)}`;
    setFormData({
      code: generatedCode,
      title: '',
      grade: initialGrade,
      type: '45_min',
      semester: 'HK1',
      durationMinutes: 45,
      totalQuestions: 40,
      examDate: '2026-10-15',
      targetClassIds: classes.filter(c => c.grade === initialGrade).map(c => c.id),
      topic: 'Động lực học chất điểm',
      notes: ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (ex: Exam) => {
    setEditingExam(ex);
    setFormData({
      code: ex.code,
      title: ex.title,
      grade: ex.grade,
      type: ex.type,
      semester: ex.semester,
      durationMinutes: ex.durationMinutes,
      totalQuestions: ex.totalQuestions,
      examDate: ex.examDate,
      targetClassIds: ex.targetClassIds || [],
      topic: ex.topic,
      notes: ex.notes || ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleToggleClass = (classId: string) => {
    setFormData(prev => {
      const exists = prev.targetClassIds.includes(classId);
      return {
        ...prev,
        targetClassIds: exists
          ? prev.targetClassIds.filter(id => id !== classId)
          : [...prev.targetClassIds, classId]
      };
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề bài kiểm tra';
    }
    if (!formData.code.trim()) {
      errors.code = 'Vui lòng nhập mã đề thi';
    }
    if (!formData.topic.trim()) {
      errors.topic = 'Vui lòng nhập chủ đề kiểm tra';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingExam) {
      updateExam(editingExam.id, formData);
    } else {
      addExam(formData);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteExam = (ex: Exam) => {
    showConfirmDialog({
      title: `Xác nhận xóa đề kiểm tra [${ex.code}]?`,
      message: `Bạn có chắc chắn muốn xóa "${ex.title}"? Toàn bộ điểm số bài thi của học sinh cho đề này cũng sẽ bị xóa.`,
      confirmLabel: 'Xóa đề thi',
      isDestructive: true,
      onConfirm: () => deleteExam(ex.id)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý đề kiểm tra & Đề thi Vật lý THPT
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Soạn đề trắc nghiệm, nhập bảng điểm tập trung và tự động phân tích phổ điểm
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo đề kiểm tra mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, mã đề thi, chủ đề kiểm tra..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grade */}
          <select
            value={selectedGradeFilter}
            onChange={e => setSelectedGradeFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả các khối</option>
            <option value="10">Khối 10</option>
            <option value="11">Khối 11</option>
            <option value="12">Khối 12</option>
          </select>

          {/* Exam Type */}
          <select
            value={selectedTypeFilter}
            onChange={e => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả loại bài</option>
            <option value="15_min">Kiểm tra 15p</option>
            <option value="45_min">Kiểm tra 1 tiết (45p)</option>
            <option value="midterm">Giữa kỳ</option>
            <option value="final">Cuối kỳ</option>
          </select>

          {/* Semester */}
          <select
            value={selectedSemesterFilter}
            onChange={e => setSelectedSemesterFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả học kỳ</option>
            <option value="HK1">Học kỳ I</option>
            <option value="HK2">Học kỳ II</option>
          </select>
        </div>
      </div>

      {/* Exam Cards Grid */}
      {filteredExams.length === 0 ? (
        <EmptyState
          title="Không tìm thấy đề kiểm tra nào"
          description="Tạo đề kiểm tra mới để nhập điểm và theo dõi phổ điểm học sinh."
          actionLabel="+ Tạo đề kiểm tra"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map(ex => {
            const scoresForThisExam = examScores.filter(s => s.examId === ex.id);
            const targetClasses = classes.filter(c => ex.targetClassIds?.includes(c.id));

            let avgScore = 'Chưa có';
            if (scoresForThisExam.length > 0) {
              const sum = scoresForThisExam.reduce((a, b) => a + b.score, 0);
              avgScore = (sum / scoresForThisExam.length).toFixed(1);
            }

            return (
              <div
                key={ex.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        {ex.code}
                      </span>
                      <GradeBadge grade={ex.grade} size="sm" />
                    </div>
                    {getExamTypeBadge(ex.type)}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {ex.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                    Chủ đề: <span className="font-semibold text-slate-700">{ex.topic}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Thời gian</span>
                      <span className="text-sm font-extrabold text-slate-800">{ex.durationMinutes} phút</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Điểm TB</span>
                      <span className="text-sm font-extrabold text-indigo-600">
                        {avgScore !== 'Chưa có' ? `${avgScore} / 10` : 'Chưa nhập'}
                      </span>
                    </div>
                  </div>

                  {targetClasses.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-3 text-[11px] text-slate-500">
                      <span className="font-semibold">Lớp thi:</span>
                      {targetClasses.map(c => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(ex.examDate)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedExamId(ex.id)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
                    >
                      Bảng điểm ({scoresForThisExam.length})
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(ex)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded-md"
                      title="Sửa thông tin đề"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExam(ex)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                      title="Xóa đề"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingExam ? `Chỉnh sửa đề [${editingExam.code}]` : 'Tạo đề kiểm tra Vật lý mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã đề <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    placeholder="DE-10-01"
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                  {formErrors.code && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.code}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tiêu đề đề kiểm tra <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ví dụ: Kiểm tra 1 tiết - Động lực học chất điểm"
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                  {formErrors.title && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.title}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khối <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.grade}
                    onChange={e =>
                      setFormData({ ...formData, grade: Number(e.target.value) as GradeLevel })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Loại bài kiểm tra <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={e =>
                      setFormData({ ...formData, type: e.target.value as ExamType })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="15_min">Kiểm tra 15 phút</option>
                    <option value="45_min">Kiểm tra 1 tiết (45p)</option>
                    <option value="midterm">Thi giữa kỳ</option>
                    <option value="final">Thi cuối kỳ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Học kỳ <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.semester}
                    onChange={e =>
                      setFormData({ ...formData, semester: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="HK1">Học kỳ I</option>
                    <option value="HK2">Học kỳ II</option>
                    <option value="both">Cả năm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thời gian (phút)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={formData.durationMinutes}
                    onChange={e =>
                      setFormData({ ...formData, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tổng số câu hỏi
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.totalQuestions}
                    onChange={e =>
                      setFormData({ ...formData, totalQuestions: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày kiểm tra
                  </label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={e => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chủ đề / Chuyên đề kiểm tra <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Ví dụ: Định luật Newton, Chuyển động biến đổi đều..."
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Áp dụng cho các lớp
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {classes
                    .filter(c => c.grade === formData.grade)
                    .map(cls => {
                      const isSelected = formData.targetClassIds.includes(cls.id);
                      return (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => handleToggleClass(cls.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-2xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Lớp {cls.name}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                >
                  {editingExam ? 'Cập nhật' : 'Tạo đề kiểm tra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exam Score Entry Modal */}
      {selectedExamId && (
        <ExamScoreEntryModal
          examId={selectedExamId}
          onClose={() => setSelectedExamId(null)}
        />
      )}
    </div>
  );
};
