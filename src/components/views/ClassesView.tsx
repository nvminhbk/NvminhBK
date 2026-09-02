import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassInfo, GradeLevel } from '../../types';
import {
  Plus,
  Search,
  School,
  Users,
  Eye,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  GraduationCap,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';
import { GradeBadge, Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ClassDetailModal } from './ClassDetailModal';

export const ClassesView: React.FC = () => {
  const {
    classes,
    addClass,
    updateClass,
    deleteClass,
    showConfirmDialog,
    selectedClassId,
    setSelectedClassId,
    getClassDetails
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    grade: 10 as GradeLevel,
    academicYear: '2026–2027',
    teacher: 'Thầy Nguyễn Hoàng Nam',
    room: '',
    notes: '',
    status: 'active' as 'active' | 'archived'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filtered classes
  const filteredClasses = classes.filter(cls => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      selectedGradeFilter === 'all' || cls.grade.toString() === selectedGradeFilter;

    const matchesYear =
      selectedYearFilter === 'all' || cls.academicYear === selectedYearFilter;

    return matchesSearch && matchesGrade && matchesYear;
  });

  const handleOpenAddModal = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      grade: 10,
      academicYear: '2026–2027',
      teacher: 'Thầy Nguyễn Hoàng Nam',
      room: 'Phòng Lý 103',
      notes: '',
      status: 'active'
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (cls: ClassInfo) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade,
      academicYear: cls.academicYear,
      teacher: cls.teacher,
      room: cls.room,
      notes: cls.notes || '',
      status: cls.status
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên lớp (ví dụ: 10A1)';
    } else if (
      !editingClass &&
      classes.some(c => c.name.toLowerCase() === formData.name.trim().toLowerCase())
    ) {
      errors.name = 'Tên lớp này đã tồn tại trong hệ thống';
    }
    if (!formData.room.trim()) {
      errors.room = 'Vui lòng nhập phòng học bộ môn';
    }
    if (!formData.teacher.trim()) {
      errors.teacher = 'Vui lòng nhập giáo viên phụ trách';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingClass) {
      updateClass(editingClass.id, formData);
    } else {
      addClass(formData);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteClass = (cls: ClassInfo) => {
    showConfirmDialog({
      title: `Xác nhận xóa lớp ${cls.name}?`,
      message: `Bạn có chắc chắn muốn xóa lớp ${cls.name}? Tất cả dữ liệu học sinh trong lớp này cũng sẽ bị gỡ bỏ khỏi hệ thống.`,
      confirmLabel: 'Xóa lớp học',
      isDestructive: true,
      onConfirm: () => deleteClass(cls.id)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý các lớp giảng dạy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng có {classes.length} lớp học đang được quản lý
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm lớp mới</span>
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
            placeholder="Tìm kiếm theo tên lớp, phòng học, giáo viên..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grade Filter */}
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

          {/* Academic Year */}
          <select
            value={selectedYearFilter}
            onChange={e => setSelectedYearFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Tất cả năm học</option>
            <option value="2026–2027">Năm học 2026–2027</option>
            <option value="2025–2026">Năm học 2025–2026</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Xem dạng bảng"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Xem dạng lưới thẻ"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredClasses.length === 0 ? (
        <EmptyState
          title="Không tìm thấy lớp học nào"
          description="Thử thay đổi bộ lọc hoặc tạo thêm lớp học mới vào hệ thống."
          actionLabel="+ Thêm lớp ngay"
          onAction={handleOpenAddModal}
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12">STT</th>
                  <th className="py-3 px-4">Tên lớp</th>
                  <th className="py-3 px-4">Khối</th>
                  <th className="py-3 px-4">Năm học</th>
                  <th className="py-3 px-4">Sĩ số</th>
                  <th className="py-3 px-4">Giáo viên phụ trách</th>
                  <th className="py-3 px-4">Điểm TB</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClasses.map((cls, idx) => {
                  const details = getClassDetails(cls.id);
                  return (
                    <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {cls.name}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              Lớp {cls.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block">{cls.room}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <GradeBadge grade={cls.grade} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {cls.academicYear}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {cls.studentCount} HS
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {cls.teacher}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-indigo-600">
                        {details.avgScore} <span className="text-[10px] text-slate-400 font-normal">/10</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={cls.status === 'active' ? 'emerald' : 'slate'} size="sm" dot>
                          {cls.status === 'active' ? 'Hoạt động' : 'Lưu trữ'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedClassId(cls.id)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Xem chi tiết lớp"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(cls)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa lớp"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map(cls => {
            const details = getClassDetails(cls.id);
            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-black text-base flex items-center justify-center shadow-xs">
                        {cls.name}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Lớp {cls.name}
                        </h3>
                        <p className="text-xs text-slate-500">{cls.room}</p>
                      </div>
                    </div>
                    <GradeBadge grade={cls.grade} size="sm" />
                  </div>

                  {cls.notes && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg mb-3 line-clamp-2">
                      {cls.notes}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sĩ số</span>
                      <span className="text-sm font-bold text-slate-800">{cls.studentCount} HS</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Điểm TB</span>
                      <span className="text-sm font-bold text-indigo-600">{details.avgScore} / 10</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">{cls.academicYear}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedClassId(cls.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      Xem lớp
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(cls)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded-md"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
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

      {/* Add / Edit Class Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingClass ? `Chỉnh sửa lớp ${editingClass.name}` : 'Thêm lớp học mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên lớp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: 10A3, 11A3..."
                    className={`w-full px-3 py-2 text-xs font-medium bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.name ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>
                  )}
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Năm học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="2026–2027"
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phòng học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Ví dụ: Phòng Lý 103"
                    className={`w-full px-3 py-2 text-xs font-medium bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.room ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                    }`}
                  />
                  {formErrors.room && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.room}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giáo viên phụ trách <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú & Đặc điểm lớp
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ví dụ: Lớp chuyên Tự nhiên, định hướng ôn thi THPT..."
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
                  {editingClass ? 'Lưu thay đổi' : 'Thêm lớp học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Detail Modal */}
      {selectedClassId && (
        <ClassDetailModal
          classId={selectedClassId}
          onClose={() => setSelectedClassId(null)}
        />
      )}
    </div>
  );
};
