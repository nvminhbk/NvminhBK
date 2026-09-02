import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, GradeLevel } from '../../types';
import { physicsCurriculum } from '../../data/physicsTopics';
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Eye,
  Edit2,
  Trash2,
  BookOpen,
  Award,
  X
} from 'lucide-react';
import { GradeBadge, Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { AssignmentDetailModal } from './AssignmentDetailModal';
import { formatDate } from '../../utils/formatters';

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    classes,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    showConfirmDialog,
    selectedAssignmentId,
    setSelectedAssignmentId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    grade: 10 as GradeLevel,
    chapter: '',
    topic: '',
    targetClassIds: [] as string[],
    dueDate: '2026-09-20',
    assignedDate: '2026-09-02',
    numQuestions: 20,
    description: '',
    status: 'active' as 'active' | 'closed'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // When grade changes in form, update chapter/topic defaults
  const currentGradeCurriculum =
    physicsCurriculum.find(c => c.grade === formData.grade) || physicsCurriculum[0];

  const handleGradeChange = (grade: GradeLevel) => {
    const cur = physicsCurriculum.find(c => c.grade === grade) || physicsCurriculum[0];
    const firstChapter = cur.chapters[0];
    setFormData(prev => ({
      ...prev,
      grade,
      chapter: firstChapter.name,
      topic: firstChapter.topics[0] || '',
      targetClassIds: classes.filter(c => c.grade === grade).map(c => c.id)
    }));
  };

  const handleChapterChange = (chapterName: string) => {
    const foundChap = currentGradeCurriculum.chapters.find(c => c.name === chapterName);
    setFormData(prev => ({
      ...prev,
      chapter: chapterName,
      topic: foundChap ? foundChap.topics[0] : ''
    }));
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

  const filteredAssignments = assignments.filter(asg => {
    const matchesSearch =
      asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      selectedGradeFilter === 'all' || asg.grade.toString() === selectedGradeFilter;

    const isPastDue = new Date(asg.dueDate).getTime() < new Date().getTime();
    let currentStatus = asg.status;
    if (asg.status === 'active' && isPastDue) {
      currentStatus = 'overdue' as any;
    }

    const matchesStatus =
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'overdue' ? isPastDue && asg.status === 'active' : asg.status === selectedStatusFilter);

    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingAssignment(null);
    const initialGrade: GradeLevel = 10;
    const cur = physicsCurriculum.find(c => c.grade === initialGrade)!;
    setFormData({
      title: '',
      grade: initialGrade,
      chapter: cur.chapters[0].name,
      topic: cur.chapters[0].topics[0],
      targetClassIds: classes.filter(c => c.grade === initialGrade).map(c => c.id),
      dueDate: '2026-09-25',
      assignedDate: '2026-09-02',
      numQuestions: 20,
      description: 'Làm bài tập trắc nghiệm và nộp đúng hạn.',
      status: 'active'
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (asg: Assignment) => {
    setEditingAssignment(asg);
    setFormData({
      title: asg.title,
      grade: asg.grade,
      chapter: asg.chapter,
      topic: asg.topic,
      targetClassIds: asg.targetClassIds || asg.classIds || [],
      dueDate: asg.dueDate,
      assignedDate: asg.assignedDate,
      numQuestions: asg.numQuestions,
      description: asg.description || asg.content || '',
      status: asg.status
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) {
      errors.title = 'Vui lòng nhập tên bài tập';
    }
    if (!formData.chapter) {
      errors.chapter = 'Vui lòng chọn chương học';
    }
    if (!formData.topic) {
      errors.topic = 'Vui lòng chọn chủ đề Vật lý';
    }
    if (!formData.dueDate) {
      errors.dueDate = 'Vui lòng chọn hạn nộp bài';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, formData);
    } else {
      addAssignment({
        ...formData,
        submissions: []
      });
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteAssignment = (asg: Assignment) => {
    showConfirmDialog({
      title: `Xác nhận xóa bài tập?`,
      message: `Bạn có chắc chắn muốn xóa "${asg.title}"? Tất cả bài làm và điểm chấm của học sinh cũng sẽ bị xóa.`,
      confirmLabel: 'Xóa bài tập',
      isDestructive: true,
      onConfirm: () => deleteAssignment(asg.id)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý bài tập Vật lý THPT
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi giao bài tập trắc nghiệm và chấm điểm theo từng chuyên đề
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Giao bài tập mới</span>
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
            placeholder="Tìm theo tên bài tập, chương, chủ đề Vật lý..."
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

          {/* Status */}
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang giao</option>
            <option value="closed">Đã đóng</option>
            <option value="overdue">Quá hạn</option>
          </select>
        </div>
      </div>

      {/* Assignments Cards Grid */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="Chưa có bài tập nào phù hợp"
          description="Hãy tạo bài tập Vật lý mới để giao cho học sinh ôn tập."
          actionLabel="+ Giao bài tập"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map(asg => {
            const isPastDue = new Date(asg.dueDate).getTime() < new Date().getTime();
            const targetIds = asg.targetClassIds || asg.classIds || [];
            const targetClasses = classes.filter(c => targetIds.includes(c.id));
            const subCount = asg.submissions?.length || 0;

            return (
              <div
                key={asg.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <GradeBadge grade={asg.grade} size="sm" />
                      <span className="text-[11px] font-bold text-slate-500 truncate max-w-[140px]">
                        {asg.chapter}
                      </span>
                    </div>
                    <Badge
                      variant={
                        asg.status === 'closed'
                          ? 'slate'
                          : isPastDue
                          ? 'rose'
                          : 'emerald'
                      }
                      size="sm"
                      dot
                    >
                      {asg.status === 'closed'
                        ? 'Đã đóng'
                        : isPastDue
                        ? 'Quá hạn'
                        : 'Đang giao'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {asg.title}
                  </h3>
                  <p className="text-xs text-indigo-600 font-semibold mt-1 truncate">
                    📌 {asg.topic}
                  </p>

                  <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl line-clamp-2 border border-slate-100">
                    {asg.description || asg.content || 'Bài tập thực hành Vật lý.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Số câu hỏi</span>
                      <span className="text-sm font-extrabold text-slate-800">{asg.numQuestions} câu</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Đã nộp bài</span>
                      <span className="text-sm font-extrabold text-emerald-600">{subCount} HS</span>
                    </div>
                  </div>

                  {targetClasses.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-3 text-[11px] text-slate-500">
                      <span className="font-semibold">Lớp:</span>
                      {targetClasses.map(c => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hạn: {formatDate(asg.dueDate)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedAssignmentId(asg.id)}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
                    >
                      Chấm bài
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(asg)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded-md"
                      title="Sửa bài tập"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(asg)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                      title="Xóa bài tập"
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

      {/* Add / Edit Assignment Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingAssignment ? 'Chỉnh sửa bài tập' : 'Giao bài tập Vật lý mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề bài tập <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Bài tập trắc nghiệm Định luật II Newton"
                  className={`w-full px-3 py-2 text-xs font-medium bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    formErrors.title ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khối <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.grade}
                    onChange={e => handleGradeChange(Number(e.target.value) as GradeLevel)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chương học <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.chapter}
                    onChange={e => handleChapterChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    {currentGradeCurriculum.chapters.map(chap => (
                      <option key={chap.id} value={chap.name}>
                        {chap.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chủ đề / Chuyên đề <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.topic}
                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    {currentGradeCurriculum.chapters
                      .find(c => c.name === formData.chapter)
                      ?.topics.map((t, idx) => (
                        <option key={idx} value={t}>
                          {t}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giao cho các lớp
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
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Lớp {cls.name}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số lượng câu hỏi
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.numQuestions}
                    onChange={e => setFormData({ ...formData, numQuestions: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày giao
                  </label>
                  <input
                    type="date"
                    value={formData.assignedDate}
                    onChange={e => setFormData({ ...formData, assignedDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hạn nộp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả & Hướng dẫn làm bài
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ghi chú thêm về kiến thức trọng tâm hoặc lưu ý khi giải bài..."
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
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
                  {editingAssignment ? 'Cập nhật' : 'Giao bài tập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Detail Modal */}
      {selectedAssignmentId && (
        <AssignmentDetailModal
          assignmentId={selectedAssignmentId}
          onClose={() => setSelectedAssignmentId(null)}
        />
      )}
    </div>
  );
};
